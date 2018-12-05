YUI.add("yam-control-box-base", function(Y){

	var Y2 = Y.namespace("YAM"),
		L = Y.Lang,
		getCN = Y.ClassNameManager.getClassName,
		MessageBus = Y2.MessageBus,

	btnInfos = ["close", "min", "max", "restore", "fullscreen", "restorefs", "refresh", "pindown", "pinup"],
	winBtnInfos = {"cancel":"", "no":"", "yes":"", "ok":"", "next":"", "prev":""},

	strings = {
			"close" : "关闭",
			"min" : "最小化",
			"max" : "最大化",
			"restore" : "还原",
			"fullscreen" : "全屏",
			"restorefs" : "退出全屏",
			"refresh" : "刷新",
			"pindown" : "置顶",
			"pinup" : "浮动",
			"prev" : "上一步",
			"next" : "下一步",
			"ok" : "确定",
			"cancel" : "取消",
			"yes" : "是",
			"no"  : "否"
	},

	/*Event Names*/
	EV_CLOSE = "dlg:close",
	EV_MIN = "dlg:hide",
	EV_REFRESH = "dlg:refresh",
	EV_FULLSCREEN = "dlg:fullscreen",
	EV_RESTORE = "dlg:restore",
	EV_MAX = "dlg:max",
	EV_RESTOREFS = "dlg:refreshfs",
	EV_PINDOWN = "dlg:pindown",
	EV_PINUP = "dlg:pinup",
	EV_RESIZE = "dlg:resize",

	EV_FOCUS = "dlg:focus",
	EV_BLUR = "dlg:blur",

	CONTENTBOX = "contentBox",
	BOUNDINGBOX = "boundingBox",
	BOX = "box",
	ICON = "icon",
	LOCKED = "locked",
	TITLE = "title",
	BAR = "bar",
	CONTAINER = "container",
	OUTTER = "outter",
	CONTROLLER = "controller",
	CUSTOM = "custom",
	BTN = "btn",
	STD = "std",
	SKIN = "skin",
	CURRENT = "current",

	DIALOGID = "dialogId",

	CSS_LOCKED = getCN(BOX, LOCKED),
	CSS_TITLE_BAR = getCN(BOX, TITLE, BAR),
	CSS_TITLE = getCN(BOX, TITLE),
	CSS_TITLE_ICON = getCN(BOX, ICON),
	CSS_CONTAINER = getCN(BOX, CONTAINER),
	CSS_CONTAINER_OUTTER = getCN(BOX, CONTAINER, OUTTER),
	CSS_CONTROLLER = getCN(BOX, CONTROLLER),
	CSS_CUSTOM_BTN = getCN(BOX, CUSTOM, BTN),
	CSS_STD_BTN = getCN(BOX, STD, BTN),
	CSS_CURRENT = getCN(BOX, CURRENT),
	CSS_BTN_BAR = getCN(BOX,BTN,BAR),


	TEMPLATE_HEADER = "<div class='" + CSS_TITLE_BAR + "'>" +
	"<div class='" + CSS_TITLE_ICON + "'></div>" +
		"<div class='" + CSS_TITLE + "'><span class='title'>{title}</span><span class='extra yui3-hastooltip'></span></div></div>",
	TEMPLATE_BODY = "<div class='" + CSS_CONTAINER_OUTTER + "'><div class='" + CSS_CONTAINER + "'></div></div>",
	TEMPLATE_FOOTER = "<div class='" + CSS_CONTROLLER + "'></div>",   
	TEMPLATE_BUTTONS = "<div class='"+CSS_BTN_BAR+"'><div class='" + CSS_STD_BTN + "'></div><div class='" + CSS_CUSTOM_BTN + "'></div></div>",
	TEMPLATE_BTN = "<a hidefocus=\"\" href=\"#\" title=\"{tip}\" class=\"yui3-box-btn-{btnClass}\" style=\"display: none;\"></a>",
//	TEMPLATE_WIN_BTN =
//		"<div class='yui3-box-wbtn yui3-box-wbtn-{btnClass}' title='{btnTip}'>" +
//			"<a class='inner'>" +
//				"<span class='icon small-icon-{btnIcon}'></span>" +
//				"<span class='text'>{btnName}</span>" +
//			"</a>"
//		"</div>";
	TEMPLATE_WIN_BTN = '<button type="button" class="btn btn-default btn-sm yui3-btn-bootstrap yui3-box-wbtn-{btnClass}" title="{btnTip}">\
							<span class="icon yui3-icon-bootstrap small-icon-{btnIcon}"></span>\
							<span class="text">{btnName}</span>\
						</button>';


	Y.mix(strings, Y.Intl.get("box"), true);

	Y2.Box = Y.Base.create("box", Y2.Overlay, [], {

		initializer: function() {
			var dialogId = this.get(DIALOGID);
			if(dialogId === "") { dialogId = Y2.generateId("dialog-id");}
			this.set(DIALOGID, dialogId );

			this.set("zIndex", Y2.Box.getNextZIndex());

			if(this.get("modal")) {
				this.plug(Y.Plugin.OverlayModal);
				//this.set("zIndex", Y2.Box.MASK_INDEX+1);
			}
			this._createEvents();

			this._test_ = "yam-box";

			this.fullScreen = this._fullscreenBtnHandler;
			this.maximize = this._maxBtnHandler;
			this.restore = this._restoreBtnHandler;
			this.restorefs = this._restorefsBtnHandler;
			this.minimize = this._minBtnHandler;
			this.hideIt = this._minBtnHandler;
			this.showIt = this._active;
			this.closeIt = this._closeBtnHandler;

			this.plug(Y.Plugin.Background, {baseClass: "box"});

			if(this.get("modal")) {
				this.set("minimizeBtn", false);
			}
			
			if(this.get("centered") == true) {
				 var widgetNode = Y.one("body");
				 var viewRegion = widgetNode.get("viewportRegion");
				 var cc = [viewRegion.left + Math.floor(viewRegion.width/2), viewRegion.top + Math.floor(viewRegion.height/2)];
				 var xy = [cc[0] - (this.get("width")/2+5), cc[1] - (this.get("height")/2+5)];
				 this.set("xy", xy);
			}
			Y2.Global.BoxManager.regDialog(this);
		},

		destructor: function() {
			if(this._customBtnDestructor) {
				this._customBtnDestructor();	
			}
			if(this.__resizeHandler) {
				this.__resizeHandler.detach();
			}
			this.__resizeHandler = null;
			if(this.resize) {
				this.clearAOPCache(this.resize);
				this.resize.unplug();
				this.resize.destroy();
				this.resize = null;
			}
			Y2.Global.BoxManager.unregDialog(this);
			this.unplug();
		},

		renderUI: function() {
			this.get(CONTENTBOX).addClass(getCN(BOX, SKIN, this.get("skinClass")));
			var box = this.get(CONTENTBOX);
			box.insert(Y.substitute(TEMPLATE_HEADER, {title: this.get("title")}));
			box.insert(TEMPLATE_BODY);
			box.insert(TEMPLATE_FOOTER);
			box.one("." + CSS_TITLE_ICON).addClass("small-icon-" + (this.get("icon") || "default"));
			box.one("." + CSS_TITLE_BAR).insert(TEMPLATE_BUTTONS);


			var controlBtnsInfo = this.get("controlBtnsInfo");
			this.set("controlPane", controlBtnsInfo.length > 0);
			Y.Array.each(controlBtnsInfo, function(btnObj) {

				if(Y.Lang.isString(btnObj) && (btnObj in winBtnInfos)) {
					btnObj = {
						id : btnObj,
						text : strings[btnObj],
						tooltip : strings[btnObj]
					}
				}

				if(btnObj.id) {
					box.one("." + CSS_CONTROLLER).prepend(Y.substitute(TEMPLATE_WIN_BTN,
						{
							btnClass: btnObj.id,
							btnTip: btnObj.tooltip || btnObj.text,
							btnName: btnObj.text,
							btnIcon: btnObj.icon || btnObj.id
						}
					));
				}
			});

			if(this.get("controlPane")) {
				box.one("." + CSS_CONTROLLER).setStyle("display", "block");
				box.one("." + CSS_CONTROLLER).addClass("wbtn-" + this.get("buttonStyle"));
			} else {
				box.one("." + CSS_CONTROLLER).setStyle("display", "none");
			}

			//Initialize the visible of buttons
			Y.Array.each(btnInfos, function(btn) {
				box.one(".yui3-box-std-btn").insert(Y.substitute(TEMPLATE_BTN, {btnClass: btn, tip: strings[btn]}));
			});

			if(this.get("closeBtn")) {
				box.one(".yui3-box-btn-close").setStyle("display", "block");
			}
			if(this.get("minimizeBtn")) {
				box.one(".yui3-box-btn-min").setStyle("display", "block");
			}
			if(this.get("refreshBtn")) {
				box.one(".yui3-box-btn-close").setStyle("display", "block");
			}
			if(this.get("pinDownBtn")) {
				if(!this.get("pingDownState")) {
					box.one(".yui3-box-btn-pindown").setStyle("display", "block");
					box.one(".yui3-box-btn-pinup").setStyle("display", "none");
				} else {
					box.one(".yui3-box-btn-pindown").setStyle("display", "none");
					box.one(".yui3-box-btn-pinup").setStyle("display", "block");
				}
			}

			if(this.get("containerTemplate")) {
				box.one("." + CSS_CONTAINER).insert(this.get("containerTemplate"));
			}
			box.one("." + CSS_CONTAINER_OUTTER).addClass(CSS_CONTAINER + "-" + this.get("containerStyle"));

			if(Y.Resize) {
				this.resize = new Y.Resize({
					node: this.get(BOUNDINGBOX),
					autoHide:true
				});

				///*
				this.resize.plug(Y.Plugin.ResizeConstrained, {
				    minWidth: this.get("minWidth"),
				    minHeight: this.get("minHeight")
			    });

				this.resize.plug(Y.Plugin.ResizeProxy);

				this.addHandler(this.resize.after("resize:end", Y.bind(function(ev){
					Y.log("resize:end," + this.get(BOUNDINGBOX).get("offsetHeight") + "x" + this.get(BOUNDINGBOX).get("offsetWidth"));
					Y.log("resize:end," +ev.info.offsetHeight + "x" + ev.info.offsetWidth);
					this.set("height", ev.info.offsetHeight-10);
					this.set("width", ev.info.offsetWidth-10);
					var cb = this.get(CONTENTBOX);
					var padding = this.get("controlPane") ? 64: 31;
					cb.one("." + CSS_CONTAINER).setStyle("height", ev.info.offsetHeight - padding - 10);
					cb.one("." + CSS_CONTAINER).setStyle("width", ev.info.offsetWidth -2 - 10);
					var padding = 31;
					cb.one("." + CSS_CONTAINER_OUTTER).setStyle("height", ev.info.offsetHeight - padding - 10);
					cb.one("." + CSS_CONTAINER_OUTTER).setStyle("width", ev.info.offsetWidth -2 - 10);
					this.fire(EV_RESIZE);
				}, this)));

				this.resize.delegate.dd.set("lock",false);
				if(this.get("resizable")) {
					this._enableDragAndResize();
				} else {
					this._disableDragAndResize();
				}
				//*/
			}
			if(this.get("winState") !== "normal") {
				this._cached = true;
				this._cachedX = this.get("x") || 100;
				this._cachedY = this.get("y") || 100;
				this._cachedWidth = this.get("width") || 400;
				this._cachedHeight = this.get("height") || 350;
			}
			this.winStateChange();

			Y2.Global.BoxManager.activeDialog(this);

		},

		bindUI: function() {

			this.__resizeHandler = Y.on("windowresize", this.resizeHandler, this);
			this._childrenContainer = this.getContainerNode();


			Y.one("#"+this.get("id"))._test_ = "BOX_DOM";
			Y.one("#"+this.get("id"))._node._test_ = "BOX_DOM";
			//*
			var h = this.get("contentBox").on("click", function(e){
				Y2.Global.BoxManager.activeDialog(this);
				//e.halt();
			}, this);
			
			this.addHandler(h);
			//*/
			///*
			this.addHandler(this.get(CONTENTBOX).one(".yui3-box-std-btn").delegate("click", Y.bind(this.stdButtonClickHandler, this), 'a'));
			this.addHandler(this.get(CONTENTBOX).one(".yui3-box-controller").delegate("click", Y.bind(this.winButtonClickHandler, this), 'button'));
			this.addHandler(this.get(CONTENTBOX).one(".yui3-box-title").on("dblclick", Y.bind(function(){
				if(this.get("resizable")) {
					var winState = this.get("winState");
					if(winState == "normal") {
						if(this.get("maximizeBtn")) {this.maximize();}
					} else if (winState == "fullscreen") {
						this.restorefs();
					} else if (winState == "maximize") {
						if(this.get("maximizeBtn")) {this.restore();}
					}
				}
			}, this)));
			//*/
			this.addHandler(this.after("winStateChange", this.winStateChange, this));
			this.addHandler(this.after("pinDownStateChange", this.pinDownStateChange, this));
			


			///*
			this.plug(Y.Plugin.Drag);

			this.dd.addHandle(".yui3-box-title-bar");


//			if(!this.get("fullScreenDD")) {
//				if(Y2.Desktop) {
//					this.dd.plug(Y.Plugin.DDConstrained, {
//						//constrain2node: '.yui3-desktop-body',
//						constrain2node: 'body',
//						gutter: '10 12 35 10'
//					});
//				} else {
//					this.dd.plug(Y.Plugin.DDConstrained, {
//						constrain2node: 'body'
//						//gutter: '10 12 10 10'
//					});
//				}
//			}


			this.dd.on('drag:start', function(e) {
		    	var dialog = Y.Widget.getByNode(e.target.get('node'));
		    	dialog.active();
		    });


			if(this.get("winState") !== "normal") {
				this.dd.set("lock", true);
			}
			//*/
			this.on(EV_RESIZE, Y.bind(function(){
				this.syncSize();
			}, this));

		},

		/**
		 * The entry of all dialog title buttons, actual handler is _[buttonName]BtnHandler,
		 * where [buttonName] is button name, such as max, min, restore etc.
		 */
		stdButtonClickHandler: function(e) {
			var id=e.currentTarget.getAttribute("className").replace("yui3-box-btn-", "");
			this["_"+id+"BtnHandler"].call(this, e);
		},

		winButtonClickHandler: function(e) {
			e.halt();
			var id=e.currentTarget.getAttribute("className").replace("btn btn-default btn-sm yui3-btn-bootstrap yui3-box-wbtn-", "");
			if(this["_"+id+"WinBtnHandler"]) {
				this["_"+id+"WinBtnHandler"].call(this, e);
			} else {
				if(!this.getEvent(id, "dlg")) {
					//EV_CLOSE
					this.publish("dlg:" + id, {
						defaultFn : this._defCloseFn,
						preventedFn: this._prevCloseFn,
						queuable: false,
						emitFacade: true,
						bubbles: true,
						prefix: "dlg"
					});
				}
				this.fire("dlg:" + id);
			}
		},

		getContainerNode : function() {
			return this.get(CONTENTBOX).one("." + CSS_CONTAINER);
		},

		_closeBtnHandler : function() {
			this.fire(EV_CLOSE);
		},

		_minBtnHandler: function(e) {
			//don't change winState
			this.set("visible", false);
			this.fire(EV_MIN);
			if(e) {e.stopPropagation();}
			Y2.Global.BoxManager.activeTheTopOneDialog();
		},

		_maxBtnHandler: function() {
			this._saveDialogSize();
			this.set("lastState", this.get("winState"));
			this.set("winState", "maximize");
			this.fire(EV_MAX);
		},

		_restoreBtnHandler: function() {
			this.set("lastState", this.get("winState"));
			this.set("winState", "normal");
			this.fire(EV_RESTORE);
		},

		_fullscreenBtnHandler: function() {
			this._saveDialogSize();
			this.set("lastState", this.get("winState"));
			this.set("winState", "fullscreen");
			this.fire(EV_FULLSCREEN);
		},

		_restorefsBtnHandler: function() {
			this.set("winState", this.get("lastState") || "normal");
			this.set("lastState", "fullscreen");
			this.fire(EV_RESTOREFS);
		},

		_refreshBtnHandler:function() {
			this.fire(EV_REFRESH);
		},

		_pindownBtnHandler:function() {
			this.fire(EV_PINDOWN);
			this.set("pinDownState", true);
		},

		_pinupBtnHandler:function() {
			this.fire(EV_PINUP);
			this.set("pinDownState", false);
		},

		pinDownStateChange: function() {
			var state = this.get("pinDownState");
			if(state) {
				this._updateBtns("pindown", "none")._updateBtns("pinup");
				this.set("zIndex", Y2.Box.getNextPindDownZIndex());
			} else {
				this._updateBtns("pinup", "none")._updateBtns("pindown");
				this.set("zIndex", Y2.Box.getNextZIndex());
			}
		},

		winStateChange: function() {
			var winState = this.get("winState");
			if(winState === "normal") {
				this._restoreDialogSize();
			} else if (winState === "maximize") {
				this._maximizeDialog();
			} else if (winState === "fullscreen") {
				this._fullScreenDialog();
			}

			this._updateStateButtons();
			this._updateContainerSize();

		},

		/**
		 * Reset the visible of four state related buttons (max, restore,
		 * fullscreen, restorefs),based on current dialog state.
		 * @private
		 */
		_updateStateButtons : function() {
			var winState = this.get("winState");

			this._updateBtns(["max","restore","fullscreen","restorefs"], "none");
			if (winState === "maximize") {
				if(this.get("maximizeBtn")) {
					this._updateBtns("restore");
				}
				if(this.get("fullScreenBtn")) {
					this._updateBtns("fullscreen");
				}
			} else if (winState === "fullscreen") {
				if(this.get("fullScreenBtn")) {
					this._updateBtns("restorefs");
				}
			} else if(winState === "normal") {
				if(this.get("maximizeBtn")) {
					this._updateBtns("max");
				}
				if(this.get("fullScreenBtn")) {
					this._updateBtns("fullscreen");
				}
			}
		},

		syncOwnSize: function() {
			this._updateContainerSize(false);
		},

		_updateContainerSize : function(noEVENT) {
			var cb = this.get(CONTENTBOX);
			var padding = this.get("controlPane") ? 64: 31;
			cb.one("." + CSS_CONTAINER).setStyle("height", this.get("height") - padding - 9);
			cb.one("." + CSS_CONTAINER).setStyle("width", this.get("width")-10);
			var padding = 31;
			cb.one("." + CSS_CONTAINER_OUTTER).setStyle("height", this.get("height") - padding - 7);
			cb.one("." + CSS_CONTAINER_OUTTER).setStyle("width", this.get("width")-9);
			if(noEVENT !== false) this.fire(EV_RESIZE);
		},

		resizeTo: function(width, height) {
			this.set("width", width);
			this.set("height", height);

			if(this.get("modal")) {
				this.set("zIndex", Y2.Box.getNextZIndex());
			} else {
				this.set("zIndex", Y2.Box.getNextZIndex());
			}
			this.syncOwnSize();
		},

		/**
		 * handler for browser window resize event, and make fullscreen or
		 * maximize dialog always keep their state.
		 */
		resizeHandler : function() {
			var winState = this.get("winState");
			if(winState === "fullscreen") {
				this._fullScreenDialog(true);
				this._updateContainerSize();
			} else if(winState === "maximize") {
				this._maximizeDialog(true);
				this._updateContainerSize();
			}
		},

		/**
		 * helper function to show/hide title button
		 * @private
		 */
		_updateBtns : function(btns, state) {
			state = state || "block";
			if(L.isString(btns)) { btns = [btns]; }
			var box = this.get("contentBox");
			Y.Array.each(btns, Y.bind(function(name){
				box.one(".yui3-box-btn-" + name).setStyle("display", state);
			}, this));
			return this;
		},

		_saveDialogSize: function() {
			var winState = this.get("winState");
			if(winState === "normal") {
				this.syncXY();
				this._cachedX = this.get("x");
				this._cachedY = this.get("y");
				var node = this.get(BOUNDINGBOX);
				this._cachedHeight = node.get("offsetHeight")-10;
				this._cachedWidth = node.get("offsetWidth")-10;
				this._cached = true;
			}
		},

		_maximizeDialog: function(noUpdateZIndex) {
			var bodyNode;
			if(Y.one(".yui3-desktop")) {
				this.set("x", 5).set("y", 70);
				bodyNode = Y.one(".yui3-desktop .yui3-desktop-body");
			} else {
				this.set("x", 5).set("y", 5);
				bodyNode = Y.one("body");
			}
			this.set("width", bodyNode.get("offsetWidth")-22);
			if(Y.one(".yui3-taskbar")) {
				this.set("height", bodyNode.get("offsetHeight")-51);
			} else {
				this.set("height", bodyNode.get("offsetHeight")-20);
			}

			if(this.get("modal")) {
				//this.set("zIndex", Y2.Box.MASK_INDEX+1);
				if(!noUpdateZIndex) this.set("zIndex", Y2.Box.getNextZIndex());
			} else {
				if(!noUpdateZIndex) this.set("zIndex", Y2.Box.getNextZIndex());
			}
			this._disableDragAndResize();
		},

		_fullScreenDialog: function(noUpdateZIndex) {
			this.set("x", 5).set("y", 5);
			var bodyNode = Y.one("body");
			this.set("width", bodyNode.get("offsetWidth")-22);
			this.set("height", bodyNode.get("offsetHeight")-50);
			//this.set("zIndex", Y2.Box.FULLSCREEN_INDEX);
			if(!noUpdateZIndex) this.set("zIndex", Y2.Box.getNextZIndex());
			this._disableDragAndResize();
		},

		_restoreDialogSize: function() {
			if(this._cached) {
				this.set("x", this._cachedX);
				this.set("y", this._cachedY);
				this.set("height", this._cachedHeight);
				this.set("width", this._cachedWidth);
				if(this.get("modal")) {
					this.set("zIndex", Y2.Box.MASK_INDEX+1);
					this.set("zIndex", Y2.Box.getNextZIndex());
				} else {
					this.set("zIndex", Y2.Box.getNextZIndex());
				}

			}
			if(this.get("resizable")) {
				this._enableDragAndResize();
			}
		},

		_enableDragAndResize: function() {
			this.get(BOUNDINGBOX).removeClass(CSS_LOCKED);
			if(this.dd) {
				this.dd.set("lock", false);
			}
		},

		_disableDragAndResize: function() {
			this.get(BOUNDINGBOX).addClass(CSS_LOCKED);
			if(this.dd) {
				this.dd.set("lock", true);
			}
		},

		active : function() {
			Y2.Global.BoxManager.activeDialog(this);
		},

		showAndActive: function() {
			Y.later(200, this, function(){
				this.show();
				this.active();
			});
		},

		updateBoxTitle: function(title) {
			this.get(CONTENTBOX).one("."+CSS_TITLE + " .title").set("innerHTML", title);
		},

		updateBoxTitleExtra: function(extra, tooltip) {
			var extraNode = this.get(CONTENTBOX).one("."+CSS_TITLE + " .extra");
			extraNode.set("innerHTML", extra);
			extraNode.setAttribute("extraTitle", tooltip);
			if(tooltip != "" && !this._createTooltip) {
				this._createTooltip = true;
				var tt = new Y2.Tooltip({
				    triggerNodes:".yui3-hastooltip",
				    delegate: this.get(CONTENTBOX),
				    content: {},
				    shim:true,
				    zIndex:9000000
				});
				tt.render();

				tt.on("triggerEnter", function(e) {
				    var node = e.node;
				    if (node && node.hasClass("extra")) {
				        this.setTriggerContent(node.getAttribute("extraTitle"));
				    }
				});
			}

		},

		_active : function() {
			this.set("zIndex", Y2.Box.getNextZIndex());
			this.get(CONTENTBOX).addClass(CSS_CURRENT);
			this.set("visible", true);
			this.fire(EV_FOCUS);
		},

		_inactive : function() {
			this.get(CONTENTBOX).removeClass(CSS_CURRENT);
			this.fire(EV_BLUR);
		},

		_createEvents : function() {

			//EV_CLOSE
			this.publish(EV_CLOSE, {
				defaultFn : this._defCloseFn,
				preventedFn: this._prevCloseFn,
				queuable: false,
				emitFacade: true,
				bubbles: true,
				prefix: "dlg"
			});

		},

		_defCloseFn : function() {
			//Close dialog and unregister it from BoxManager object
			try{
				this.destroy();
			}catch(e){};
		},

		_prevCloseFn : function() {
			//EMPTY_FN, do nothing
		},

		showWindowBtns: function(ids) {
			var cb = this.get(CONTENTBOX), btnBar = cb.one("." + CSS_CONTROLLER);
			Y.Array.each(ids, function(btnId) {
			    btnBar.one(".yui3-box-wbtn-"+btnId).setStyle("display", "");
			});
		},

		hideWindowBtns: function(ids) {
			var cb = this.get(CONTENTBOX), btnBar = cb.one("." + CSS_CONTROLLER);
			Y.Array.each(ids, function(btnId) {
			    btnBar.one(".yui3-box-wbtn-"+btnId).setStyle("display", "none");
			});
		},

		_desktopCenterSetter: function(val) {
		},

		addCustomBtnSetting: function(initFn, destoryFn) {
			var box = this.get(CONTENTBOX);
			var result = initFn(box.one("." + CSS_CUSTOM_BTN));
			if(result) {
				this._customBtnDestructor = function(){
					destoryFn(box.one("." + CSS_CUSTOM_BTN));	
				}
			}
		}

	}, {

		ATTRS : {

			shim : {
				value : "true"	
			},

			title : {
				value : "Untitled Dialog"
			},

			modal : {
				value: false
			},

			centered : {
				value: false,
				setter: "_desktopCenterSetter"
			},

			draggable: {
				value: true
			},

			resizable: {
				value: true
			},

			render : {
				value: true
			},

			dialogId : {
				value: ""
			},

			visible: {
				value: false
			},

			icon : {
				value: "default"
			},

			skinClass : {
				value: "normal"         //"normal", "transparent"
			},

			fullScreenDD: {
				value: false
			},

			containerTemplate: {
				value: null
			},

			containerStyle : {
				value: "grey-border"     //"grey-border", "transparent" ....
			},

			buttonStyle : {
				value: "normal"          //"normal", "icon", "flat-icon"	
			},

			minWidth : {
				value : 200
			},

			minHeight: {
				value : 100
			},

			closeBtn : {value: true },
			minimizeBtn : {value: true},
			maximizeBtn : {value: true},            //maxBtn, restoreBtn
			refreshBtn : {value: false},
			fullScreenBtn : {value: false},         //fullScreeenBtn, RestorefsBtn
			pinDownBtn : {value: false},            //pinDownBtn, pinUpBtn

			controlPane : {
				value : false
			},

			controlBtnsInfo : {
				value : []
			},

			winState : {value: "normal"},           //"normal", "maximize", "fullscreen"
			lastState : {value: null},

			pinDownState: {value: false}            //"pin-up", "pin-down"



		},
		MASK_INDEX: 2000000,
		FULLSCREEN_INDEX: 2000001,
		getNextZIndex : function(){
			//normal dialog z-index, mask block will have z-index 10000
			return Y2.generateId("box-z-index", {from: 10000, prefix: false});
		},

		getNextPindDownZIndex : function() {
			return Y2.generateId("box-pin-down-z-index", {from: 2000002, prefix: false});
		},

		getInstance: function(config, forceNew) {
			//Add this static method to avoid generate two dialog with same id;
			if(!forceNew && config.dialogId && Y2.Global.BoxManager.exist(config.dialogId)) {
				return Y2.Global.BoxManager.getDialog(config.dialogId);
			} else {
				return new Y2.Box(config);
			}
		}

	});

	var BoxManager = function() {
		this._list = {};
		this._count = 0;
		this._activeDialog = null;

		MessageBus.on("inner:focusHideDialog", Y.bind(this.focusHideDialog, this));
		MessageBus.on("inner:closeDialog", Y.bind(this.closeDialog, this));
	};

	Y.extend(BoxManager, Y.Base, {

		getDialog : function(dialogId) {
			return this._list[dialogId] || null;
		},

		exist : function(dialogId) {
			return !!this._list[dialogId];
		},

		regDialog : function(dialog) {
			this._list[dialog.get(DIALOGID)] = dialog;
			this._count++;
			MessageBus.fire("inner:dialogRegistered", {
				dialogId : dialog.get("dialogId"),
				icon : dialog.get("icon") || "default",
				title : dialog.get("title"),
				minimizable : dialog.get("minimizeBtn")
			});
		},

		unregDialog : function(dialog) {
			MessageBus.fire("inner:dialogUnregistered", {
				dialogId : dialog.get("dialogId"),
				icon : dialog.get("icon") || "default",
				title : dialog.get("title"),
				minimizable : dialog.get("minimizeBtn")
			});
			delete this._list[dialog.get(DIALOGID)];
			if(dialog.get(DIALOGID) === this._activeDialogId) {
				this._activeDialogId = -1;
			}
			this._count--;
			this.activeTheTopOneDialog();
		},

		activeDialog : function(dialog) {
			for(var id in this._list) {
				if(this._list.hasOwnProperty(id)) {
					if(id === dialog.get(DIALOGID) && id !== this._activeDialogId) {

						var lastDialog = this._list[this._activeDialogId];
						if(lastDialog) {
							lastDialog._inactive();

							MessageBus.fire("page:dialogInActived", {
								dialogId : lastDialog.get("dialogId"),
								icon : lastDialog.get("icon") || "default",
								title : lastDialog.get("title"),
								minimizable : lastDialog.get("minimizeBtn")
							});
						}

						dialog._active();
						this._activeDialogId = id;
						MessageBus.fire("page:dialogActived", {
							dialogId : dialog.get("dialogId"),
							icon : dialog.get("icon") || "default",
							title : dialog.get("title"),
							minimizable : dialog.get("minimizeBtn")
						});
					}
				}
			}
		},

		activeTheTopOneDialog : function() {
			var topDialog = null;
			var maxIndex = 0;
			for(var id in this._list) {
				if(this._list.hasOwnProperty(id)) {
					var dialog = this._list[id];
					if(dialog.get("zIndex")>maxIndex&&dialog.get("visible")) {
						topDialog = dialog;
						maxIndex = dialog.get("zIndex");
					}
				}
			}
			if(topDialog) {
				this.activeDialog(topDialog);
			} else {
				this._activeDialogId = -1;	
			}
		},

		focusHideDialog : function(ev) {
			if(ev.dialogId) {
				var dialog = this._list[ev.dialogId];
				if(dialog) {
					if(dialog.get("visible") && (ev.dialogId === this._activeDialogId)) {
						dialog.hideIt();
					} else {
						this.activeDialog(dialog);
					}
				}
			}
		},

		closeDialog : function(ev) {
			if(ev.dialogId) {
				var dialog = this._list[ev.dialogId];
				if(dialog) {
					dialog.closeIt();
				}
			}
		}
	});

	/**
	 * Host a page-global BoxManager instance for manage all dialogs
	 * in same page
	 */
	Y2.Global.BoxManager = Y2.Global.BoxManager || new BoxManager();

}, "0.0.1", {requires: ['intl', 'node', 'dd-plugin', 'dd-constrain', 'substitute', 'classnamemanager',
      'overlay', 'yam-core', 'yam-plugin-overlay-modal', 'yam-control-component',
		"yam-control-tooltip", "yam-plugin-background"]});
