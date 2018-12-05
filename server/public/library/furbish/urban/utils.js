YUI.add("yam-utils", function(Y) {
	var Y2 = Y.YAM,
		$=Y.jQuery,
		Lang = Y.Lang,
		EventTarget = Y.EventTarget,
		NULL_FUN = function() {return null;},
		TEMPLATE = "<iframe id='{id}' name='{id}' frameborder='0' scrolling='no' " +
			"src='{url}' style='width:100%;height:100%'></iframe>",
		BS_DIALOG_TEMPLATE = '<div class="modal fade modal-dialog-center" id="{id}" tabindex="-1" role="dialog" aria-hidden="true">\
						  		<div class="modal-dialog" style="width:{width};">\
                                    <div class="modal-content-wrap">\
						    		<div class="modal-content custom-modal" style="width:{width};">\
						      			<div class="modal-header">\
						      				<div class="custom-modal-title">\
						      					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
						        				<h4 class="modal-title">\
													<span class="optional-icon"></span>\
						        					<span>{title}</span>\
						        				</h4>\
						      				</div>\
						      			</div>\
						      			<div style="height:{height};">\
						      				<iframe style="width:100%;height:100%;" frameborder="0" src="{url}"></iframe>\
						      			</div>\
						    		</div>\
                                    </div>\
						  		</div>\
							</div>';
	
	Y2.WindowUtils = {

		openDialog : function(dlgId, url, width, height, options) {
			url = Y2.meta.rootPath + url;
			width = width || screen.availWidth - 10;
			height = height || screen.availHeight - 30;
			options = options || {};
			options.width = width;
			options.height = height;
			if(options.maxIt) {
				return this.openMaximumDialog(dlgId, url, options);	
			} else {
				return this._openDialog(dlgId, url, options);
			}

		},

		openMaximumDialog: function(dlgId, url, options) {
			options = options || {};
			options.width = screen.availWidth - 10;
			options.height = screen.availHeight - 30;
			options.top = "0";
			options.left = "0";
			var win = this._openDialog(dlgId, url, options);
			try{
				win.focus();
				win.moveTo( 0, 0 );
				win.resizeTo( screen.availWidth, screen.availHeight );
			}catch(e){};
			return win;
		},
		
		/**
		 * 简易的打开一个嵌入页面的窗口 bootstrap样式
		 */
		//TODO dlgParam:附带关闭确认按钮等   加载提示效果  待扩展
		openSimpleIframeDialog:function(dlgID,title,url,width,height,dlgParam,scene,args,callback,context){
			dlgParam = dlgParam||{};
			var dlg = Y.one("#"+dlgID);
			if(dlg){//删除原先的窗口
				dlg.remove();
			}
			
			url = Y2.meta.rootPath + url;
			var opt = {
				"id":dlgID,
				"title":title||"窗口",
				"width":width+"px",
				"height":height+"px",
				"url":url
			};
			var iframe = Y.Node.create(Y.Lang.sub(BS_DIALOG_TEMPLATE,opt));
			if(dlgParam.iconCls){
				if(typeof(dlgParam.iconCls) == "string"){
					iframe.one(".optional-icon").addClass(dlgParam.iconCls);
				}else if(typeof(dlgParam.iconCls) == "object" && dlgParam.iconCls.length > 0){
					var iconNode = iframe.one(".optional-icon");
					Y.Array.each(dlgParam.iconCls,function(item){
						iconNode.addClass(item);
					},this);
				}
				
			}
			Y.one('body').appendChild(iframe);
			window.__iframeArgs = args;
			window.__iframeCallback = (context && callback) ? Y.bind(callback,context):callback;
			
			var jQIframe = $("#"+dlgID);
			jQIframe.modal("show");
			
			scene.once("closeIframeModalDlg",Y.bind(function(e){//关闭
				jQIframe.modal("hide");
			},this));
			
		},

		openModalDialog: function(url, width, height, callback, parameter) {
			url = Y2.meta.rootPath + url;
			var options = {width:width,height:height};
			options.callback = callback;
			options.parameter = parameter;
			return this._openModalDialog(url, options);
		},
		

		openIFrameDialog: function(dlgId, url, options, closeHandler) {
			options = options || {};
			options.width = options.width||800;
			options.height = options.height||600;
			options.fullScreenBtn = options.fullScreenBtn === false ? false : true;
			options.closeBtn = options.closeBtn === false ? false : true;
			options.rootPathFlag = options.rootPathFlag === false ? false : true;
			if (options.rootPathFlag) {
				url = Y2.meta.rootPath + url;                           
				//url = url + "?appID="+options.id+"&appName="+dlgId+"&taskListGroupID=" + (options.taskListGroupID || -1);	    		
	    	}	    	
			var box = new Y2.Box({
				dialogId: dlgId,
				width:options.width,
				height:options.height,
				centered: true,
				fullScreenBtn: options.fullScreenBtn,
				maximizeBtn: false,
				minimizeBtn: false,
				closeBtn: options.closeBtn,
				title: options.title,
				icon: options.icon,
				containerStyle: "transparent",
				containerTemplate : TEMPLATE.replace(/{id}/g, dlgId).replace("{url}", url)
	        });
			box.showAndActive();
			//box.maximize();
			box.on("dlg:close", function(){
				box.get("contentBox").one("#"+dlgId).set("src","javascript:false");
				if(closeHandler) {
					closeHandler();
				}
			});
			return box;
		},

		_openDialog : function(dlgId, url, options) {
			options = options || {};
			var parameter =
				" menubar=0, toolbar=0, directories=0" +
				",scrollbars=" + (options.scrollbar ? options.scrollbar: "0") +
				",resizable=" + (options.resizable ? options.resizable: "0") +
				  ",left=" + (options.left || (screen.availWidth - options.width)/2) +
				  ",top=" + (options.top || (screen.availHeight - options.height)/2) +
				  ",width=" + options.width + ",height="+ options.height;
			var w = window.open(url, dlgId, parameter);
			try{ w.focus(); } catch(e){};
			return w;
		},

		_openModalDialog: function(url, options) {
			options = options || {};
			var features = [
				"dialogWidth:" + (options.width) + "px",
				"dialogHeight:" + (options.height) + "px",
				"dialogLeft:" + (screen.availWidth - options.width)/2 + "px",
				"dialogTop:" + (screen.availHeight - options.height)/2 + "px",
				"center:1" ].join(";") ;
			var dlgArgs = {
				hostWin: window,
				parameter: options.parameter? options.parameter : {},
				callback: options.callback ? options.callback: NULL_FUN
			}
			return window.showModalDialog(url,  dlgArgs, features );

		},

		openItInHiddenFrame: function(dlgId, url) {
            if(url.indexOf('http') == -1){
                url = Y2.meta.APIPath + url;
            }
			var i = Y.Node.create('<iframe id="iframe-open-' + dlgId + '" name="iframe-open-' + dlgId + '" />');
				i._node.style.position = 'absolute';
				i._node.style.top = '-1000px';
				i._node.style.left = '-1000px';
				i._node.src = url;

			Y.one('body').appendChild(i);
			// Bind the onload handler to the iframe to detect the file upload response.
			Y.on("load", function() {
				//Y.one('body').removeChild(i);
			}, '#iframe-open-' + dlgId);
		},

		getBox: function() {
			try{
				if(top && top.Y && top.Y.YAM && top.Y.YAM.Box) {
					return top.Y.YAM.Box;
				}
			}catch(e){}
			return Y2.Box;
		},

		getWindowUtils: function() {
			try{
				if(top && top.Y && top.Y.YAM && top.Y.YAM.WindowUtils) {
					return top.Y.YAM.WindowUtils;
				}
			}catch(e){}
			return Y2.WindowUtils;
		}

	};

	var TipTemplate =
		"<div id='loading-tip' class='loading-tip' style='display:none'>" +
			"<b class='b1'></b><b class='b2'></b><b class='b3'></b><b class='b4'></b>" +
				"<div id='tipContent' class='content'><div class='tip-icon'></div><div class='tip-text'></div></div>" +
			"<b class='b4'></b><b class='b3'></b><b class='b2'></b><b class='b1'></b>" +
		"</div>";

	Y2.TipUtils = {
		//type: loading, error, success
		showTip: function(type, msg, autoClosed, timeDuration,left) {
			autoClosed = autoClosed || false;
			timeDuration = timeDuration || 3
			if(!Y.one("#loading-tip")) {
				Y.one("body").append(TipTemplate);
                if(left){
                    $('#loading-tip').css("left",left+"px");
                }
			}
			var tipDiv = Y.one("#loading-tip");
			tipDiv.one("#tipContent").removeClass("loading").removeClass("success").removeClass("error");
			tipDiv.one("#tipContent").addClass(type);
			tipDiv.one(".tip-text").setContent(msg);
			tipDiv.setStyle("display", "");
			if(this._timer) {
				window.clearTimeout(this._timer);
			}
			if(autoClosed) {
				this._timer = setTimeout(function(){
					Y2.TipUtils.closeTip();
				}, timeDuration * 1000);
			}
		},

		showError: function(msg,left) {
            if(left){
			     this.showTip("error", msg, true,3,left);
            }else{
                this.showTip("error", msg, true,3);
            }
		},

		showSuccess: function(msg,left) {
            if(left){
			     this.showTip("success", msg, true, 3,left);
            }else{
                this.showTip("success", msg, true, 3);
            }
		},

		showLoading: function(msg,left) {
            if(left){
			     this.showTip("loading", msg, false,left);
            }else{
                this.showTip("loading", msg, false);
            }
		},

		closeTip: function() {
			var tipDiv = Y.one("#loading-tip");
			if(tipDiv) {
				tipDiv.setStyle("display","none");
			}
		}
	}

	Y2.DateUtils = {
		formatDate : function(date, format){
			format = format || "yyyy-MM-dd hh:mm:ss";
            var o = {
				"M+" :  date.getMonth()+1,  //month
				"d+" :  date.getDate(),     //day
				"h+" :  date.getHours(),    //hour
				"m+" :  date.getMinutes(),  //minute
				"s+" :  date.getSeconds(), //second
				"q+" :  Math.floor((date.getMonth()+3)/3),  //quarter
				"S"  :  date.getMilliseconds() //millisecond
            }

            if(/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            }

            for(var k in o) {
                if(new RegExp("("+ k +")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
                }
            }
            return format;
        },
		
		formatTimestamp: function(value, format) {
			var date = new Date(value);
			return Y2.DateUtils.formatDate(date, format);
		},
        
        getToday: function(){
            var now = new Date();
            return now;
        },
        
        getYesterday: function(num){
            num = num || 1;
            var now = new Date();
            now.setDate(now.getDate() - num);
            return now;
        },
        
        //获得本周的开始日期和结束日期
		getDays: function() {
			var now = new Date();
	        var day = now.getDay();
	        var week = "7123456";
	        var first = 0 - week.indexOf(day);
	        var f = new Date();
	        f.setDate(f.getDate() + first);
	        var last = 6 - week.indexOf(day);
	        var l = new Date();
	        l.setDate(l.getDate() + last);
	        return [f, l];
		},
		  
		//获得某月的天数   
		getMonthDays: function(myMonth) {   
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
		    var monthStartDate = new Date(nowYear, myMonth, 1);   
		    var monthEndDate = new Date(nowYear, myMonth + 1, 1);   
		    var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);   
		    return days;   
		}, 
		  
		//获得本季度的开端月份   
		getQuarterStartMonth: function() {
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
            var lastYear = lastMonthDate.getYear();
            var lastMonth = lastMonthDate.getMonth();
            
		    var quarterStartMonth = 0;   
		    if (nowMonth < 3) {   
		        quarterStartMonth = 0;   
		    }   
		    if(2 < nowMonth && nowMonth < 6) {   
		        quarterStartMonth = 3;   
		    }   
		    if(5 < nowMonth && nowMonth < 9) {   
		        quarterStartMonth = 6;   
		    }   
		    if(nowMonth > 8) {   
		        quarterStartMonth = 9;   
		    }   
		    return quarterStartMonth;   
		},  
		  
		//获得本周的开端日期   
		getWeekStartDate: function() {
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//

            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
            var lastYear = lastMonthDate.getYear();
            var lastMonth = lastMonthDate.getMonth();
            
		    var weekStartDate = new Date(nowYear, nowMonth, nowDay - (nowDayOfWeek || 7) + 1);
		    return weekStartDate;
		},
		  
		//获得本周的停止日期   
		getWeekEndDate: function() {   
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
		    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - (nowDayOfWeek || 7)) + 1);   
		    return weekEndDate;   
		}, 
		  
		//获得上周的开端日期   
		getLastWeekStartDate: function() {
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
            
		    var weekStartDate = new Date(nowYear, nowMonth, nowDay - (nowDayOfWeek || 7)-6);
		    return weekStartDate;
		},
		  
		//获得上周的停止日期   
		getLastWeekEndDate: function() {   
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
		    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - (nowDayOfWeek || 7)) - 6);   
		    return weekEndDate;   
		},  
		  
		//获得本月的开端日期   
		getMonthStartDate: function() {   
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
		    var monthStartDate = new Date(nowYear, nowMonth, 1);   
		    return monthStartDate;   
		},  
		  
		//获得本月的停止日期   
		getMonthEndDate: function() {   
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
            
		    var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));   
		    return monthEndDate;   
		}, 
		  
		//获得上月开端时候   
		getLastMonthStartDate: function() {   
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
            
            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
            var lastYear = lastMonthDate.getYear();
            var lastMonth = lastMonthDate.getMonth();
            
		    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);   
		    return lastMonthStartDate;   
		}, 
		  
		//获得上月停止时候   
		getLastMonthEndDate: function() {   
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
            
            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
            var lastYear = lastMonthDate.getYear();
            var lastMonth = lastMonthDate.getMonth();
            
		    var lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(lastMonth));   
		    return lastMonthEndDate;   
		},  
		  
		//获得本季度的开端日期   
		getQuarterStartDate: function() {  
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
		    var quarterStartDate = new Date(nowYear, this.getQuarterStartMonth(), 1);   
		    return quarterStartDate;   
		},  
		  
		//获得本季度的停止日期   
		getQuarterEndDate: function() {   
            var now = new Date();//当前日期
            var nowDayOfWeek = now.getDay();//今天本周的第几天
            var nowDay = now.getDate();//当前日
            var nowMonth = now.getMonth();//当前月
            var nowYear = now.getYear();//当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;//
		    var quarterEndMonth = this.getQuarterStartMonth() + 2;   
		    var quarterStartDate = new Date(nowYear, quarterEndMonth, this.getMonthDays(quarterEndMonth));   
		    return (quarterStartDate);   
		},  

        //获得今年的开始日期和结束日期
		getCurrentYear: function() {
		    //起止日期数组
		    var startStop=new Array();
			//获取当前时间
			var currentDate = new Date();
			//获得当前年份4位年
			var currentYear=currentDate.getFullYear();
			//本年第一天
			var currentYearFirstDate=new Date(currentYear,0,1);
			//本年最后一天
			var currentYearLastDate=new Date(currentYear,11,31);
			//添加至数组
			startStop.push(currentYearFirstDate);
			startStop.push(currentYearLastDate);
			//返回
			return startStop;
 		}
	}

	Y2.PaginatorUtils = {

	   	tipLabel : "（第x页/共y页，本页c条，总数d条）",

		setPage: function(pageInfo) {
			var cb = this._pageNode;
			this.pageInfo = pageInfo;
			if(pageInfo.totalPage === 0) {
				//disable everything
				cb.all(".pageLink").addClass("pageLinkDisabled");
				cb.one(".number").setAttribute("disabled", "true");
				cb.one(".number").addClass("disabled");
				cb.setStyle("display", "none");
			} else {
				cb.one(".number").removeAttribute("disabled");
				cb.one(".number").removeClass("disabled");
				cb.all(".pageLink").removeClass("pageLinkDisabled");
				if(pageInfo.currentPage == 1) {
					var firstPageLink = cb.one(".firstPage");
					if(firstPageLink != null){
						firstPageLink.addClass("pageLinkDisabled");	
					}
					cb.one(".prevPage").addClass("pageLinkDisabled");
				}
				if(pageInfo.currentPage == pageInfo.totalPage) {
					var lastPageLink = cb.one(".lastPage");
					if(lastPageLink != null){
						lastPageLink.addClass("pageLinkDisabled");
					}
					cb.one(".nextPage").addClass("pageLinkDisabled");
				}
				cb.setStyle("display", "");
			}
			cb.one('.number').set("value", pageInfo.currentPage);
			cb.one('.tipLabel').set("innerHTML",
				this.tipLabel.replace("x", pageInfo.currentPage).
					replace("y", pageInfo.totalPage).
					replace("c", pageInfo.currentRecord).
					replace("d", pageInfo.totalRecord));
		},

		initPaginator: function(node, changeHandler) {
			this._pageNode = node;
			this._changeHandler = changeHandler;
			var container = node.one(".container");
			container.delegate("click", Y.bind(this._pageLinkHandler, this), ".pageLink");
			
			var jumpBtnNode = node.one(".jumpBtn");
			if(jumpBtnNode != null){
				jumpBtnNode.on("click", this._pageLinkHandler, this);
			}
		},

		_firstPage: function() {
			this.gotoPage(1);
		},

		_lastPage: function() {
			this.gotoPage(this.pageInfo.totalPage);
		},

		_nextPage: function() {
			this.gotoPage(this.pageInfo.currentPage+1);
		},

		_prevPage: function() {
			this.gotoPage(this.pageInfo.currentPage-1);
		},

		gotoPage: function(page) {
			//"numPerPage":2000,"totalPage":0,"currentPage":1,"totalRecord":0,"currentRecord":0
			if(page<1) page = 1;
			if(page> this.pageInfo.totalPage) page = this.pageInfo.totalPage;
			this.pageInfo.currentPage = page;
		},

		_pageLinkHandler: function(e) {
			var node = e.currentTarget;
			if(node.hasClass("pageLinkDisabled")) return;
			if(node.hasClass("firstPage")) {
				this._firstPage();
			} else if(node.hasClass("nextPage")) {
				this._nextPage();
			} else if(node.hasClass("prevPage")) {
				this._prevPage();
			} else if(node.hasClass("lastPage")) {
				this._lastPage();
			} else {
				var page = this._pageNode.one(".number").get("value");
				if(parseInt(page, 10)) {
					this.gotoPage(parseInt(page, 10));
				} else {
					this._pageNode.one(".number").set("value", this.pageInfo.currentPage);
				}
			}

			this._changeHandler(this.pageInfo);
		}

	}
	
	var XScene = function(pageType, pageId) {
		this.pageType = pageType;
		this.pageId = pageId;
	    this._evt = new EventTarget();
		this._handler = [];
		this.hostWin = window;
		Y.on("unload", Y.bind(function(){
			this.detachAll();
		}, this), window);
	};

	XScene.create = function(pageType, pageId) {
		window.__xsense = new XScene(pageType, pageId);
		return window.__xsense;
	};

	XScene.prototype = {
		getParameter : function() {
			if(this.pageType == "modal") {
				if(window.dialogArguments && window.dialogArguments.parameter){
					return window.dialogArguments.parameter;
				}	
			}else if(this.pageType == "iframe-modal"){
				return window.parent.__iframeArgs;
			}
			return null;
		},

		getCallback: function() {
			if(this.pageType == "modal") {
				if(window.dialogArguments && window.dialogArguments.callback){
					return window.dialogArguments.callback;
				}
			}else if(this.pageType == "iframe-modal"){
				return window.parent.__iframeCallback;
			}
			return null;
		},

		getParentScene: function(pageId, stopOnTop) {
			stopOnTop = stopOnTop || false;
			var parent = null;
			if(this.pageType == "iframe" || this.pageType == "iframe-dialog") {
				try{
					if(window.parent.location.href && window != window.parent) {
						parent = window.parent;
					}	
				}catch(e){};
			}
			if(!stopOnTop) {
				if(this.pageType == "modal") {
					parent = window.dialogArguments.hostWin;
				}
				if(this.pageType == "dialog") {
					parent = window.opener;
				}
			}
			if(!parent || !parent.__xsense) return null;
			if(parent.__xsense && parent.__xsense.pageId !== pageId) {
				return parent.__xsense.getParentScene(pageId, stopOnTop);
			}

			return parent.__xsense;
		},
		
		closeCurrentDialog:function(){
			if(this.pageType == "iframe-modal"){
				var parentScene = window.parent.__xsense;
				if(parentScene){
					parentScene.fire("closeIframeModalDlg", {});
					delete window.parent.__iframeArgs;
				}
			}
		},

		closeAllDialogs: function() {
			var parent = null;
			if(this.pageType == "iframe" || this.pageType == "iframe-dialog") {
				if(window != window.parent) {
					parent = window.top;
				}
			}
			if(this.pageType == "modal") {
				parent = window.dialogArguments.hostWin;
				window.close();
			}
			if(this.pageType == "dialog") {
				parent = window.opener;
				window.close();
			}
			if(!parent || !parent.__xsense) return null;
			if(parent.__xsense) {
				parent.__xsense.closeAllDialogs();
			}
		},

		getAbsolutePos: function(point, pageId) {
			//only for iframe scene
			var x = point[0], y = point[1];

			if(this.pageId == pageId) {
				return [x, y]
			} else {
				var parent = window.parent;
				if(!parent || !parent.__xsense) return [x,y];
				if(parent.__xsense) {
					var PY = parent.Y;
					var iframe = PY.one("#"+window.name);
					x = x + iframe.getX();
					y = y + iframe.getY();
					return parent.__xsense.getAbsolutePos([x,y], pageId)
				}
			}
		},

		getDesktop: function() {
			return this.getParentScene("desktop");	
		},

		fire: function(msgId, msgData, pageId, stopOnTop) {
			stopOnTop = stopOnTop || false;
			if(!pageId || pageId === this.pageId) {
				this._evt.fire(msgId, msgData);
			} else {
				var parent = this.getParentScene(pageId, stopOnTop);
				if(parent) {
					parent.fire(msgId, msgData)
				}
				return null;
			}
		},

		on: function(msgId, msgHandler, pageId, stopOnTop) {
			stopOnTop = stopOnTop || false;
			if(!pageId || pageId === this.pageId) {
				var h = this._evt.on(msgId, msgHandler);
				this._handler.push(h);
				return h;
			} else {
				var parent = this.getParentScene(pageId, stopOnTop);
				if(parent) {
					var h = parent.on(msgId, msgHandler)
					if(h) {
						this._handler.push(h);
					}
				}
				return null;
			}
		},
		
		once: function(msgId, msgHandler, pageId, stopOnTop) {
			stopOnTop = stopOnTop || false;
			if(!pageId || pageId === this.pageId) {
				var h = this._evt.once(msgId, msgHandler);
				return h;
			} else {
				var parent = this.getParentScene(pageId, stopOnTop);
				if(parent) {
					var h = parent.once(msgId, msgHandler,pageId,stopOnTop);
					return h;
				}
				return null;
			}
		},

		detachAll: function() {
			for(var i=0; i<this._handler.length; i++) {
				this._handler[i].detach();
			}
		}

	};

	//pageType: iframe, iframe-dialog, modal, dialog, desktop
	//iframe 普通的IFrame页面
	//iframe-dialog 对应于desktop上的一个Iframe对话框
	//modal 弹出的模态对话框
	//dialog　弹出的普通对话框
	Y2.SceneUtils = {

		create : function(pageType, pageId) {
			return XScene.create(pageType, pageId);
		},

		getSense: function() {
			return window.__xsense;
		}
	};
	
	var Validate = {
		//邮箱验证 参数：string
		isMail: function(val){
			var isEmail = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
			if ( isEmail.test(val)||val==''){
				return {success:true};
			} else {
				return {success:false,message:'邮箱格式不正确!'};
			}
		},
		//整数验证 参数：string
		isInteger : function(val){
			var isInteger = RegExp(/^[0-9]+$/);
			if ( isInteger.test(val) ||val==''){
				return {success:true};
			} else {
				return {success:false,message:'格式不正确！请输入整数'};
			}
		},
		/**
		 * 浮点数验证
		 * @param {string}
		 * @param {Integer} 小数点后位数
		 */
		isFloat : function(val,len){
			var isFloat = RegExp(/^(-?\d+)(\.\d+)?$/);
			if ( isFloat.test(val) ||val==''){
				if(len != null && len != '' && len>0 ){
					var decimal = val.substring(val.indexOf(".")+1);
					if (decimal.length == len && val.indexOf(".") != -1){
						return {success:true};
					} else {
						return {success:false,message:'精度不正确！'};
					}
				}
				return {success:true};
			} else {
				return {success:false,message:'格式不正确！请输入浮点数'};
			}
			
			
			
		},
		//实数验证 参数：string
		isNumber : function(val){
			var isNumber = RegExp(/^[0-9]*$/);
			if ( isNumber.test(val) ||val==''){
				return {success:true};
			} else {
				return {success:false,message:'格式不正确！请输入实数'};
			}
		},
		//字符长度验证 参数：string
		isShorter : function(str,reqlength){
			if( str.length<reqlength ){
				return {success:true};
			} else {
				return {success:false,message:'输入字符过长！'};
			}
		},
		//非空验证 参数：string
		isEmpty : function(val){
			if( val==null ||val=='' || val == 'null'){
				return {success:true,message:'不能为空！'};
			} else {
				return {success:false};
			}
		},
		//非空验证 参数：string
		notEmpty : function(val,flag){
			if(flag){
				return {success:true};
			}
			if( val==null ||val=='' || val == 'null'){
				return {success:false,message:'不能为空！'};
			} else {
				return {success:true};
			}
		},
		//特殊字符验证 参数：string
		containSpecial : function(val){
			var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
			if (containSpecial.test(val)&&!Lang.isNull(val) ){
				return {success:false,message:'格式不正确！不能包含特殊字符'};
			} else {
				return {success:true};
			}
		},
		/**
		 * 最大输入长度
		 * @param {string}
		 * @param {Integer} 要控制的长度
		 */
		checkLength : function(val,len){
			var s = val;
			var totalLength = 0;
			var charCode;

			for(i=0;i<s.length;i++)
			{
				charCode = s.charCodeAt(i);
				if (charCode < 0x007f) {//ASCII字母继续使用1字节储存，而常用的汉字就要使用2字节
					totalLength ++;
				} else if ((0x0080 <= charCode) && (charCode <= 0xffff)) {
					totalLength += 2;
				}
			}
			if( len>=totalLength ||Y.Lang.isNull(val) ){
				return {success:true};
			} else {
				return {success:false,message:'输入过长，最多输入'+(len/2)+'个汉字！'};
			}
		},
		/**
		 *是否为规范的手机电话号码
		 *@param {string}
		 */
		isTelephone : function(val){
			if(!(Validate.isInteger(val).success)||val.length>12||val.length<7&&val!='') {
				return {success:false,message:'格式不正确！'};
			}
			return {success:true};
		},
		/**
		 * 是否规范的邮编
		 * @param {string}
		 */
		isZip : function(val){
			if ( val.length == 6&&Validate.isInteger ( val ).success ||val==''){
				return {success:true};
			}
			return {success:false,message:'邮编格式不正确！'};
		},
		/**
		 * 常用固定电话验证
		 * @param {string}
		 */
		isPhoneNumber : function(val){
			var isPhoneNumber = RegExp(/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)/);
			if ( isPhoneNumber.test ( val )||val=='' ){
				return {success:true};
			}
			return {success:false,message:'格式不正确！格式：区号(可选)-主机号'};
		},
		/**
		 * 办公电话验证
		 * @param {string}
		 */
		isWorkPhone : function(val){
			var isWorkPhone = RegExp(/(^[0-9]{3,4}\-[0-9]{7,8}\-[0-9]{3,4}$)|(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}\-[0-9]{3,4}$)|(^[0-9]{7,8}$)/);
			if ( isWorkPhone.test ( val ) ||val==''){
				return {success:true};
			}
			return {success:false,message:'格式不正确！格式：区号(可选)-主机号-分机号(可选)'};
		},

		isSimplePhone: function(val) {
			var isPhone = RegExp(/^[\d]*$/);
			if ( isPhone.test ( val ) ||val==''){
				return {success:true};
			}
			return {success:false,message:'格式不正确！必须由数字组成！'};
		},
		/**
		 * 判断输入是否相同
		 * @param {string,string}
		 */
		equalTo : function(val,oldval){
			if(val==oldval){
				return {success:true};
			}
			return {success:false,message:'输入不相同！请输入相同的值'};
		},
		notEqualTo : function(val,oldval){
			if(val != oldval){
				return {success:true};
			}
			return {success:false,message:'输入相同！请输入不相同的值'};
		},
		isStrictLoginName: function(val){
			var isStrictLoginName = RegExp(/^[a-zA-Z][\d\sa-zA-Z]*$/);
			if(isStrictLoginName.test(val)){
				return {success:true};
			}
			return {success:false,message:'必须为字母开头，并且只包含字母和数字！'};
		},
		isDigitalOrNum:function(val,flag){
			if(flag){//条件验证，参数为ture时不验证
				return {success:true};
			}
			var isDigitalOrNum = RegExp(/^[a-zA-Z\d][\d\sa-zA-Z]*$/);
			if(isDigitalOrNum.test(val)){
				return {success:true};
			}
			return {success:false,message:'必须由字母或者数字组成!'};
		},
		isDateFormat: function(val){
			var regex = /\d{4}-(?:0?[1-9]|1[0-2])-(?:0?[1-9]|[1-2][0-9]|3[01])\s(?:[01]?\d|2[0-4])(?::[0-5]?\d){2}/;
			
			return {success:regex.test(val)};
		},
        isPlate: function(val){
           	var regex = /^[京津渝沪冀晋辽吉黑苏浙皖闽赣鲁豫鄂湘粤琼川贵云陕甘青蒙桂宁新藏][A-z][a-hj-np-zA-HJ-NP-Z\d]{4,5}[领学警挂港澳试超a-hj-np-zA-HJ-NP-Z\d]$|^[使][\d]{6}$|^[A-z]{2}[\d]{5}$|^WJ[京津渝沪冀晋辽吉黑苏浙皖闽赣鲁豫鄂湘粤琼川贵云陕甘青蒙桂宁新藏]?[\d]{4}[\dA-z]$/;
            return {success:regex.test(val)};
        }
	};

	Y2.ValidateUtils = {
		Int : Validate.isInteger,
		Float : Validate.isFloat,
		Number : Validate.isNumber,
		Empty : Validate.isEmpty,
		NotEmpty : Validate.notEmpty,
		MaxLength : Validate.checkLength,
		IsZip : Validate.isZip,
		IsWorkPhone : Validate.isWorkPhone,
		IsSimplePhone : Validate.isSimplePhone,
		IsPhoneNumber : Validate.isPhoneNumber,
		IsTelephone :Validate.isTelephone,
		IsMail:Validate.isMail,
		IsContainSpecial : Validate.containSpecial,
		EqualTo:Validate.equalTo,
		NotEqualTo:Validate.notEqualTo,
		IsStrictLoginName:Validate.isStrictLoginName,
		IsDigitalOrNum:Validate.isDigitalOrNum,
		IsDateFormat: Validate.isDateFormat,
        IsPlate:Validate.isPlate
	};

	Y2.GlobalFeatures = {

		openRecInfoPage: function(recID) {
			var width = null,
				height = null;
			var ww =  window.screen.width;
			if(ww<=1280){
				width=870;
				height=540;
			}else if(ww > 1280){
				width=979;
				height=635;
			}
			var url = "home/operation/recinfo/view/index.htm?recID="+recID+"&recWidth="+width;
			var dlgId = "recInfo_"+recID;
			return Y2.WindowUtils.openDialog(dlgId, url , width ,height);
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
                        Y.YAM.GlobalFeatures.dataset(el);
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
        },
        
        //获取某个元素内所有相匹配的子元素的值
        //attribute:通过此属性来匹配，可选，默认为field
        //el:在此元素下查找，支持jQuery元素，可选，默认为HTML根元素
        //backlist:此列表内的元素会被排除，可选
        getField:function(attribute,el,blacklist){
            var obj = {};
            attribute = attribute || 'field';
            blacklist = blacklist || [];
            var field_els = el ? $(el).find('['+attribute+']') : $('['+attribute+']');
            field_els.each(function(i,el){
                var field = $(el).attr(attribute);
                var value;
                if(blacklist.indexOf(field) > -1){
                    return;
                }
                Y.YAM.GlobalFeatures.dataset(el);
                if(el.nodeName == "IMG"){
                    value = el.src;
                }else if(el.nodeName == "INPUT" || el.nodeName == "TEXTAREA"){
                    value = el.value;
                }else if(el.nodeName == "SELECT"){
                    var key = el.dataset.key;
                    value = key == "text" ? el.options[el.selectedIndex].text : el.value;
                }else{
                    value = el.innerText;
                    if(window.navigator.userAgent.toLowerCase().indexOf("firefox")!=-1)
                    {
                        value = el.textContent;
                    }
                }
                obj[$(el).attr(attribute)] = value;
            });
            return obj;
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
        }
        
	};	
	
	/**
	 * html标签转义工具
	 */
	Y2.HtmlStringUtils = {
		toCommenString: function(htmlString){
			if(htmlString && htmlString.length > 0){
				return 	htmlString.replace(/</g,'&lt;').replace(/>/g,'&gt;');
			}
			return 	htmlString;
		}
	};
	
	Y2.AcrobatUtils = {
		/**check PDF plugin install **/
		isAcrobatPluginInstall: function (){ 
			//如果是firefox浏览器
			var x; 
			if (navigator.plugins && navigator.plugins.length) { 
				for (x=0; x<navigator.plugins.length;x++) { 
					if (navigator.plugins[x].name== 'Adobe Acrobat') {
						return true; 
					} 
				}	
			} else if (window.ActiveXObject){ //下面代码都是处理IE浏览器的情况
				for (x=2; x<10; x++) { 
					try { 
						oAcro=eval("new ActiveXObject('PDF.PdfCtrl."+x+"');"); 
						if (oAcro) { 
							return true; 
						} 
					} catch(e) {} 
				} 
				try { 
					oAcro4=new ActiveXObject('PDF.PdfCtrl.1'); 
					if (oAcro4) {
						return true; 
					}	
				} catch(e) {} 
				try { 
					oAcro7=new ActiveXObject('AcroPDF.PDF.1'); 
					if (oAcro7) 
					return true; 
				}catch(e) {} 
			} 
			return false;
		}
	};
	
	Y2.CertificateNoUtils = {	
		hideImportInfo : function(cerNo){
			var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
		    if(reg.test(cerNo) === true)
		    {
		    	cerNo = cerNo.substring(0,cerNo.length-6) + "******";
		    	return cerNo;
		    }
		    return cerNo;
		}
	};
	
	Y2.UrlUtils = {
		reFixUrl: function(url, obj) {
			var queryString = [];
			if(obj){
				for(var i in obj) {
                    if(obj[i] instanceof Array){
                        var list = obj[i];
                        for(var j in list){
                            var item = list[j];
                            if(typeof(item) == "object"){
                                for(var key in item){
                                    queryString.push(i + '['+key+']' + "=" + item[key]);
                                }
                            }else{
                                queryString.push(i + "=" + item);
                            }
                        }
                    }else{
                        queryString.push(i + "=" + obj[i]);
                    }
					
				}
				queryString = queryString.join("&");
				if(url.indexOf("?")>-1) {
					return url + "&" + queryString;
				} else {
					return url + "?" + queryString;
				}
			}
		},
        
        request: function(paras){
            var url = location.search;
            var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
            var paraObj = {}
            for (i=0; j=paraString[i]; i++){
                paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
            }
            var returnValue = paraObj[paras.toLowerCase()];
            if(typeof(returnValue)=="undefined"){
                return "";
            }else{
                return returnValue;
            }
        }
	};
	
	Y2.CacheHelper = function(){
		var _cache = {};
		
		return{
			addNonNilCache: function(key, value){
				if(key){
					_cache[key] = value;
				}
			},
			getCache: function(key){
				if(!key){
					return null;
				}else{
					return _cache[key];
				}
			},
			remove:function(key){
				if(_cache[key]){
					delete _cache[key];
				}
			}
		}
	};
	
	//获取桌面的缓存，将缓存放到桌面上,可以供所有页面使用
	Y2.DesktopCacheHelper = function(){
		var parent = window;
		try{
			do{
				if(parent.parent.location.href){//尝试父页面是否可以访问，无法访问将异常跳出
					parent = parent.parent;
				}else{
					break;//不能访问则跳出，防止ＩＥ９不抛出异常的ｂｕｇ
				}
			}while(parent != parent.parent);
		}catch(e){};
		var desktop = parent;
		if(!desktop.__cacheHelper){
			desktop.__cacheHelper = new Y2.CacheHelper();
		}
		
		return {
			addNonNilCache:function(key,value){
				return desktop.__cacheHelper.addNonNilCache(key,value);
			},
			getCache:function(key){
				return desktop.__cacheHelper.getCache(key);
			}
		}
	};
	
	/**
	 ** 减法函数，用来得到精确的减法结果
	 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
	 ** 调用：accSub(arg1,arg2)
	 ** 返回值：arg1加上arg2的精确结果
	 **/
	function accSub(arg1, arg2) {
	    var r1, r2, m, n;
	    try {
	        r1 = arg1.toString().split(".")[1].length;
	    }catch (e) {
	        r1 = 0;
	    }
	    try {
	        r2 = arg2.toString().split(".")[1].length;
	    }catch (e) {
	        r2 = 0;
	    }
	    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
	    n = (r1 >= r2) ? r1 : r2;
	    return new Number(((arg1 * m - arg2 * m) / m).toFixed(n));
	}

	// 给Number类型增加一个mul方法，调用起来更加方便。
	Number.prototype.sub = function (arg) {
	    return accSub(this,arg);
	};
	Number.prototype.r2 = function () {
		return Math.round(this*100)/100;
	};
    
	
	/**
	 * 解决部分浏览器缺少endsWith的问题
	 */
	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function(searchString, position) {
			var subjectString = this.toString();
			if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
				position = subjectString.length;
			}
			position -= searchString.length;
			var lastIndex = subjectString.indexOf(searchString, position);
			return lastIndex !== -1 && lastIndex === position;
		};
	}
	
},  "0.0.1", {requires:["event", "yam-core", "yam-control-box","node-event-simulate","jq-bootstrap","jq-pending","yam-common-toastr-toastr"]});