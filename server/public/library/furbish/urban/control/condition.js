/**
 * 查询条件控件
 */
YUI.add("yam-control-condition",function(Y){
	var Y2 = Y.namespace("YAM"),
		$ = Y.jQuery,
		CONTENTBOX = "contentBox",
		NAME = "CONDITION",
		DAY_MILLIS = 86400000,
		MINUTE_MILLIS = 60000;
	var desktop = null;
	
	var SENIOR_CONTROL_TEMPLATE = 
		'<a class="condition-link-button link-warning show-all-item">\
         <span>点击显示全部</span>\
		 <i class="fa fa-chevron-circle-down"></i>\
         </a>\
	  	 <a class="condition-link-button link-warning show-part-item">\
         <span>点击收起</span>\
		 <i class="fa fa-chevron-circle-up"></i>\
		 </a>';
	var OPTION_TEMPLATE = '<a value="{value}" class="condition-option">{text}</a>';
	
	var CONTEXT = null;
	
	Y2.Condition = Y.Base.create(NAME,Y.Widget,[],{
		initializer: function() {
			//获取desktop窗口  获取继承条件值
			var parent = window;
//			try{
//				do{
//					if(parent.__parkDesktop){
//						break;
//					}
//					if(parent.parent.location.href){
//						parent = parent.parent;
//					}
//				}while(parent != parent.parent);
//			}catch(e){
//				parent = window;
//			}
//			try{
//				if(!parent.__parkDesktop){//测试 parent页面是否跨越，是否可访问？
//					parent.__parkDesktop = true;//父页面可访问
//				}
//			}catch(e){
//				parent = window;
//			}
			desktop = parent;
		},
		
		destructor: function() {
			//Y.log("destructor");
			var conditionNodes = this.get("conditionNodes");
			Y.Array.each(conditionNodes,function(item){
				delete item;
			});
		},
		
		//初始化UI
		renderUI:function(){
			var options = this.get("options");
			if(options){
				conditionNodes = [];
				var context = this.get(CONTENTBOX);
				CONTEXT = this.get(CONTENTBOX);
				Y.Array.each(options,function(item){
					var cc = null;
					if(item.type=="custom"){
						cc = new CustomConditionItem(item);
						//context.append(cc.get("conditionNode"));
					}else if(item.type=="datetime"){
						cc = new DateTimeConditionItem(item);//防止ion slider控件在IE8上报错，故在创建控件前先将div附加到CONTEXT上
					}else if(item.type=="input"){
						cc = new ConditionItem(item);
						context.append(cc.get("conditionNode"));
					}else if(item.type=="plate"){
						cc = new PlateConditionItem(item);
						context.append(cc.get("conditionNode"));
					}else if(item.type=="time"){
						cc = new TimeConditionItem(item);
						context.append(cc.get("conditionNode"));
					}else if(item.type=="date"){
						cc = new DateConditionItem(item);
						context.append(cc.get("conditionNode"));
					}else if(item.type=="hidden"){
						cc = new HiddenConditionItem(item);
						context.append(cc.get("conditionNode"));
					}
					conditionNodes.push(cc);
				},this);
				if(context.all(".detail-condition").size() > 0){
					var control = Y.Node.create('<div class="condition-control">');
					control.append(Y.Node.create(SENIOR_CONTROL_TEMPLATE));
					if(this.get("showAll")){//当前显示全部
						control.one(".show-all-item").hide();
					}else{
						control.one(".show-part-item").hide();
						context.all(".detail-condition").hide();
					}
					context.append(control);
				}
				this.set("conditionNodes",conditionNodes);
			}
		},
		
		//绑定UI事件
		bindUI:function(){
			var context = this.get(CONTENTBOX);
			context.delegate("click",function(e){
				context.all(".detail-condition").show();
				context.one(".show-all-item").hide();
				context.one(".show-part-item").show();
				var layoutChange = this.get("layoutChange");
				if(layoutChange && typeof(layoutChange) == 'function'){
					layoutChange();
				}
			},'.show-all-item',this);

			context.delegate("click",function(e){
				context.all(".detail-condition").hide();
				context.one(".show-all-item").show();
				context.one(".show-part-item").hide();
				var layoutChange = this.get("layoutChange");
				if(layoutChange && typeof(layoutChange) == 'function'){
					layoutChange();
				}
			},'.show-part-item',this);
			
			var conditionNodes = this.get("conditionNodes");
			
			Y.Array.each(conditionNodes,function(it){
				it.on("cancelCondition",function(e){//条件取消
					//var conds = this.getCondition(true);
					if(!(it instanceof CustomConditionItem)){
						this.fire("conditionChange",{});
					}
				},this);
				it.on("conditionItemChange",function(e){//条件发生变化
					//var conds = this.getCondition(true);
					this.fire("conditionChange",{target:e.currentTarget});
				},this);
				
				it.on("afterCreateOptionItem",function(e){
					this.fire("afterCreateOptionItem",e.details[0]);
                    console.log(e)
				},this);
			},this);
		},
		
		//initFlag用于判断是否取消条件后获取条件
		getCondition:function(initFlag){
			var conditionNodes = this.get("conditionNodes");
			if(conditionNodes){
				var params = {};
				desktop._inheritCondition = [];
				Y.Array.each(conditionNodes,function(item){
					var cc = item.getConditionValue();
					if(cc){
						Y.Array.each(cc,function(it){
							params[it.name] = it.value;
						},this);
						//if(!item instanceof HiddenConditionItem){
							if(item instanceof DateTimeConditionItem){
								dateInherit = [];
								dateInherit.push({"name":item.get("conditionName"),"value":item.get("conditionValue")});
								Y.Array.each(cc,function(it){
									dateInherit.push(it);
								},this);
								desktop._inheritCondition.push(dateInherit);
							}else{
								desktop._inheritCondition.push(cc);
							}
						//}
					}
				},this);
				if(this.get("sortAddition")){
					var sortAddition = this.get("sortAddition");
					params.sortColumn = sortAddition.sortColumn;
					params.order = sortAddition.order;
				}
				if(!initFlag && this.get("cancelControlField")){
					this.cancelConditionControl();
				}
				if(!initFlag && this.get("resetControlField")){
					this.resetConditionControl();
				}
				return params;
			}
			return null;
		},
		
		cancelConditionControl:function(){
			if(!this.get("showCancelControl")){
				return;
			}
			var conditionNodes = this.get("conditionNodes");
			var cancelControlField = Y.one(this.get("cancelControlField"));
			cancelControlField.get("children").remove();
			var cancelControlNodes = [];
            
            var cn = Y.Node.create(CANCEL_CONTROL_TEMPLATE);
            //绑定事件
            cn.on("click",function(){
                Y.Array.each(conditionNodes,function(it){
                    it.resetValue();
                },this);
            },this);
            cancelControlField.append(cn);
            cancelControlNodes.push(cn);

			Y.Array.each(conditionNodes,function(it){
				var cn = it.getConditionCancel();
				if(cn != null){
					cancelControlField.append(cn);
					cancelControlNodes.push(cn);
				}
			},this);
			this.set("cancelControlNodes",cancelControlNodes);
		},
        
        
		resetConditionControl:function(){
			if(!this.get("showResetControl")){
				return;
			}
			var conditionNodes = this.get("conditionNodes");
			var resetControlField = Y.one(this.get("resetControlField"));
			resetControlField.get("children").remove();
			var resetControlNodes = [];
            
            var cn = Y.Node.create(RESET_CONTROL_TEMPLATE);
            //绑定事件
            cn.on("click",function(){
                Y.Array.each(conditionNodes,function(it){
                    it.resetValue();
                },this);
            },this);
            resetControlField.append(cn);
            resetControlNodes.push(cn);

			this.set("resetControlNodes",resetControlNodes);
		},
        
        
		
		buildNode:function(conditionName,option){
			var conditionNodes = this.get("conditionNodes");
			var find = Y.Array.find(conditionNodes,function(it){
				return it.get("conditionName") == conditionName;
			});
			if(find){
				for(prop in option){
					find.set(prop,option[prop]);
				}
				find._initConditionItemNode();
				//find.fire("conditionItemChange");
			}
		},
		
		visiable:function(conditionName,show){
			var conditionNodes = this.get("conditionNodes");
			var find = Y.Array.find(conditionNodes,function(it){
				return it.get("conditionName") == conditionName;
			});
			if(find){
				var conditionNode = find.get("conditionNode");
				if(show){
					conditionNode.show();
				}else{
					conditionNode.hide();
				}
			}
		},
		
		getItem:function(conditionName){
			if(!conditionName){
				return null;
			}
			var conditionNodes = this.get("conditionNodes");
			var find = Y.Array.find(conditionNodes,function(it){
				return it.get("conditionName") == conditionName;
			});
			return find;
		}
        
        
	},{
		ATTRS : {
			options:{value:null},
			showAll:{value:false},
			conditionNodes:{value:null},
			cancelControlField:{value:null},
			cancelControlNodes:{value:null},
			resetControlField:{value:null},
			resetControlNodes:{value:null},
			sortAddition:{value:null},
			showCancelControl:{value:false},//默认不使用取消
			showResetControl:{value:false},//默认不使用取消
			layoutChange:{value:null},
            bindUICallback:{value:null}
		}
	});
	
	//------------------------------------------------------------------------------------------
	//ConditionItem
	var INPUT_TEMPLATE = 
		'<div class="condition-item">\
			<label class="condition-label">{displayName}</label>\
			<div class="condition-group">\
				<input type="text" {id} class="condition-field" value="{value}"/>\
				<a class="fa fa-times-circle-o reset-btn"></a>\
			</div>\
		 </div>';
	var RESET_CONTROL_TEMPLATE  = '<button type="button" class="btn btn-danger btn-sm">\
                                        <span class="fa fa-refresh"></span>\
                                        <span>重置</span>\
                                    </button>';
	var CANCEL_CONTROL_TEMPLATE  = '<div class="condition-cancel-control"><span>重置</span></div>';
	var CANCEL_CONTROL_TEMPLATE1 = '<div class="condition-cancel-control"><span>[{name}：{value}]</span></div>';
	var CANCEL_CONTROL_TEMPLATE2 = 
		'<div class="condition-cancel-control">\
		  	<span>[{name}：{value}]</span>\
		  	<a class="tagsinput-remove-link"></a>\
	    </div>';
	
	var ConditionItem = Y.Base.create("conditionItem",Y.Base,[],{
		
		initializer: function() {
			this._initInhertCondition();
			this._initConditionItemNode();//生成条件
			this._renderCondition();
			this._bindConditionItem();	//绑定条件
		},
		
		_initConditionItemNode:function(){
			var conditionValue = this.get("conditionValue");
			var conditionNode = Y.Node.create(Y.Lang.sub(INPUT_TEMPLATE,{
				"displayName":this.get("displayName")||"",
				"value":conditionValue||"",
                "id":"id=\""+this.get("controlID")+"\"" || ""
			}));
			if(this.get("isNotNeedCancel") || !conditionValue){
				conditionNode.one(".reset-btn").hide();
			}
			this.set("conditionNode",conditionNode);
		},
		
		_bindConditionItem:function(){
			
			var conditionNode = this.get("conditionNode");
			if(conditionNode){
				conditionNode.one(".condition-field").on("change",function(e){
					var value = e.currentTarget.get("value");
					var isNotNeedCancel = this.get("isNotNeedCancel");
					if(isNotNeedCancel && (value === "" || value=== undefined || value === null)){
						e.currentTarget.set("value","0");
						value = "0";
					}
					this.set("conditionValue",value);
					this.fire("conditionItemChange");
				},this);
				
				conditionNode.one('.condition-field').on('keyup', function(e){
					var value = e.currentTarget.get("value");
					if(e.charCode == 13){
						var isNotNeedCancel = this.get("isNotNeedCancel");
						if(isNotNeedCancel && (value === "" || value=== undefined || value === null)){
							e.currentTarget.set("value","0");
							value = "0";
						}
						this.set("conditionValue",value);
						this.fire("conditionItemChange");
					}else{
						if(!this.get("isNotNeedCancel") && value){
							conditionNode.one(".reset-btn").show();
						}else{
							conditionNode.one(".reset-btn").hide();
						}
					}
				},this);
				
				conditionNode.one(".reset-btn").on("click",function(e){
					this.setConditionValue("");
					this.fire("conditionItemChange");
					e.currentTarget.hide();
				},this);
			}
		},

		_renderCondition:function(){
			var conditionNode = this.get("conditionNode");
			if(conditionNode && this.get("isDetail")){
				conditionNode.addClass("detail-condition");
			}
		},

		getConditionValue:function(){
			var val = this.get("conditionValue"),
				defaultValue = this.get("defaultValue");
			if((val === null || val === undefined || val === "") && defaultValue !== null && defaultValue !== undefined){
				val = defaultValue;
			}else if(val === null || val === undefined || val === ""){
				val = "";
			}
			var cg = this.get("conditionNode").one(".condition-group");
			if(cg && cg.hasClass("multi-condition")){
				if(this.get("multiName")){
					return [
					        {"name":this.get("conditionName"),"value":defaultValue},
					        {"name":this.get("multiName"),"value":val}
					      ];
				}
			}else{
				return [{"name":this.get("conditionName"),"value":val}];
			}
		},

		_getConditionDesc:function(){
			var conditionValue = this.get("conditionValue");
			if(conditionValue === null || conditionValue === ""){
				return null;
			}
			var displayName = this.get("displayName");
			return {"name":displayName,"value":conditionValue};
		},
		
		_initInhertFilter:function(value){
			return true;
		},
		
		_initInhertCondition:function(){
			var needInhert = this.get("needInhert");
			if(needInhert && desktop._inheritCondition){
				var cn = this.get("conditionName");
				var find = Y.Array.find(desktop._inheritCondition,function(item){
					return cn == item[0].name;
				},this);
				if(find && this._initInhertFilter(find[0].value)){
					this.set("conditionValue",find[0].value);
				}
			}
		},

		setConditionValue:function(val){
			var conditionField = this.get("conditionNode").one(".condition-field");
			if(val == null){
				conditionField.set("value","");
			}else{
				conditionField.set("value",val);
			}
			this.set("conditionValue",val);
		},

		getConditionCancel:function(){
			var conditionDesc = this._getConditionDesc();
			if(conditionDesc == null){
				return null;
			}
			var cn = null;
			if(this.get('isNotNeedCancel')){//条件不能被取消
				cn = Y.Node.create(Y.Lang.sub(CANCEL_CONTROL_TEMPLATE1,conditionDesc));
			}else{
				cn = Y.Node.create(Y.Lang.sub(CANCEL_CONTROL_TEMPLATE2,conditionDesc));
                //绑定事件
                cn.on("click",function(){
                    var resetValue = this.get('defaultValue');
                    var currentValue = this.get('conditionValue'); 

                    if(resetValue != currentValue){
                        cn.remove();
                        if(resetValue){
                            var currentParentNode = this.get("conditionNode"); 
                            currentParentNode.all('.condition-option').removeClass('current-condition');

                            if(currentParentNode.one('.default-option')){
                                currentParentNode.one('.default-option').addClass('current-condition');
                            }else{
                                currentParentNode.all('.condition-option').each(function(node){
                                    if(node.getAttribute('value') == resetValue){
                                        node.addClass('default-option').addClass('current-condition');
                                    }
                                });
                            }
                        }
                    }
                    this.setConditionValue(resetValue);
                    this.fire("cancelCondition");
                },this);
			}
			this.cn = cn;
			return cn;
		},
        resetValue: function(){
            var resetValue = this.get('defaultValue');
            var currentValue = this.get('conditionValue'); 

            if(this.name == 'hiddenConditionItem'){
                return;
            }
            if(resetValue != currentValue){
                if(this.cn)
                    this.cn.remove();
                if(resetValue !== undefined){
                    var currentParentNode = this.get("conditionNode"); 
                    currentParentNode.all('.condition-option').removeClass('current-condition');

                    if(currentParentNode.one('.default-option')){
                        currentParentNode.one('.default-option').addClass('current-condition');
                    }else{
                        currentParentNode.all('.condition-option').each(function(node){
                            if(node.getAttribute('value') == resetValue){
                                node.addClass('default-option').addClass('current-condition');
                            }
                        });
                    }
                }
            }
            this.setConditionValue(resetValue);
            this.fire("cancelCondition");
        }
	},{
		ATTRS : {
			conditionName:{value:"condition"},
			conditionValue:{value:null},//参数值
			defaultValue:{value:null},//查询返回的默认值  如果选择为空时返回默认值
			displayName:{value:"条件"},//名称
			isDetail:{value:false},//是否为详细条件
			type:{value:"custom"},//类型  custom--选择类型             datetime--时间              input--输入框            plate--车牌输入框
			//maxCount:{value:7},//最多显示多少个选项，多余的隐藏    已修改，自动判断是否超出
			conditionNode:{value:null},
			isNotNeedCancel:{value:null},
			needInhert:{value:true},//是否需要从之前的条件继承值
            controlID:{value:null}
		}
	});
	
	
	//------------------------------------------------------------------------------------------
	//CustomConditionItem
	/**
	 * 下拉选择类型
	 * 
	 */
	var CUSTOM_CONDITION_NAME = "customConditionItem";
	var CustomConditionItem = Y.Base.create(CUSTOM_CONDITION_NAME, ConditionItem,[],{
		_initConditionItemNode:function(){
			var conditionValue = this.get("conditionValue");
			var conditionName = this.get('conditionName');
			var conditionNode = this.get('conditionNode');
			
			if(conditionNode){
				conditionNode.empty();		
			}else{
				conditionNode = Y.Node.create('<div class="condition-item">');
				this.set("conditionNode",conditionNode);
				CONTEXT.append(conditionNode);
			}
			
			var source = this.get("source");
			if(source){
				var param = source.param;
				source.service(param).when(function(data){
					var target = source.targetName?source.targetName:"list";
					var list = data[target]||[];
					if(source.callback){
						list = source.callback(list);
					}
					this.set("items",list);
					this._createLabel(conditionNode);
					this._createOptions(conditionNode);
					this._createFolding(conditionNode);
				},this);
			}else{
				this._createLabel(conditionNode);
				this._createOptions(conditionNode);
				this._createFolding(conditionNode);
			}
		},
		
		_createLabel: function(conditionNode){
			conditionNode.append(Y.Node.create('<label class="condition-label"></label>').
				set("innerHTML",this.get("displayName")));
		},
		
		/**
		 * Item-content:{ 	value:string,
		 * 					text:string,
		 * 					isDefaultValue:boolean,
		 * 					isInitialValue:boolean,
		 * 					needToShow:boolean
		 * 			 	};
		 * */
		_createOptions: function(conditionNode){
			var conditionValue = this.get("conditionValue");
			var items = this.get("items");
			conditionNode = conditionNode || this.get('conditionNode');
            var bindUICallback = this.get("bindUICallback");
            if(bindUICallback){
                this.on('bindUI',bindUICallback);
            }
			
			if(items){
				var cg = Y.Node.create('<div class="condition-group"></div>'); 
				conditionNode.append(cg);
				Y.Array.each(items,function(item,index){
					var n = Y.Node.create(Y.Lang.sub(OPTION_TEMPLATE,item));
					if(item.isDefaultValue){
						this.set('defaultValue', item.value);
						n.addClass('default-option');
					}
					if(item.value == conditionValue || item.isInitialValue){
						cg.all(".current-condition").removeClass("current-condition");//此时未 初始化bindUI,不会触发valueChange事件
						this.setConditionValue(item.value);
						n.addClass("current-condition");
					}
					this.fire("afterCreateOptionItem",{"item":item,"node":n});
					cg.append(n);
				},this);
				if((!cg.one('.default-option')) && (!this.get("isNotNeedCancel"))){
					var defaultValue = this.get("defaultValue");
					var n = Y.Node.create(Y.Lang.sub(OPTION_TEMPLATE,{
						"text":"全部",
						"value":(defaultValue===null||defaultValue===undefined)?-1:defaultValue
					}));
					n.addClass("default-option");
					if(!cg.one('.current-condition')){
						n.addClass("current-condition");
					}
					cg.insert(n,0);
				}
                
				//判断是否超出一行
				var cgLineWidth = cg.get("offsetWidth") + 8,//padding-right:10px
					curWidth = 0;
				var options = cg.all(".condition-option");
				options.each(function(item){
					curWidth += item.get("offsetWidth") + 8;//margin-right:8px;
					if(curWidth > cgLineWidth){
						item.hide();
						item.addClass("option-overline");
					}
				});
                this.fire("bindUI",{"items":items,"node":cg});
			}
		},
		
		_createFolding: function(conditionNode){
			conditionNode = conditionNode || this.get('conditionNode');
			var hasHide = false;
			if(conditionNode.one(".option-overline")){
				hasHide = true;
			}
			var op = Y.Node.create('<div class="condition-operate"></div>');
			if(hasHide){
				op.append(Y.Node.create('<a class="btn-more link-button">\
											<span>更多</span>\
                                            <i class="fa fa-chevron-circle-right"><i>\
										</a>'));
				op.append(Y.Node.create('<a class="btn-less link-button" style="display:none">\
											<span>收起</span>\
											<span class="glyphicon glyphicon-collapse-up"></span>\
										</a>'));
				this.set("showAll",false);
			}
			if(this.get("multiChoose")){
				op.append(Y.Node.create('<a class="btn-multi link-button">\
											<span>多选</span>\
											<span class="glyphicon glyphicon-ok-circle"></span>\
										</a>'));
				op.append(Y.Node.create('<a class="btn-single link-button" style="display:none">\
											<span>单选</span>\
											<span class="glyphicon glyphicon-record"></span>\
										</a>'));
			}
			conditionNode.append(op);
		},
		
		_bindConditionItem:function(){
			var conditionNode = this.get("conditionNode");
			
			if(conditionNode){
				
				this._publishCascadeEvent();
				
				conditionNode.delegate("click",function(e){
					
					conditionNode.all(".current-condition").removeClass("current-condition");
					e.currentTarget.addClass("current-condition");
					
					this.set("conditionValue",e.currentTarget.getAttribute("value"));
					this._fireCascadeEvent();
					//this.fire("conditionItemChange");
				},'.condition-option',this);
				
				conditionNode.delegate("click",function(e){
					var cgn = conditionNode.one(".condition-group");
					if(cgn){
						cgn.addClass("condition-spread");
						var ow = conditionNode.one(".condition-label").get("offsetWidth");
						cgn.setStyle("left",ow+"px");
					}
					
					conditionNode.all(".option-overline").show();
					e.currentTarget.hide();
					//conditionNode.one(".btn-less").show();
					this.set("showAll",true);
				},'.btn-more',this);
				
				conditionNode.delegate("mouseleave",function(e){
					e.currentTarget.removeClass("condition-spread");
					conditionNode.all(".option-overline").hide();
					conditionNode.one(".btn-more").show();
				},'.condition-spread',this);
				
				conditionNode.delegate("click",function(e){
					conditionNode.all(".option-overline").hide();
					e.currentTarget.hide();
					conditionNode.one(".btn-more").show();
					this.set("showAll",false);
				},'.btn-less',this);
				
				conditionNode.delegate("click",function(e){
					
					this._switchChooseMode(true);
					e.currentTarget.hide();
					conditionNode.one(".btn-single").show();
				},'.btn-multi',this);
				
				conditionNode.delegate("click",function(e){
					this._switchChooseMode(false);
					e.currentTarget.hide();
					conditionNode.one(".btn-multi").show();
				},'.btn-single',this);
				
				conditionNode.delegate("click",function(e){
					var conditionValue = this.get("conditionValue");
					var val = e.currentTarget.get("value");
					var multiDefaultValue = this.get("multiDefaultValue");
					if(!conditionValue || conditionValue === multiDefaultValue){
						this.set("conditionValue",val);
						return;
					}
					var values = conditionValue.split(",");
					if(e.currentTarget.get("checked")){
						if(Y.Array.indexOf(values,val)<0){
							values.push(val);
						}
					}else{
						values = Y.Array.filter(values,function(it){
							return it != val;
						});
					}
					if(values.length > 0){
						this.set("conditionValue",values.join(","));
					}else{
						this.set("conditionValue",multiDefaultValue);
					}
					//Y.log(values);
				},'input[type="checkbox"]',this);
				
				this.after("conditionValueChange",function(e){
					var conditionGroup = this.get("conditionNode").one(".condition-group");
					if(conditionGroup && !conditionGroup.hasClass("multi-condition")){//只处理单选的设置值
						var value = this.get("conditionValue");
						var curOption = conditionGroup.one(".current-condition");
						if(!curOption || curOption.get("value") != value){
							if(curOption){
								curOption.removeClass("current-condition");
							}
							conditionGroup.one('.condition-option[value="'+value+'"]').addClass("current-condition");
						}
					}
					if(!this.get("isCascadeNotifier")){//防止多请求一次
						this.fire("conditionItemChange");
					}
				},this);
			
				this._subscribeCascadeEvent();
			}
		},

		_publishCascadeEvent: function(){
			var conditionName = this.get('conditionName');
			var isCascadeNotifier = this.get('isCascadeNotifier'); 
			var cascadeRetriveEventName = this.get('cascadeName');
			
			if(isCascadeNotifier){
				this.publish(conditionName + '_' + cascadeRetriveEventName,{
					broadcast: 1,
					defaultFn: function(ev){
					}
				});
			}
		},
		
		_fireCascadeEvent: function(){
			var conditionName = this.get('conditionName');
			var isCascadeNotifier = this.get('isCascadeNotifier'); 
			var cascadeRetriveEventName = this.get('cascadeName');
			
			if(isCascadeNotifier){
				this.fire(conditionName + '_' + cascadeRetriveEventName,
					{cascadeID: this.get('conditionValue')});
			}
		},
		
		_subscribeCascadeEvent: function(){
			if(this.get('isCascadeListener')){
				var eventType = CUSTOM_CONDITION_NAME + ':' + 
					this.get('cascadeRelierName') + '_' + this.get('cascadeName');
					
				Y.on(eventType, function(e){
					this._cascadeNodeHandler(e.cascadeID);
				}, this);
			}	
		},
		
		_cascadeNodeHandler: function(cascadeID){
			try {
				var callback = this.get('cascadeGetDataCallback');

				var items = callback(cascadeID);
				if(items !== undefined){//同步方法时直接执行
					var initVal = this.get("conditionValue");
					this.set('items', items);
					this._initConditionItemNode();
					var newVal = this.get("conditionValue");
					if(initVal == newVal){//防止多请求一次
						this.fire("conditionItemChange");
					}
				}else{
					var curVal = this.get("conditionValue");
					var val = this.get("defaultValue");
					this.set("conditionValue",val);
					if(curVal == val){//防止多请求一次
						this.fire("conditionItemChange");
					}
				}
			} catch (e) {
				Y.log(e);
			}
		},
		
		_initInhertFilter:function(value){
			var items = this.get("items");
			var findVal = Y.Array.find(items,function(it){ //判断是否存在此条件，不存在则继承无意义
				return value == it.value;
			});
			if(findVal){//继承大于0的条件
				var val = parseInt(value);
				return val >= 0;
			}
			return false;
		},
		
		_getConditionDesc:function(){
			var conditionValue = this.get("conditionValue");
			if(conditionValue == null){
				return null;
			}
			var displayName = this.get("displayName");
			var items = this.get("items");
			if(this.get("conditionNode").one(".condition-group").hasClass("multi-condition")){
				var values = conditionValue.split(",");
				var names = [];
				Y.Array.each(values,function(t){
					var finder = Y.Array.find(items,function(it){
						return it.value == t;
					},this);
					if(finder){
						names.push(finder.text);
					}
				},this);
				return {"name":displayName,"value":names.join("、")};
			}else{
				var finder = Y.Array.find(items,function(it){
					return it.value == conditionValue;
				},this);
				if(finder && finder.needToShow !== false){//隐藏的选项不生成描述
					return {"name":displayName,"value":finder.text};
				}
			}
			return null;
		},

		setConditionValue:function(val){
			var conditionNode = this.get("conditionNode");
			
			if(val == null){
				conditionNode.all(".current-condition").removeClass("current-condition");
				conditionNode.all("input[type=checkbox]:checked").set("checked",false);
			}else{
				//conditionField.set("value",val);
				//TODO 处理多选的情况
			}
			this.set("conditionValue",val);
			this._fireCascadeEvent();
		},
		
		//切换选择模式
		_switchChooseMode:function(multi){
			var conditionGroup = this.get("conditionNode").one(".condition-group");
			var items = this.get("items");
			if(conditionGroup && items){
				//var maxCount = this.get("maxCount");
				var showAll = this.get("showAll");
				var checkedCount = conditionGroup.all('input[type="checkbox"]:checked').size();
				conditionGroup.get("children").remove();
				var multiDefaultValue = this.get("multiDefaultValue");
				if(multi){//切换到多选模式
					conditionGroup.addClass("multi-condition");
					Y.Array.each(items,function(item,index){
						var n = Y.Node.create(Y.Lang.sub('<div class="checkbox multi-option">\
															<label><input type="checkbox" value="{value}"/>{text}</label>\
														  </div>',item));
						if(item.value == this.get("conditionValue")){
							n.one("input").set("checked",true);
						}
//						if(maxCount > 0 && index >= maxCount){
//							n.addClass("option-overline");
//							if(!showAll){
//								n.hide();
//							}
//						}
						conditionGroup.append(n);
					},this);
					
					if(!conditionGroup.one('input[type="checkbox"]:checked')){//无选中项目
						conditionGroup.all('input[type="checkbox"]').set("checked",true);
						var values = [];
						Y.Array.each(items,function(it){
							values.push(it.value);
						});
						this.set("conditionValue",values.join(","));
					}
				}else{
					var conditionValue = null;
					var conditionValues = this.get("conditionValue");
					if(!conditionValues || conditionValues === multiDefaultValue || checkedCount == items.length){
						this.set("conditionValue",this.get("defaultValue"));
					}else if(conditionValues){
						conditionValue = conditionValues.split(",")[0];
						this.set("conditionValue",conditionValue);
					}
					conditionGroup.removeClass("multi-condition");
					
					Y.Array.each(items,function(item,index){
						var n = Y.Node.create(Y.Lang.sub(OPTION_TEMPLATE,item));
						if(item.value == conditionValue){
							n.addClass("current-condition");
						}
//						if(maxCount > 0 && index >= maxCount){
//							n.addClass("option-overline");
//							if(!showAll){
//								n.hide();
//							}
//						}
						if(item.isDefaultValue){
							n.addClass('default-option');
						}
						conditionGroup.append(n);
					},this);
					if((!conditionGroup.one('.default-option')) && (!this.get("isNotNeedCancel"))){
						var defaultValue = this.get("defaultValue");
						var n = Y.Node.create(Y.Lang.sub(OPTION_TEMPLATE,{
							"text":"全部",
							"value":(defaultValue===null||defaultValue===undefined)?-1:defaultValue
						}));
						n.addClass("default-option");
						if(!conditionGroup.one('.current-condition')){
							n.addClass("current-condition");
						}
						conditionGroup.insert(n,0);
					}
				}
				//判断是否超出一行
				var cgLineWidth = conditionGroup.get("offsetWidth") - 10,//padding-right:10px
					curWidth = 0;
				var options = null;
				if(multi){
					options = conditionGroup.all(".multi-option");
				}else{
					options = conditionGroup.all(".condition-option");
				}
				if(options)
					Y.Array.each(options,function(item){
						curWidth += item.get("offsetWidth");
						if(curWidth > cgLineWidth && !showAll){
							item.hide();
							item.addClass("option-overline");
						}
					});
			}
		}
	
	},{
		ATTRS : {
			cascadeName: {value: '_cascadeRetrieveData'},
			isCascadeNotifier:{value:null},/**Notifier|Relier*/
			isCascadeListener:{value:null},/**Listener|Dependenet*/
			cascadeRelierName:{value:null},
			cascadeGetDataCallback:{value:null},
			items:{value:[]},
			multiChoose:{value:false},
			multiName:{value:null},
			showAll:{value:false},//默认不显示全部
			multiDefaultValue:{value:"-1"},
			source:{value:null},
            bindUICallback:{value:null}
		}
	});
	
	//------------------------------------------------------------------------------------------
	//DateTimeConditionItem
	var RANGE_SLIDER_TEMPLATE = 
		'<div class="datetime-container">\
            <div class="link-btn-field">\
			</div>\
			<div class="input-field">\
                <div class="input-group date form_datetime-component">\
                  <input type="text" class="form-control start-date form_datetime" size="16">\
                        <span class="input-group-btn">\
                        <button type="button" class="btn btn-default btn-sm date-set"><i class="fa fa-calendar"></i></button>\
                        </span>\
                  </div>\
				<span>-</span>\
                <div class="input-group date form_datetime-component">\
				<input type="text" class="form-control end-date form_datetime" size="16">\
                        <span class="input-group-btn">\
                        <button type="button" class="btn btn-default btn-sm date-set"><i class="fa fa-calendar"></i></button>\
                        </span>\
                  </div>\
			</div>\
		 </div>';
	//时间类型
	var DateTimeConditionItem = Y.Base.create("dateTimeConditionItem",ConditionItem,[],{
		_initOtherPeriodTime:null,
		
		_datePeriods:{
			lastYear:{value:"lastYear",text:"去年"},
			currentYear:{value:"currentYear",text:"本年"},
			lastMonth:{value:"lastMonth",text:"上月"},
			currentMonth:{value:"currentMonth",text:"本月"},
			lastWeek:{value:"lastWeek",text:"上周"},
			currentWeek:{value:"currentWeek",text:"本周"},
			yestrday:{value:"yestrday",text:"昨天"},
			currentDay:{value:"currentDay",text:"今天"},
			oneHour:{value:"oneHour",text:"近一小时"},
			eightHour:{value:"eightHour",text:"近八小时"}
		},
		
		_initConditionItemNode:function(){
			var conditionValue = this.get("conditionValue");
			var conditionNode = Y.Node.create('<div class="condition-date-item">');
			conditionNode.append(Y.Node.create('<label class="condition-label"></label>').set("innerHTML",this.get("displayName")));
			var periods = this.get("periods");
			if(periods && periods.length > 0){
				var cg = Y.Node.create('<div class="condition-group"></div>'); 
				conditionNode.append(cg);
				cg.append(Y.Node.create(RANGE_SLIDER_TEMPLATE));
				
				if(!this.get("hasTime")){
					cg.all(".time").hide();
				}
				conditionNode.append(cg);
				
				CONTEXT.append(conditionNode);
				
				var dc = cg.one(".datetime-container");
				if(this.get("showQuickControl")){
					var periods = this.get("periods");
					if(periods && periods.length > 0){
						var dcl = cg.one(".datetime-container .link-btn-field");
						Y.Array.each(periods,function(item){
							var n = Y.Node.create(Y.Lang.sub(OPTION_TEMPLATE,this._datePeriods[item]));
							dcl.append(n);
							if(this._datePeriods[item].value == conditionValue){
								n.addClass("current-condition");
							}
							if(this._datePeriods[item].value == this.get('defaultValue')){
								n.addClass('default-option');
							}
						},this);
					}
				}
				if(this.get("showReset")){
					var n = Y.Node.create('<a class="reset-option">清空</a>');
					dc.append(n);
				}
			}
			this.set("conditionNode",conditionNode);
		},
		
		_initInhertCondition:function(){
			var needInhert = this.get("needInhert");
			if(needInhert && desktop._inheritCondition){
				var cn = this.get("conditionName"),
					sn = this.get("startTimeName"),
					en = this.get("endTimeName");
				var find = Y.Array.find(desktop._inheritCondition,function(item){
					return cn == item[0].name && sn == item[1].name && en == item[2].name;
				},this);
				if(find){
					this.set("conditionValue",find[0].value);
					if(find[0].value == "other"){
						this._initOtherPeriodTime = [find[1].value,find[2].value];
					}
				}
			}
		},
		
		_bindConditionItem:function(){
			var conditionNode = this.get("conditionNode");
            var hasTime = this.get("hasTime");
			if(conditionNode){
				var that = this;
				var temp = $(conditionNode._node).find('.form_datetime-component').datetimepicker($.extend({
                    format: hasTime ? 'yyyy-mm-dd hh:ii:ss' : 'yyyy-mm-dd',
                    autoclose: true,
                    todayBtn: false,
                    forceParse:true,
                    minView:2,
                    pickerPosition: "bottom-left"
                },this.get('dateTimePickerOptions'))).on("changeDate",function(ev){
                    var conditionNode = that.get("conditionNode");
                    var st = conditionNode.one(".start-date").get("value"),
                        et = conditionNode.one(".end-date").get("value");
                    var validInfo = that._validateDate(st, et);
                    if(validInfo.success){
                        that.set("conditionValue","other");
                        that.fire("conditionItemChange");
                        
                    }else{
                        alert(validInfo.message);
                    }
                });
				
				var now = new Date();
				var timeOffset = now.getTime()%DAY_MILLIS;
				timeOffset = timeOffset>(DAY_MILLIS + now.getTimezoneOffset() * MINUTE_MILLIS)?(timeOffset-DAY_MILLIS):timeOffset;
				now.setTime(now.getTime()- timeOffset + DAY_MILLIS + now.getTimezoneOffset() * MINUTE_MILLIS);
				var rangeDays = 40;
				
				var min = (now.getTime()-DAY_MILLIS*rangeDays),
					max = now.getTime();
				var defaultValues = this._initOtherPeriodTime ? [
						{
							"value" : this._initOtherPeriodTime[0]
						},
						{
							"value" : this._initOtherPeriodTime[1]
						} ]
						: this.getConditionValue();
				var st,et;
				var from,to;
				if(defaultValues){//有值
					st = new Date(defaultValues[0].value.replace(/-/g,'/'));
					et = new Date(defaultValues[1].value.replace(/-/g,'/'));
					
					var d1 = Y2.DateUtils.formatDate(st,'yyyy-MM-dd'),
						t1 = Y2.DateUtils.formatDate(st,'hh:mm:ss'),
						d2 = Y2.DateUtils.formatDate(et,'yyyy-MM-dd'),
						t2 = Y2.DateUtils.formatDate(et,'hh:mm:ss');
                    if(hasTime){
                        d1 += ' ' + t1;
                        d2 += ' ' + t2;
                    }
					conditionNode.one(".start-date").set("value",d1);
					conditionNode.one(".end-date").set("value",d2);
					
					from = st.getTime();
					to = et.getTime();
				}else{
					from = min;
					to = min;
				}
				
				
				//valueChange事件
				this.after("conditionValueChange",function(e){
					if(e.newVal == "other" || !e.newVal){
						conditionNode.all(".current-condition").removeClass("current-condition");
					}
					if(!e.newVal){
						conditionNode.one(".start-date").set("value","");
						conditionNode.one(".end-date").set("value","");
						if(slider.old_from != slider.old_to){
							slider.update({
								from:min,
								to:min
							});
						}
					}
				},this);
				
				conditionNode.delegate("click",function(e){
					var currentVal = e.currentTarget.getAttribute("value");
					conditionNode.all(".current-condition").removeClass("current-condition");
					e.currentTarget.addClass("current-condition");
					
					this.set("conditionValue",currentVal);
					var values = this.getConditionValue();
					
					var st = new Date(values[0].value.replace(/-/g,'/')),
						et = new Date(values[1].value.replace(/-/g,'/'));
					var d1 = Y2.DateUtils.formatDate(st,'yyyy-MM-dd'),
						t1 = Y2.DateUtils.formatDate(st,'hh:mm:ss'),
						d2 = Y2.DateUtils.formatDate(et,'yyyy-MM-dd'),
						t2 = Y2.DateUtils.formatDate(et,'hh:mm:ss');
                    if(hasTime){
                        d1 += ' ' + t1;
                        d2 += ' ' + t2;
                    }
					conditionNode.one(".start-date").set("value",d1);
					conditionNode.one(".end-date").set("value",d2);
					
					this.fire("conditionItemChange");
				},'.condition-option',this);
				
				conditionNode.delegate("click",function(e){
					this.set("conditionValue",null);
					this.fire("conditionItemChange");
				},'.reset-option',this);
			}
		},

		_getConditionDesc:function(){
			var conditionValue = this.get("conditionValue");
			if(conditionValue == null){
				return null;
			}
			var displayName = this.get("displayName");
			if(conditionValue == "other"){
				var conditionNode = this.get("conditionNode");
				var st = conditionNode.one(".start-date").get("value"),
					et = conditionNode.one(".end-date").get("value");
				return {"name":displayName,"value":st+"至"+et};
			}else{
				var f = this._datePeriods[conditionValue];
				if(f){
					return {"name":displayName,"value":f.text};
				}
			}
			
			return null;
		},

		setConditionValue:function(val){
			var conditionNode = this.get("conditionNode");
			if(val == null){
				conditionNode.all(".current-condition").removeClass("current-condition");
			}
			this.set("conditionValue",val);
		},
		
		getConditionValue:function(){
			var startTimeName = this.get("startTimeName"),
				endTimeName = this.get("endTimeName");
			var conditionValue = this.get("conditionValue");
			var now = new Date();
			var year = now.getFullYear(),
				month = now.getMonth(),
				date = now.getDate(),
				day = now.getDay();
			var d1 = null,d2=null;
			switch(conditionValue){
			case "lastYear":
				d1 = new Date(year-1,0,1),
				d2 = new Date(year,0,1);
                d2.setSeconds(d2.getSeconds()-1);
				break;
			case "currentYear":
				d1 = new Date(year,0,1),
				d2 = new Date(year+1,0,1);
                d2.setSeconds(d2.getSeconds()-1);
				break;
			case "lastMonth":
				d1 = new Date(year,month-1,1),
				d2 = new Date(year,month,1);
                d2.setSeconds(d2.getSeconds()-1);
				break;
			case "currentMonth":
				d1 = new Date(year,month,1),
				d2 = new Date(year,month+1,1);
                d2.setSeconds(d2.getSeconds()-1);
				break;
			case "lastWeek":
				d2 = new Date(year,month,date);
				d2.setTime(d2.getTime() - day*DAY_MILLIS);
				d1 = new Date(d2.getTime() - 7*DAY_MILLIS);
                d2.setSeconds(d2.getSeconds()-1);
				break;
			case "currentWeek":
				d1 = new Date(year,month,date);
				d1.setTime(d1.getTime() - day*DAY_MILLIS);
				d2 = new Date(d1.getTime() + 7*DAY_MILLIS);
                d2.setSeconds(d2.getSeconds()-1);
				break;
			case "yestrday":
				d1 = new Date(year,month,date-1),
				d2 = new Date(year,month,date);
                d2.setSeconds(d2.getSeconds()-1);
				break;
			case "currentDay":
				d1 = new Date(year,month,date),
				d2 = new Date(year,month,date+1);
                d2.setSeconds(d2.getSeconds()-1);
				break;
			case "oneHour":
				d1 = new Date(now.getTime() - 3600000);
				d2 = now;
				break;
			case "eightHour":
				d1 = new Date(now.getTime() - 28800000);
				d2 = now;
				break;
			case "other":
				var conditionNode = this.get("conditionNode");
                var hasTime = this.get("hasTime");
				var st = conditionNode.one(".start-date").get("value"),
					et = conditionNode.one(".end-date").get("value");
                if(!hasTime){
                    et += ' 23:59:59';
                }
				var validInfo = this._validateDate(st, et);
				if(validInfo.success){
					d1 = new Date(st.replace(/-/g,'/')),
					d2 = new Date(et.replace(/-/g,'/'));
				}else{
					alert(validInfo.message);
					return null;
				}
				break;
			}
			if(!d1 || !d2){
				return null;
			}
            if(conditionValue != "other"){
                var conditionNode = this.get("conditionNode");
                var hasTime = this.get("hasTime");
                
                var _d1 = Y2.DateUtils.formatDate(d1,'yyyy-MM-dd'),
                    _t1 = Y2.DateUtils.formatDate(d1,'hh:mm:ss'),
                    _d2 = Y2.DateUtils.formatDate(d2,'yyyy-MM-dd'),
                    _t2 = Y2.DateUtils.formatDate(d2,'hh:mm:ss');
                if(hasTime){
                    _d1 += ' ' + _t1;
                    _d2 += ' ' + _t2;
                }
                conditionNode.one(".start-date").set("value",_d1);
                conditionNode.one(".end-date").set("value",_d2);
            }
			var values = [{"name":startTimeName,"value":Y2.DateUtils.formatDate(d1)},{"name":endTimeName,"value":Y2.DateUtils.formatDate(d2)}];
			return values;
		},
		
		_validateDate:function(st,et){
			if(!st || !et){
				return {"success":false,"message":"起止时间不能为空"};
			}
			var d1 = new Date(st.replace(/-/g,'/'));
			var d2 = new Date(et.replace(/-/g,'/'));
			if(d1 > d2){
				return {"success":false,"message":"开始时间不能大于结束时间"};
			}
			return {"success":true};
		}
	},{
		ATTRS : {
			periods:{value:['currentDay','yestrday','currentWeek','lastWeek','currentMonth']},
			startTimeName:{value:"startTime"},
			endTimeName:{value:"endTime"},
			isNotNeedCancel:{value:true},//时间类型默认必选项目
			showQuickControl:{value:true},
			hasTime:{value:true},
            dateTimePickerOptions:{},
			showReset:{value:false} //清空按钮
		}
	});
	
	//------------------------------------------------------------------------------------------
	//PlateConditionItem
	
	var PLATE_TEMPLATE = 
		'<div class="condition-item">\
			<label class="condition-label">{displayName}</label>\
			<div class="condition-group">\
				<input type="text" class="plate-prefix plate-field" value="{platePre}"/>\
				<input type="text" class="plate-suffix plate-field" value="{plateNum}"/>\
				<a class="glyphicon glyphicon-remove-circle reset-btn" style="display:none;"></a>\
			</div>\
		 </div>';
		
	var PlateConditionItem = Y.Base.create("plateConditionItem",ConditionItem,[],{
		_initConditionItemNode:function(){
			var conditionValue = this.get("conditionValue");
			var plateNum = "",platePre = "";
			if(conditionValue){
				plateNum = conditionValue.replace(/[\u4e00-\u9fa5]*/,"");
				platePre = conditionValue.replace(plateNum,"");
			}
			var conditionNode = Y.Node.create(Y.Lang.sub(PLATE_TEMPLATE,{
				"displayName":this.get("displayName")||"",
				"platePre":platePre,
				"plateNum":plateNum
			}));
			if(this.get("isNotNeedCancel")){
				conditionNode.one(".reset-btn").hide();
			}
			this.set("conditionNode",conditionNode);
		},

		_getConditionDesc:function(){
			var conditionNode = this.get("conditionNode");
			var pre = conditionNode.one(".plate-prefix").get("value"),
				suf = conditionNode.one(".plate-suffix").get("value");
			var val = pre+suf;
			if(!val){
				return null;
			}
			var displayName = this.get("displayName");
			return {"name":displayName,"value":val};
		},

		setConditionValue:function(val){
			var conditionNode = this.get("conditionNode");
			if(val == null){
				conditionNode.one(".plate-prefix").set("value",""),
				conditionNode.one(".plate-suffix").set("value","");
			}else{
				//TODO
			}
			this.set("conditionValue",val);
		},
		
		_bindConditionItem:function(){
			var conditionNode = this.get("conditionNode");
			if(conditionNode){
				$(conditionNode.one(".plate-prefix").getDOMNode()).CarHeadForAjax({pickedCallback:Y.bind(function(){
					var value = conditionNode.one(".plate-prefix").get("value") + 
								conditionNode.one(".plate-suffix").get("value");
					if(value != this.get("conditionValue")){
						this.set("conditionValue",value);
						this.fire("conditionItemChange");
						if(value && !this.get("isNotNeedCancel")){
							conditionNode.one(".reset-btn").show();
						}else{
							conditionNode.one(".reset-btn").hide();
						}
					}
				},this)});
				
				//直接赋值后不会触发onChanage事件，故用blur和keydown事件代替
				conditionNode.one('.plate-suffix').on('blur', function(e){
					var value = conditionNode.one(".plate-prefix").get("value") + 
								conditionNode.one(".plate-suffix").get("value");
					this.set("conditionValue",value);
					this.fire("conditionItemChange");
				},this);
				
				conditionNode.one('.plate-suffix').on('keydown', function(e){
					if(e.charCode == 13){
						var value = conditionNode.one(".plate-prefix").get("value") + 
							conditionNode.one(".plate-suffix").get("value");
						this.set("conditionValue",value);
						this.fire("conditionItemChange");
					}
				},this);
				
				conditionNode.one('.plate-prefix').on('valuechange',function(e){
					if(e.newVal != e.prevVal){
						e.currentTarget.set("value",e.newVal.toUpperCase());
					}
					if(e.newVal && !this.get("isNotNeedCancel")){
						conditionNode.one(".reset-btn").show();
					}else{
						conditionNode.one(".reset-btn").hide();
					}
				},this);
				
				conditionNode.one('.plate-suffix').on('valuechange',function(e){
					if(e.newVal != e.prevVal){
						//用set设置值后，值不发生改变，不会触发OnChange
						e.currentTarget.set("value",e.newVal.toUpperCase());
					}
					if(e.newVal && !this.get("isNotNeedCancel")){
						conditionNode.one(".reset-btn").show();
					}else{
						conditionNode.one(".reset-btn").hide();
					}
				},this);
				
				conditionNode.one('.reset-btn').on("click",function(e){
					this.setConditionValue(null);
					e.currentTarget.hide();
					this.fire("conditionItemChange");
				},this);
			}
		},
		
		getConditionValue:function(){
			var conditionNode = this.get("conditionNode");
			var	defaultValue = this.get("defaultValue");
			var value = conditionNode.one(".plate-prefix").get("value") + 
						conditionNode.one(".plate-suffix").get("value");
			if(!value){
				if(defaultValue){
					value = defaultValue;
				}else{
					value = "";
				}
			}
			return [{"name":this.get("conditionName"),"value":value}];
		}
	},{
		ATTRS : {
			
		}
	});
	
    //------------------------------------------------------------------------------------------
	//TimeConditionItem 单个时间控件
	var TIME_TEMPLATE = 
		'<div class="condition-item">\
			<label class="condition-label">{displayName}</label>\
			<div class="condition-group">\
                <div class="input-group date form_datetime-component">\
                    <input type="text" class="form-control item-date form_datetime" size="16" value="{itemDate}">\
                    <span class="input-group-btn">\
                    <button type="button" class="btn btn-default btn-sm date-set"><i class="fa fa-calendar"></i></button>\
                    </span>\
                </div>\
			</div>\
		 </div>';
		
	var TimeConditionItem = Y.Base.create("timeConditionItem",ConditionItem,[],{
		_initConditionItemNode:function(){
			var conditionValue = this.get("conditionValue");
			var d = null;
			if(conditionValue){
				if (conditionValue == "now") {
					d = new Date();
				} else {
					d = new Date(conditionValue.replace(/-/g,"/"));
				}
			}
			var conditionNode = Y.Node.create(Y.Lang.sub(TIME_TEMPLATE,{
				"displayName":this.get("displayName")||"",
				"itemDate":d==null?"":Y2.DateUtils.formatDate(d,"yyyy-MM-dd hh:mm:ss")
			}));
			this.set("conditionNode",conditionNode);
		},

		_getConditionDesc:function(){
			var conditionNode = this.get("conditionNode");
			var val = conditionNode.one(".item-date").get("value");
			if(!val){
				return null;
			}
			var displayName = this.get("displayName");
			return {"name":displayName,"value":val};
		},
		
		_bindConditionItem:function(){
			var conditionNode = this.get("conditionNode");
			if(conditionNode){
				var that = this;
                var initialDate = Y2.DateUtils.formatDate(new Date(),"yyyy-MM-dd hh:mm:00");
				var temp = $(conditionNode._node).find('.form_datetime-component').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii:ss',
                    autoclose: true,
                    todayBtn: true,
                    forceParse:true,
                    initialDate:initialDate,
                    pickerPosition: "bottom-left"
                }).on("changeDate",function(){
                    that.set("conditionValue","other");
                    that.fire("conditionItemChange");
                });
			}
		},
		
		setConditionValue:function(val){
			var conditionNode = this.get("conditionNode");
			var d = null;
			if(val){
				d = new Date(val.replace(/-/g,"/"));
			}
			conditionNode.one(".item-date").set("value",d==null?"":Y2.DateUtils.formatDate(d,"yyyy-MM-dd hh:mm:ss"));
			this.set("conditionValue",val);
		},
		
		getConditionValue:function(){
			var conditionNode = this.get("conditionNode");
			var	defaultValue = this.get("defaultValue");
			var value = conditionNode.one(".item-date").get("value");
			if(!value){
				if(defaultValue){
					value = defaultValue;
				}else{
					value = "";
				}
			}
			return [{"name":this.get("conditionName"),"value":value}];
		}
	},{
		ATTRS : {
			
		}
	});
	
    
    //------------------------------------------------------------------------------------------
	//DateConditionItem 单个日期控件
	var DATE_TEMPLATE = 
		'<div class="condition-item">\
			<label class="condition-label">{displayName}</label>\
			<div class="condition-group">\
				<div class="input-group date form_datetime-component">\
                    <input type="text" class="form-control item-date form_datetime" size="16" value="{itemDate}">\
                    <span class="input-group-btn">\
                    <button type="button" class="btn btn-default btn-sm date-set"><i class="fa fa-calendar"></i></button>\
                    </span>\
                </div>\
			</div>\
		 </div>';
		
	var DateConditionItem = Y.Base.create("dateConditionItem",ConditionItem,[],{
		_initConditionItemNode:function(){
			var conditionValue = this.get("conditionValue");
			var d = null;
			if(conditionValue){
				if (conditionValue == "now") {
					d = new Date();
				} else {
					d = new Date(conditionValue.replace(/-/g,"/"));
				}
			}
			var conditionNode = Y.Node.create(Y.Lang.sub(DATE_TEMPLATE,{
				"displayName":this.get("displayName")||"",
				"itemDate":d==null?"":Y2.DateUtils.formatDate(d,"yyyy-MM-dd")
			}));
			this.set("conditionNode",conditionNode);
		},

		_getConditionDesc:function(){
			var conditionNode = this.get("conditionNode");
			var pre = conditionNode.one(".item-date").get("value");
			var val = pre;
			if(!val){
				return null;
			}
			var displayName = this.get("displayName");
			return {"name":displayName,"value":val};
		},
		
		_bindConditionItem:function(){
			var conditionNode = this.get("conditionNode");
			if(conditionNode){
				var that = this;
				var temp = $(conditionNode._node).find('.form_datetime-component').datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    todayBtn: true,
                    forceParse:true,
                    minView:2,
                    pickerPosition: "bottom-left"
                }).on("changeDate",function(){
                    that.set("conditionValue","other");
                    that.fire("conditionItemChange");
                });
			}
		},
		
		setConditionValue:function(val){
			var conditionNode = this.get("conditionNode");
			var d = null;
			if(val){
				d = new Date(val.replace(/-/g,"/"));
			}
			conditionNode.one(".item-date").set("value",d==null?"":Y2.DateUtils.formatDate(d,"yyyy-MM-dd"));
			this.set("conditionValue",val);
		},
		
		getConditionValue:function(){
			var conditionNode = this.get("conditionNode");
			var	defaultValue = this.get("defaultValue");
			var value = conditionNode.one(".item-date").get("value");
			if(!value){
				if(defaultValue){
					value = defaultValue;
				}else{
					value = "";
				}
			}
			return [{"name":this.get("conditionName"),"value":value}];
		}
	},{
		ATTRS : {
			
		}
	});
	
    
	//------------------------------------------------------------------------------------------
	//HiddenConditionItem
	
	var HiddenConditionItem = Y.Base.create("hiddenConditionItem",ConditionItem,[],{
		_initConditionItemNode:function(){
			
		},
		_getConditionDesc:function(){
			
		},
		getConditionValue:function(){
			return [{"name":this.get("conditionName"),"value":this.get("conditionValue")}];
		},
	},{
		ATTRS : {
			
		}
	});
	
},"0.0.1",{requires:["node","widget","yam-utils","yam-control-carselect","event-valuechange","jq-datetimepicker"]});
