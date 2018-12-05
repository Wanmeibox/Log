YUI.add("yam-control-table-selector", function(Y){

	var Y2 = Y.namespace("YAM"),
		jQuery = Y.jQuery,
		$ = jQuery,
		SGrid = Slick.Grid,
		TABLESELECTOR = "tableselector",
		CONTENTBOX = "contentBox",
		BOUNDINGBOX = "boundingBox",
		EVENT_ROW_MOUSE_ENTER= "matrix:mouseEnter",
		EVENT_ROW_MOUSE_LEAVE = "matrix:mouseLeave",
		EVENT_ROW_SELECTED = "matrix:rowSelected",
		EVENT_ROW_DOUBLECLICK = "matrix:rowDoubleClicked",
		EVENT_ROW_OPENMENU = "matrix:rowMenuOpened",
		EVENT_SORTED = "matrix:sorted",
        Sortable = Y2.Sortable;

	Y2.TableSelector  = Y.Base.create(TABLESELECTOR , Y.Widget, [], {

		initializer: function() {
			var self = this;
			this._grid = null;
			this.options = {
				editable: true,
				enableCellNavigation: true,
				enableColumnReorder: false,
				asyncEditorLoading: false,
	            autoEdit: true,
				multiSelect: false,
				rowHeight:40,
                number:true,
                enableTextSelectionOnCells:true,
                showHeaderRow: false,
                headerRowHeight:40,
                explicitInitialization:true
			};
			if(this.get('options')) {
				Y.mix(this.options, this.get("options"), true);
			}
			if(this.get('selectionType') == 'multiple') {
				this.options.multiSelect = true;
			}
			this.data = [];
			this.gridColumns = [];
			this._lastCheckedRow = -1;

			this._loadedPages = [];//已经加载的分页
			this._waitingForLoad = [];//待加载的数据页
			this._pageInfo = null;
			this._param = null;
			this._ajaxDataFlag = false;
            this.loadDataCallback = null;
		},

		destructor: function() {
			if(this._grid) {
				this._grid.destroy();
				delete this._grid;
			}
			delete this.data;
			delete this.gridColumns;
			delete this.selectedIDs;
		},

		renderUI: function() {
			var cb = this.get(CONTENTBOX);
			cb.append(this.get("TEMPLATE"));
			var grid = cb.one(".yui3-tableselector-grid");
			grid.set("id", Y.stamp(grid));
			this._gridCSSPATH = "#" + cb.one(".yui3-tableselector-grid").get("id");
			this.syncOwnSize();
		},

		bindUI: function() {
			if(this.get("selectionType") === "multiple") {
				Y.delegate("click", Y.bind(function(e){
					var checked = !!e.currentTarget.get("checked");
					this._selectAllOrNot(checked);
					Y.later(0, this, function(){e.currentTarget._node.checked = checked;});
					if(this.get("checkAllEvent")) {
						this.fire(EVENT_ROW_SELECTED, {
							rowId: -1, cellId: -1, rowData: null, checkAllEvent:true, checkAll: checked});
					}
				}, this), Y.one(this._gridCSSPATH), ".checkbox-all");
			}

			this.on("sortRefresh",function(e,args,param){
				this._param = param;
				this._waitingForLoad = [];
				this._loadedPages = [];
				var viewPort = this._grid.getViewport();
				var needMore = this._checkViewPortList(viewPort);

				Y.later(200,this,function(e){//延迟，滚动
					//正在加载数据，不用再次调用
					if(needMore && !this._ajaxDataFlag){
						this._ajaxLoadData();
					}
				});
			},this);

            var exportElement = this.get("exportElement");
            if(exportElement){
                Y.all(exportElement).on('click',function(){
                    this.excelExport();
                },this);
            }

			Y.one(window).on("resize",function(){
				this.syncOwnSize();
			},this);
		},

		_updateGridColumns: function() {
			this.gridColumns = Y.clone(this.get('gridColumns'));
			var selectionType = this.get('selectionType');
            var number = this.get('number');

			if(selectionType === "multiple") {
				this.gridColumns.unshift({
					id: "selectiontype",
					name: "<input type='checkbox' name = 'checkAll' class= 'checkbox-all'/>",
					toolTip: " ",
					field: "checked",
					resizable: false,
					unselectable: false,
					width: 30,
					formatter: this.checkboxFormatter,
                    headerCssClass:"text-right",
                    cssClass:"text-right",
                    export:false
				});
			} else if(selectionType === "single") {
				this.gridColumns.unshift({
					id: "selectiontype",
					name: "",
					field: "checked",
					resizable: false,
					unselectable: true,
					width: 30,
					formatter: this.radioButtonFormatter,
                    headerCssClass:"text-right",
                    cssClass:"text-right",
                    export:false
				});
			} else if(number){
                this.gridColumns.unshift({
					id: "number",
					name: "#",
					toolTip: " ",
					field: "number",
					resizable: false,
					unselectable: false,
					width: 40,
					formatter: this.numberFormatter,
                    headerCssClass:"text-right",
                    cssClass:"text-right number",
                    export:false
				});
            }
		},

		setData: function(data) {
			this.data = data;
			if(!data || data.length == 0) {
				this.showEmptyMsg();
			} else {
				this.clearEmptyMsg();
			}
			this._lastCheckedRow = -1;

			if(this._grid) {
				this._grid.setData(data, true);
				this._grid.setSelectedRows([]);
				if (this.get("selectionType") === "multiple") {
					Y.one(this._gridCSSPATH).one(".checkbox-all").set("checked", false);
				}
				this._grid.render();
			} else {
				this._updateGridColumns();
				this._grid = new SGrid(jQuery(this._gridCSSPATH), data, this.gridColumns, this.options);
				this._grid.onHeaderRowCellRendered.subscribe(function(e, args) {
                    var $node = $(args.node);
                    $node.attr('data-id',args.column.id);
                    $node.attr('data-field',args.column.field);
                });
                this._grid.init();
                if(this.options.showHeaderRow){
                    $(this._grid.getHeaderRow()).insertAfter('.slick-viewport');
                    $('.slick-viewport').scroll(function(){
                        $('.slick-headerrow-columns').css('left',-$('.slick-viewport').scrollLeft());
                    });
                }
				this._grid.setSelectionModel(new Slick.RowSelectionModel());
				this._attachEvents();
				this.syncOwnSize();//创建grid后初始化大小！防止隐藏的matrix不显示
			}
			this.set("rowCount",data.length);
			//Y.log(this._grid.getViewport());
			this._makeIndex(data);
			//this._grid.resizeCanvas();
            //this.sortable();
		},
		/**
		 * 自动分页加载数据
		 * 	   暂时不考虑加载过程中数据发生变化的情况
		 * autoPaginationOption:
		 * 	{service:请求数据的ajax请求,
		 * 	 listName:返回的列表对象名称(默认值为list)
		 * 	 paginationName:分页对象名(默认值为page)
		 * 	 countPerPage:每页显示多少条
		 * 	}
		 *  参数：param  请求参数（页面自动从第一页加载）
		 */
		autoPaginationData:function(param){
			this._param = param;
			this._loadedPages = [];
			this._waitingForLoad = [];
			this._ajaxDataFlag = false;
			this._pageInfo = null;
			this._waitingForLoad.push(1);//加载第一页  加载完成后执行回调初始化
			this._ajaxLoadData(Y.bind(this._initPaginationCallback,this));
		},

		//页面数据加载完成后回调
		_initPaginationCallback:function(data,page){

			var list = this.transformData(data,page);
			if(!list || list.length == 0) {
				this.showEmptyMsg();
			} else {
				this.clearEmptyMsg();
			}
			this.set("rowCount",list.length);
			this._lastCheckedRow = -1;
			if(list){
                var paginationOption = this.get("autoPaginationOption");
                    if(paginationOption.getItemMetadata){
                        list.getItemMetadata = paginationOption.getItemMetadata;
                    }
				//先展示一页数据
				if(!this._grid){
					this._updateGridColumns();

					this._grid = new SGrid(jQuery(this._gridCSSPATH), list, this.gridColumns, this.options);
					this._grid.onHeaderRowCellRendered.subscribe(function(e, args) {
	                    var $node = $(args.node);
	                    $node.attr('data-id',args.column.id);
	                    $node.attr('data-field',args.column.field);
	                });
	                this._grid.init();
	                if(this.options.showHeaderRow){
	                    $(this._grid.getHeaderRow()).insertAfter('.slick-viewport');
                        $('.slick-viewport').scroll(function(){
                            $('.slick-headerrow-columns').css('left',-$('.slick-viewport').scrollLeft());
                        });
	                }
					this._grid.setSelectionModel(new Slick.RowSelectionModel());
					this._attachEvents();
					this.syncOwnSize();//创建grid后初始化大小！防止隐藏的matrix不显示
				}else{
					this._grid.setData(list, true);
					this._grid.setSelectedRows([]);
					if (this.get("selectionType") === "multiple") {
						Y.one(this._gridCSSPATH).one(".checkbox-all").set("checked", false);
					}
					var numPerPage = parseInt(page.numPerPage);
					var currentPage = parseInt(page.currentPage);
					var count = (currentPage-1)*numPerPage;
					this._grid.scrollRowToTop(count);
					this._grid.render();
				}
				this._grid.resizeCanvas();

				var viewPort = this._grid.getViewport();
				var needMore = this._checkViewPortList(viewPort);
				if(needMore){//通常情况下新建列表后会触发onScroll
					this._ajaxLoadData();
				}
			}
            //this.sortable();
		},

		_checkViewPortList:function(viewPort){
			if(this._pageInfo) {
				var top = viewPort.top,
					bottom=viewPort.bottom;
				var cp = parseInt(this._pageInfo.currentPage);//当前页
				var np = parseInt(this._pageInfo.numPerPage);//每页条数
				var tr = parseInt(this._pageInfo.totalRecord);//总条数

				var needMore = false;
				//计算出要加载的页，放入this._waitingForLoad
				while(top < bottom && top < tr){
					var p = parseInt(top/np) + 1;
					if(this._isPageNeedLoad(p)){
						this._waitingForLoad.push(p);
						needMore = true;
					}
					top = (top-top%np) + np;
				}
				return needMore;
			}

			return false;
		},
		//检查页面是否需要加载
		_isPageNeedLoad:function(pageIndex){
			var find = Y.Array.find(this._loadedPages,function(it){
				return it == pageIndex;
			},this);
			if(find){
				return false;
			}
			find = Y.Array.find(this._waitingForLoad,function(it){
				return it == pageIndex;
			},this);
			if(find){
				return false;
			}
			return true;
		},
		//页面完成
		_makePaginationIndex:function(){
			this.data = this._grid.getData();
			//最后建立索引
			this._makeIndex(this.data);
		},

		/**
		 * 加载数据
		 *	isSyncData: 数据加载完成后是否先显示数据(在执行callback之前，如果this._grid为空则不执行)
		 *  callback: 加载完成数据后调用的回调函数callback(data,page)
		 */
		_ajaxLoadDataOld:function(callback){
			if(!this._waitingForLoad || this._waitingForLoad.length == 0){//不存在需要加载的页面
				return;
			}
			this._ajaxDataFlag = true;
			var loadPage = this._waitingForLoad[0];//此处暂时先不删除页码，防止重复加载分页
			var param = this._param;
			var paginationOption = this.get("autoPaginationOption");
			var service = paginationOption.service;
			if(!paginationOption){
				throw "未添加autoPaginationOption选项";
			}
			var ln = paginationOption.listName,
				pn = paginationOption.paginationName;
			if(!ln)
				ln = "list";
			if(!pn)
				pn = "page";

			var countPerPage = paginationOption.countPerPage;
			if(!countPerPage){
				countPerPage = 10;//默认值
			}
			param.offset = (loadPage-1)*countPerPage;
			param.rows = countPerPage;
			this.showLoadingMsg();
			this._lastRequestTime = new Date().getTime();
			var thisRequestTime = this._lastRequestTime;
			service(param).when(function(data){
				//如果是早期的请求，但是最后才返回，则忽略掉
				if(thisRequestTime < this._lastRequestTime){
					return;
				}
                this.closeLoadingMsg();

                var list = this._findObjectField(data,ln);
				if(data && list){
                    var total = parseInt(this._findObjectField(data,pn))||0;
					var totalPage = (total%countPerPage>0?(parseInt(total/countPerPage)+1):parseInt(total/countPerPage));
					var pageInfo = {
						currentPage:loadPage,
						totalRecord:total,
						currentRecord:list.length,
						numPerPage:countPerPage,
						totalPage:totalPage
					};
					this._pageInfo = pageInfo;


					//this._loadedPages.push(this._pageInfo.currentPage);//放入已加载的页
					if(this._grid){
						this._syncSetData(list,pageInfo);
					}
					this._loadedPages.push(loadPage);
					if(this._waitingForLoad[0] == loadPage){
						this._waitingForLoad.shift();
					}
					if(callback){
						callback(list,pageInfo);
					}
                    if(this.loadDataCallback){
                        this.loadDataCallback(data,pageInfo);
                    }
					if(this._waitingForLoad && this._waitingForLoad.length > 0){
						this._ajaxLoadData();
					}else{
						this._ajaxDataFlag = false;
						this._makePaginationIndex();
						this.fire("initFinished");
					}
				}else{
					this.setData([]);
				}

				if(this._waitingForLoad.length == 0){
					Y.later(200,this,function(){
						this.syncOwnSize();
					});
				}
			},this).error(function(e){
				if(thisRequestTime < this._lastRequestTime){
					return;
				}
				alert("数据加载异常");
				this._ajaxDataFlag = false;
				return false;
			},this);
		},

		        /**
         * 加载数据
         *    isSyncData: 数据加载完成后是否先显示数据(在执行callback之前，如果this._grid为空则不执行)
         *  callback: 加载完成数据后调用的回调函数callback(data,page)
         */
        _ajaxLoadData:function(callback){
            if(!this._waitingForLoad || this._waitingForLoad.length == 0){//不存在需要加载的页面
                return;
            }
            this._ajaxDataFlag = true;
            var loadPage = this._waitingForLoad[0];//此处暂时先不删除页码，防止重复加载分页
            var param = this._param;
            var paginationOption = this.get("autoPaginationOption");
            var service = paginationOption.service;
            if(!paginationOption){
                throw "未添加autoPaginationOption选项";
            }
            var ln = paginationOption.listName;
            if(!ln)
                ln = "list";

            var countPerPage = paginationOption.countPerPage;
            if(!countPerPage){
                countPerPage = 10;//默认值
            }
            param.offset = (loadPage-1)*countPerPage;
            param.rows = countPerPage+1;
            this.showLoadingMsg();
            this._lastRequestTime = new Date().getTime();
            var thisRequestTime = this._lastRequestTime;
            service(param).when(function(data){
                //如果是早期的请求，但是最后才返回，则忽略掉
                if(thisRequestTime < this._lastRequestTime){
                    return;
                }
                this.closeLoadingMsg();

                var list = this._findObjectField(data,ln);
                if(data && list){
                    var total = (loadPage-1)*countPerPage+list.length || 0;

                    if (list.length > countPerPage) {
                        list.splice(list.length-1);
                    }

                    var totalPage = (total%countPerPage>0?(parseInt(total/countPerPage)+1):parseInt(total/countPerPage));
                    var pageInfo = {
                        currentPage:loadPage,
                        totalRecord:total,
                        currentRecord:list.length,
                        numPerPage:countPerPage,
                        totalPage:totalPage
                    };
                    this._pageInfo = pageInfo;
                    //this._loadedPages.push(this._pageInfo.currentPage);//放入已加载的页
                    if(this._grid){
                        this._syncSetData(list,pageInfo);
                    }
                    this._loadedPages.push(loadPage);
                    if(this._waitingForLoad[0] == loadPage){
                        this._waitingForLoad.shift();
                    }
                    if(callback){
                        callback(list,pageInfo);
                    }
                    if(this.loadDataCallback){
                        this.loadDataCallback(data,pageInfo);
                    }
                    if(this._waitingForLoad && this._waitingForLoad.length > 0){
                        this._ajaxLoadData();
                    }else{
                        this._ajaxDataFlag = false;
                        this._makePaginationIndex();
                        this.fire("initFinished");
                    }
                }else{
                    this.setData([]);
                }

                if(this._waitingForLoad.length == 0){
                    Y.later(200,this,function(){
                        this.syncOwnSize();
                    });
                }
            },this).error(function(e){
                if(thisRequestTime < this._lastRequestTime){
                    return;
                }
                alert("数据加载异常");
                this._ajaxDataFlag = false;
                return false;
            },this);
        },

        _findObjectField: function(obj,str){
            if(!str)
                return obj;
            if(!obj){
                return obj;
            }
            var fields = str.split('.');
            var value = obj[fields[0]];
            if(fields.length > 1){
                for(var i=1;i<fields.length;i++){
                    if(value){
                        value = value[fields[i]];
                    }
                }
            }
            return value;
        },

		_syncSetData:function(list,page){
			var counter = 0;
			if(list && page){
				var numPerPage = parseInt(page.numPerPage);
				var currentPage = parseInt(page.currentPage);
				var count = (currentPage-1)*numPerPage;
				var gridData = this._grid.getData();
				var oldData = gridData.slice(0, count);
				oldData = oldData.concat(list);
				this._initPaginationCallback(oldData, page);
				/*for(var i = numPerPage * (currentPage-1); i < gridData.length && counter < list.length; i++){
					gridData[i] = list[counter++];
				}*/
			}
			this._grid.invalidateAllRows();
			//this.syncOwnSize();
		},

		//给出第一页数据和分页信息，自动填充所有数据行
		transformData: function(firstPageData, pageInfo){
			if(pageInfo){
				var copyData = [];
				var totalSize = pageInfo.totalRecord;
				for(var i = 0; i < totalSize; i ++){
					copyData[i] = firstPageData.length > i ? firstPageData[i] : {};
					copyData[i] = Y.mix(copyData[i], {id:i});
				}
				return copyData;
			}
			return firstPageData;
		},

		showEmptyMsg: function() {
			if(this.get("showNullMessage")) {
				var cb = this.get(CONTENTBOX), bb=this.get(BOUNDINGBOX);
				cb.one(".yui3-tableselector-message").one("td").set("innerHTML", this.get("nullMessage"));
				cb.one(".yui3-tableselector-message").setStyle("display", "")
			}
		},

		showLoadingMsg:function(){
			if(this.get("showLoadingMessage")){
				var cb = this.get(CONTENTBOX), bb=this.get(BOUNDINGBOX);
				cb.one(".yui3-tableselector-message").one("td").set("innerHTML", this.get("loadingMsg"));
				cb.one(".yui3-tableselector-message").setStyle("display", "")
			}
		},

		closeLoadingMsg:function(){
			if(this.get("showLoadingMessage")){
				var cb = this.get(CONTENTBOX), bb=this.get(BOUNDINGBOX);
				cb.one(".yui3-tableselector-message").setStyle("display", "none")
			}
		},

		clearEmptyMsg: function() {
			if(this.get("showNullMessage")) {
				var cb = this.get(CONTENTBOX), bb=this.get(BOUNDINGBOX);
				cb.one(".yui3-tableselector-message").setStyle("display", "none")
			}
		},

		checkboxFormatter : function(row, cell, value, columnDef, dataContext){
			return value ?
				"<input type='checkbox' name = 'checkBox' class= 'yui3-tableselector-checkbox' checked='checked'/>"
				:"<input type='checkbox' name = 'checkBox' class= 'yui3-tableselector-checkbox'/>";
		},

		numberFormatter : function(row, cell, value, columnDef, dataContext){
            if(value != undefined){
                return value;
            }
			return row+1;
		},

		radioButtonFormatter : function(row, cell, value, columnDef, dataContext){
			return value ?
				"<input type='radio' name = 'radioButton' class= 'yui3-tableselector-radiobutton' checked='checked'/>"
				:"<input type='radio' name = 'radioButton' class= 'yui3-tableselector-radiobutton'/>";
		},

		getGrid: function() {
			return this._grid;
		},

		_selectAllOrNot: function(checked) {
			Y.Array.each(this.data, Y.bind(function(row){
				row.checked = checked;
			}, this));
			if (this.get("selectionType") === "multiple") {
				Y.one(this._gridCSSPATH).one(".checkbox-all").set("checked", checked);
			}
			this._grid.setData(this.data, true);
			this._grid.render();
		},

		selectAll: function() {
			this._selectAllOrNot(true);
		},

		unselectAll: function() {
			this._selectAllOrNot(false);
		},

		getSelectedIDs : function(){
			var cb = this.get(CONTENTBOX);
			var selectedIDs = [];
			var indexName = this.get("indexField");
			if(this.get('selectionType') === 'multiple') {
				Y.Array.each(this.data, function(row){
					if(row.checked) selectedIDs.push(row[indexName]);
				});
				return selectedIDs;
			} else {
				if(this._lastCheckedRow !== -1) {
					selectedIDs.push(this.data[this._lastCheckedRow][indexName]);
				}
				return selectedIDs;
			}
		},

		getUnSelectedIDs : function(){
			var cb = this.get(CONTENTBOX);
			var unSelectedIDs = [];
			var indexName = this.get("indexField");
			if(this.get('selectionType') === 'multiple') {
				Y.Array.each(this.data, function(row){
					if(!row.checked) unSelectedIDs.push(row[indexName]);
				});
			}
			return unSelectedIDs;
		},
		getSelectedRows : function() {
			var cb = this.get(CONTENTBOX);
			var selectedRows = [];
			var indexName = this.get("indexField");
			if(this.get('selectionType') === 'multiple') {
				Y.Array.each(this.data, function(row){
					if(row.checked) selectedRows.push(row);
				});
				return selectedRows;
			} else {
				if(this._lastCheckedRow !== -1) {
					selectedRows.push(this.data[this._lastCheckedRow]);
				}
				return selectedRows;
			}
		},

		setSelectedIDs : function(ids){
			Y.Array.each(this.data, Y.bind(function(row, rowId){
				if(!!row.checked) {
					row.checked = false;
					this._grid.updateCell(rowId, 0)
				}
			}, this));
			if(this.get('selectionType') === 'single') {
				ids = [ids[ids.length-1]];
			}
			Y.Array.each(ids, Y.bind(function(id) {
				if(Y.Lang.isNumber(this._recIndexs[id])) {
					this.data[this._recIndexs[id]].checked = true;
					this._grid.updateCell(this._recIndexs[id], 0);
					if(this.get('selectionType') === 'single' || this.get('selectionType') === 'simpleSingle') {
						this._lastCheckedRow = this._recIndexs[id];
					}
				}
			}, this));

			if(this.get('selectionType') === 'single' || this.get('selectionType') === 'simpleSingle') {
				if(ids[0] && Y.Lang.isNumber(this._recIndexs[ids[0]])) {
					this._grid.setSelectedRows([this._recIndexs[ids[0]]]);

				}
			}

		},



		_makeIndex: function(data) {
			var _recIndexs = {};
			var indexName = this.get("indexField");
			Y.Array.each(data, function(rec, i){
				_recIndexs[rec[indexName]] = i;
			});
			this._recIndexs = _recIndexs;
		},

		_updateAllCheckbox: function(checked) {
			if (this.get("selectionType") !== "multiple") { return };
			if(checked === false) {
				Y.one(this._gridCSSPATH).one(".checkbox-all").set("checked", false);
			} else {
				if(this.data.length>0) {
					for(var i=0, l=this.data.length; i<l; i++) {
						var row = this.data[i];
						if(!row.checked) {
							   Y.one(this._gridCSSPATH).one(".checkbox-all").set("checked", false);
							return;
						}
					}
					Y.one(this._gridCSSPATH).one(".checkbox-all").set("checked", true);
				} else {
					Y.one(this._gridCSSPATH).one(".checkbox-all").set("checked", false);
				}
			}

		},

		_attachEvents: function() {
			if(this._grid) {
				var grid = this._grid;
				var that = this;

				this._grid.onMouseEnter.subscribe(function(e){
					var cell = grid.getCellFromEvent(e);
					row = cell.row;
					cell = cell.cell;

					var rowData = that._grid.getData()[row];
					that.fire(EVENT_ROW_MOUSE_ENTER, {
						rowTarget: Y.one(e.currentTarget),
						rowId: row, cellId: cell, rowData: rowData,
						clientX: e.clientX, clientY: e.clientY});
				});

				this._grid.onMouseLeave.subscribe(function(e){
					var cell = grid.getCellFromEvent(e);
					row = cell.row;
					cell = cell.cell;

					var rowData = that._grid.getData()[row];
					that.fire(EVENT_ROW_MOUSE_LEAVE, {
						rowTarget: Y.one(e.currentTarget),
						rowId: row, cellId: cell, rowData: rowData,
						clientX: e.clientX, clientY: e.clientY});
				});

				this._grid.onClick.subscribe(function(e){
					var cell = grid.getCellFromEvent(e);
					row = cell.row;
					cell = cell.cell;

					e.row = row;
					if(that.get('selectionType') === "simpleSingle") {
						if(that._lastCheckedRow !== -1) {
							that.data[that._lastCheckedRow].checked = false;
						}
						that.data[row].checked = true;
						that._lastCheckedRow = row;
					} else {
						if(that.get("selectionType") === "single") {
							if(that._lastCheckedRow !== -1) {
								that.data[that._lastCheckedRow].checked = false;
								that._grid.updateCell(that._lastCheckedRow, 0);
							}
							that.data[row].checked = true;
							that._grid.updateCell(row, 0);
							that._lastCheckedRow = row;
						} else if (that.get("selectionType") === "multiple" && (cell==0 || that.get("multiCheckOnClick"))) {
							that.data[row].checked = !!!that.data[row].checked;
							that._grid.updateCell(row, 0);
							that._updateAllCheckbox(that.data[row].checked);
						}
					}
					that._grid.setSelectedRows([row]);

					var rowData = that._grid.getData()[row];
					that.fire(EVENT_ROW_SELECTED, {
						rowId: row, cellId: cell, rowData: rowData});
				});

				this._grid.onDblClick.subscribe(function(e){
					var cell = grid.getCellFromEvent(e);
					row = cell.row;
					cell = cell.cell;

					if(that.get('selectionType') === "simpleSingle") {
						if(that._lastCheckedRow !== -1) {
							that.data[that._lastCheckedRow].checked = false;
							that._grid.updateCell(that._lastCheckedRow, 0);
						}
						that.data[row].checked = true;
						that._lastCheckedRow = row;
					} else {
						if(that.get("selectionType") === "single") {
							if(that._lastCheckedRow !== -1) {
								that.data[that._lastCheckedRow].checked = false;
								that._grid.updateCell(that._lastCheckedRow, 0);
							}
							that.data[row].checked = true;
							that._grid.updateCell(row, 0);
							that._lastCheckedRow = row;
						} else if (that.get("selectionType") === "multiple" && cell==0) {
							that.data[row].checked = !!!that.data[row].checked;
							that._grid.updateCell(row, 0);
							that._updateAllCheckbox(that.data[row].checked);
						}
					}

					var rowData = that._grid.getData()[row];
					that.fire(EVENT_ROW_DOUBLECLICK, {
						rowId: row, cellId: cell, rowData: rowData});
				});

				this._grid.onContextMenu.subscribe(function(e){
					var cell = grid.getCellFromEvent(e);
					row = cell.row;
					cell = cell.cell;

					var rowData = that._grid.getData()[row];
					that.fire(EVENT_ROW_OPENMENU, {
						pageX: e.pageX, pageY: e.pageY,
						rowId: row, cellId: cell, rowData: rowData});
				});

				this._grid.onScroll.subscribe(Y.bind(function(e, args){
					//Y.log("top" + args.rangeTop + "bottom"+args.rangeBottom);
					if(!this.get("autoPaginationOption")){
						return;
					}
					var viewPort = this._grid.getViewport();
					this._waitingForLoad = [];//滚动过程中产生的待加载页面不处理
					var needMore = this._checkViewPortList(viewPort);

					Y.later(200,this,function(e){//延迟，滚动
						//正在加载数据，不用再次调用
						if(needMore && !this._ajaxDataFlag){
							this._ajaxLoadData();
						}
					});
				},this));

				if(this.get("autoPaginationOption") && this.get("paginationStartSort")){
					this._grid.onSort.subscribe(Y.bind(function(e,args){
						var column = args.sortCol;
						var sortAsc = args.sortAsc;
						var sortRefreshFlag = false;
						if(this._loadedPages.length == this._pageInfo.totalPage){//已加载完所有页,使用客户端排序
							var field = column.field;
                            var sortPower = sortAsc ? 1 : -1;
							this.data.sort(function(a, b) {
								var av = a[field] || "";
								var bv = b[field] || "";
								if(av && av.localeCompare) {
									return av.localeCompare(bv) * sortPower;
								} else {
									if(av > bv) {
										return 1 * sortPower;
									}else if(av == bv) {
										return 0;
									}else {
										return -1 * sortPower;
									}
								}
							});
							this._grid.invalidateAllRows();
		                    this._grid.render();
						}else{//页面未加载完成
							sortRefreshFlag = true;
						}
						this.fire(EVENT_SORTED, {
							column: column, sortAsc: sortAsc,
							colName: column.field, order: sortAsc? "asc": "desc",
							sortRefreshFlag:sortRefreshFlag
						});
                        if(sortRefreshFlag){
                            var param = this._param;
                            param.sortColumn = column.field;
                            param.order = sortAsc? "asc": "desc";
                            this.fire("sortRefresh", null, param);
                        }
					},this));
				}else{
					if(this.get("serverSort")) {
						this._grid.onSort.subscribe(function(e, args) {
							var column = args.sortCol;
							var sortAsc = args.sortAsc;
							that.fire(EVENT_SORTED, {
								column: column, sortAsc: sortAsc,
								colName: column.field, order: sortAsc? "asc": "desc"
							});
						});
					} else {
						this._grid.onSort.subscribe(function(e, args) {
							var column = args.sortCol;
							var sortAsc = args.sortAsc;
							var field = column.field;
							var sortPower = sortAsc ? 1 : -1;
							that.data.sort(function(a, b) {
								var av = a[field] || "";
								var bv = b[field] || "";
								if(av && av.localeCompare) {
									return av.localeCompare(bv) * sortPower;
								} else {
									if(av > bv) {
										return 1 * sortPower;
									}else if(av == bv) {
										return 0;
									}else {
										return -1 * sortPower;
									}
								}
							});
							that._grid.invalidateAllRows();
		                    that._grid.render();
						});
					}
				}
			}
		},

		syncOwnSize: function() {
			var cb = this.get(CONTENTBOX), bb=this.get(BOUNDINGBOX);
			var grid = cb.one(".yui3-tableselector-grid");
			bb.setStyle("width", "100%");
			bb.setStyle("height", "100%");

			if(this.get("style") === "borderDown") {
				grid.setStyle("width", bb.get("offsetWidth")-1);
				grid.setStyle("height", bb.get("offsetHeight")-10);
				grid.setStyle("borderBottom", "1px solid #ccc");
			} else if(this.get("style") === "none") {
				grid.setStyle("width", bb.get("offsetWidth")-0); //  -1 ？？
				grid.setStyle("height", bb.get("offsetHeight")-1);
			} else if(this.get('style') === "border") {
				grid.setStyle("width", bb.get("offsetWidth")-10);
				grid.setStyle("height", bb.get("offsetHeight")-10);
				grid.setStyle("border", "1px solid #ccc");
				grid.setStyle("top", 4).setStyle("left", 4).setStyle("position", "absolute");
			}
			cb.one(".yui3-tableselector-message").one("td").setStyle('height', bb.get("offsetHeight") - 10);
			cb.one(".yui3-tableselector-message").one("td").setStyle('width', bb.get("offsetWidth")-10);
			if(this._grid) {
				this._grid.resizeCanvas();
			}
		},

		//改变selectionType  multiple  single  simpleSingle
		changeSelectionType:function(type){
			if(this.get("selectionType") != type){
				var data = this._grid.getData();
				var cb = this.get(CONTENTBOX);
				var recoverPaginationParamFunc = this.recoverPaginationParam();
				cb.one("form").remove();
				this.set("selectionType",type);

				this.initializer();
				recoverPaginationParamFunc();
				this.renderUI();
				this.bindUI();
				this.setData(data||[]);
			}
		},

        updateLayout:function(oldIndex,newIndex){
            if(oldIndex == newIndex){
                return;
            }

            var arr = this._grid.getColumns();
            var temp = arr[oldIndex];
            if(oldIndex < newIndex){
                for(var i = oldIndex;i<newIndex;i++){
                    arr[i] = arr[i+1];
                }
                arr[newIndex] = temp;
            }else{
                for(var i = oldIndex;i>newIndex;i--){
                    arr[i] = arr[i-1];
                }
                arr[newIndex] = temp;
            }

            this._grid.setColumns(arr);

            this._updateGridColumns();
            this.syncOwnSize();
        },

        sortable:function(){
            var that = this;
            Sortable.create(that._parentNode._node.getElementsByClassName('slick-header-columns')[0], {

                //group: "words",
                animation: 150,
                store: {
                    get: function (sortable) {
                        var header = location.pathname + '#' + that._parentNode._node.id + '#header';

                        var order = localStorage.getItem(header);
                        return order ? order.split('|') : [];
                    },
                    set: function (sortable) {
                        var order = sortable.toArray();
                        var header = location.pathname + '#' + that._parentNode._node.id + '#header';
                        var columnid = location.pathname + '#' + that._parentNode._node.id + '#column';
                        var arr = that._grid.getColumns();
                        var column = new Array();
                        for(var i=0;i<arr.length;i++){
                            column.push(arr[i].id);
                        }
                        localStorage.setItem(header, order.join('|'));
                        localStorage.setItem(columnid, column.join('|'));
                    }
                },
                onEnd: function(evt){
                    that.updateLayout(evt.oldIndex,evt.newIndex);
                }
            });
            var columnid = location.pathname + '#' + that._parentNode._node.id + '#column';
            var column = localStorage.getItem(columnid);
            if(column){
                var columns = column.split('|');
                var arr = this._grid.getColumns();

                for(var i=0;i<arr.length;i++){
                    for(var j=0;j<columns.length;j++){
                        if(arr[i].id == columns[j]){
                            arr[i]._orderindex = j;
                        }
                    }
                }
                arr.sort(function(a,b){
                    return a._orderindex > b._orderindex ? 1 : -1;
                });
                this._grid.setColumns(arr);

                this._updateGridColumns();
                this.syncOwnSize();
            }
        },
		setSumRow : function(data){
            var $sumRow = $(this._grid.getHeaderRow());
            this.setField(data,$sumRow,'data-field');
        },

        //根据一个JSON数据来给元素赋值
        //data:数据对象
        //el:在此元素的子元素上查找要赋值的元素，选填：默认为HTML根元素，支持原生元素和jQuery元素
        //attribute:根据元素的名称来查找待赋值的元素，选填：默认为field属性
        setField:function(data,el,attribute){
            attribute = attribute || 'field';
            var field_els = el ? $(el).find('['+attribute+']') : $('['+attribute+']');

            for(var field in data){
                field_els.each(function(i,el){
                    var fields = el.attributes.getNamedItem(attribute).value.split('.');
                    if(fields.indexOf(field) > -1){
                        dataset(el);
                        var value = data[fields[0]];
                        if(fields.length > 1){
                            for(var j=1;j<fields.length;j++){
                                if(value){
                                    value = value[fields[j]];
                                }
                            }
                        }
                        if(value === false){
                            el.style.display = 'none';
                        }else if(el.nodeName == "IMG"){
                            el.src = value;
                        }else if(el.nodeName == "INPUT" || el.nodeName == "TEXTAREA"){
                            el.value = value;
                        }else if(el.nodeName == "SELECT"){
                            var key = el.dataset.key;
                            select:
                            for(var j =0;j< el.options.length;j++){
                                var option = el.options[j];
                                if((key == "text" && option.text == value) || (key != "text" && option.value == value)){
                                    el.selectedIndex = j;
                                    el.onchange && el.onchange();
                                    break select;
                                }
                            }
                            el.dataset.value = value;
                        }else{
                            if(el.dataset.format == "num"){
                                el.innerText = numFormat(value);
                            }else if(el.dataset.format == "time"){
                                el.innerText = timeFormat(value);
                            }else if(el.dataset.format == "date"){
                                el.innerText = new Date(value).Format('yyyy-MM-dd');
                            }else if(el.dataset.format == "datetime"){
                                el.innerText = new Date(value).Format('yyyy-MM-dd hh:mm:ss');
                            }else if(el.dataset.format == "html"){
                                el.innerHTML = value || el.dataset.default || value;
                            }else{
                                el.innerText = value || el.dataset.default || value;
                            }
                            if(window.navigator.userAgent.toLowerCase().indexOf("firefox")!=-1)
                            {
                                el.textContent = el.innerText;
                            }
                        }
                    }
                });
            }
            function dataset(el){
                if(el && !el.dataset){
                    el.dataset = {};
                    for(var i = 0;i < el.attributes.length;i++){
                        var attr = el.attributes[i];
                        if(attr.name.toLowerCase().indexOf('data-') == 0){
                            el.dataset[attr.name.substr(5)] = attr.value;
                        }
                    }
                }
            }
        },

		dataset:function(el){
            if(el && !el.dataset){
                el.dataset = {};
                for(var i = 0;i < el.attributes.length;i++){
                    var attr = el.attributes[i];
                    if(attr.name.toLowerCase().indexOf('data-') == 0){
                        el.dataset[attr.name.substr(5)] = attr.value;
                    }
                }
            }
        },

		recoverPaginationParam: function(){
			var pageInfo = this._pageInfo;
			var loadedPages = this._loadedPages;
			var waitingForLoad = this._waitingForLoad;
			var param = this._param;
			var ajaxDataFlag = this._ajaxDataFlag;

			return Y.bind(function(){
				this._loadedPages = loadedPages;
				this._waitingForLoad = waitingForLoad;
				this._pageInfo = pageInfo;
				this._param = param;
				this._ajaxDataFlag = ajaxDataFlag;
			},this);
		},

        excelExport:function(){
            var exportOptions = this.get("exportOptions");
            var headerData = [];
            var getColumns = this._grid.getColumns();
            getColumns.forEach(function(item){
                if(item.field && item.export != false){
                    headerData.push({colName:item.field, exportName:item.name, basicData: item.basicData || []});
                }
            });

            //导出不需要翻页
            var paramTemp = this._param || exportOptions.exportParam;
            paramTemp.offset = 0;
            paramTemp.rows = 0;

            var param = {
                exportUrl: encodeURIComponent(Y2.UrlUtils.reFixUrl(exportOptions.exportUrl, paramTemp)),
                headerData:JSON.stringify(headerData),
                fileBaseName:exportOptions.exportTitle || "",
                sheetName:exportOptions.exportTitle || ""
            }

            var exportInterface = "excelExport";

            //返回resultInfo的请求
            if (exportOptions.exportReulstType && 1 == exportOptions.exportReulstType) {
            	exportInterface = "excelExportResultInfo";
            	param.paraData = JSON.stringify([]);
            	param.listName = exportOptions.listName || "list";
            }

            var url = Y2.UrlUtils.reFixUrl(Y2.meta.APIPath + exportInterface, param);
            Y2.WindowUtils.openItInHiddenFrame("export-excel", url);
        }
	}, {
		ATTRS : {
			TEMPLATE : {
				value : [
					"<form>" +
						"<div class='yui3-tableselector-message' style='display:none'>" +
						"   <table><tr><td id='ts-messager'></td></tr></table>" +
						"</div>" +
						"<div class='yui3-tableselector-grid'></div>" +
					"</form>"
				].join("")
			},
			showNullMessage : {value: true},
			nullMessage: {value: "该查询无数据."},
			gridColumns : {value: null},
			selectionType: {value: "multiple"},  //multiple (CheckBox Table) or single (RadioButton Table) or simpleSingle (without RadioButton),

			indexField: {value: "checkID"},
			options: {value:null},
			checkAllEvent: {value: false},
			serverSort: {value:false},
			style: {value: "border"}, //border, none, border-down
			multiCheckOnClick:{value:false},

			autoPaginationOption: {value: null},
			showLoadingMessage:{value:true},
			loadingMsg:{value:"数据加载中..."},
			paginationStartSort:{value:false}, //分页时如果数据加载完成则本地排序，否则服务端排序

			rowCount:{value:0},
            number:{value:true}, //在第一列显示编号。

            exportElement:{value:null},
            exportOptions:{value:null}
		}
	});

	Y2.TableSelector.EVENT_ROW_DOUBLECLICK = EVENT_ROW_DOUBLECLICK;
	Y2.TableSelector.EVENT_ROW_SELECTED = EVENT_ROW_SELECTED;
	Y2.TableSelector.EVENT_ROW_OPENMENU = EVENT_ROW_OPENMENU;


}, "0.0.1", {requires: ["widget","jq-slickgrid","yam-control-sortable"]});
