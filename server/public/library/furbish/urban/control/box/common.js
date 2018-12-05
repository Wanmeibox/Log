YUI.add("yam-control-box-common", function(Y){

	var Box = Y.YAM.Box,
		ALERT_TEMPLATE = ["<div class='common-container common-type-{dialogType}'>",
		                  	"<div class='common-icon common-icon-{dialogType}'></div>",
		                  	"<div class='common-content' style='visibility:hidden'>{dialogMessage}</div>",
		                  "</div>"].join(""),
		PROMPT_TEMPLATE = ["<div class='common-container common-type-{dialogType}'>",
		                  	"<div class='common-icon common-icon-{dialogType}'></div>",
		                  	"<div class='common-content'>{dialogMessage}",
		                  	"<div class='prompt-content'><input class='prompt-value' value='{defaultValue}'></input></div></div>",
		                  "</div>"].join(""),
		HOST = 'host';

	Box.TYPE_INFO = "info";
	Box.TYPE_WARNING = "warning";
	Box.TYPE_ERROR = "error";
	Box.TYPE_NONE = "none";

	Box.BTN_OKCANCEL = "ok,cancel";
	Box.BTN_YESNO = "yes,no";
	Box.BTN_YESNOCANCEL = "yes,no,cancel";


	/**
	 * Alert dialog, popup a dialog with proper icon and text for hint, you could use
	 *    var box = Box.alert(xxx);
	 *    box.on("dlg:ok", function(){...})
	 * to register a callback function when user click OK button in the dialog.
	 *
	 * @param {string} sMessage the message will be shown in popup dialog
	 * @param {string} sTitle the title of dialog
	 * @param {object} config other configuration support by this dialog, include
	 * width, height, dialogType (three strings supported: info, warning, error)
	 */
	Box.alert = function(sMessage, sTitle, config) {
		config = config || {};
		config.width = config.width || 320;
		config.height = config.height || 180;
		config.minWidth = config.minWidth || 300;
		config.minHeight = config.minHeight || 150;
		sTitle = sTitle || "信息";
		sMessage = sMessage || "提示信息为空？";
		config.dialogType = config.dialogType || Box.TYPE_INFO; //warning, info, error

		var box = Box.getInstance({
			minWidth : config.minWidth,
			minHeight: config.minHeight,
			height : config.height,
			width  : config.width,
			centered: true,
			modal  : true,
			title: sTitle,
			winState:"normal",
			fullScreenBtn : false,
			maximizeBtn : false,
			minimizeBtn : false,
			render : false,
			icon: "info",
			buttonStyle: "icon",
			controlPane : true,
			controlBtnsInfo : ["ok"],
			containerTemplate : Y.substitute(ALERT_TEMPLATE,
					{dialogType: config.dialogType, dialogMessage: sMessage})
		});

		try{
			box.render();
		}catch(e){};

		Y.later(100, this, function(){

			var content = box.get("contentBox").one(".common-content");
			var height = content.get("offsetHeight");
			if(height>64) {
				content.setStyle("padding-top", "2px");
			}
			content.setStyle("visibility","");
			box.show();
			box.active();

		});

		return box;
	};

	/**
	 * Confirm dialog, popup a dialog with proper icon and text for hint, you could use
	 *    var box = Box.confirm(xxx);
	 *    box.on("dlg:ok", function(){...})
	 *    box.on("dlg:cancel", function(){....});
	 * to register a callback function when user click OK/Cancel button in the dialog.
	 *
	 * @param {string} sMessage the message will be shown in popup dialog
	 * @param {string} sTitle the title of dialog
	 * @param {object} config other configuration support by this dialog, include
	 * width, height, dialogType (three strings supported: info, warning, error,default is info)
	 * buttonType ("ok,cancel", "yes,no", "yes,no,cancel")
	 */
	Box.confirm = function(sMessage, sTitle, config) {
		config = config || {};
		config.width = config.width || 320;
		config.height = config.height || 180;
		sTitle = sTitle || "确认";
		sMessage = sMessage || "确认信息为空？";
		config.dialogType = config.dialogType || Box.TYPE_INFO; //warning, info, error
		config.buttonType = config.buttonType || Box.BTN_OKCANCEL;
		var box = Box.getInstance({
			height : config.height,
			width  : config.width,
			centered: true,
			modal  : true,
			title: sTitle,
			winState:"normal",
			fullScreenBtn : false,
			maximizeBtn : false,
			minimizeBtn : false,
			render : false,
			icon: "info",
			buttonStyle: "icon",
			controlPane : true,
			controlBtnsInfo : config.buttonType.split(","),
			containerTemplate : Y.substitute(ALERT_TEMPLATE,
					{dialogType: config.dialogType, dialogMessage: sMessage})
		});
		
		try{
			box.render();
		}catch(e){};

		Y.later(100, this, function(){
			var content = box.get("contentBox").one(".common-content");
			var height = content.get("offsetHeight");
			if(height>64) {
				content.setStyle("padding-top", "2px");
			}
			content.setStyle("visibility","");
			box.show();
			box.active();
		});

		return box;
	};

	Box.prompt = function(sMessage, sTitle, config) {
		config = config || {};
		config.width = config.width || 320;
		config.height = config.height || 180;
		sTitle = sTitle || "输入";
		sMessage = sMessage || "输入提示文字为空？";
		config.dialogType = config.dialogType || Box.TYPE_INFO; //warning, info, error
		config.buttonType = config.buttonType || Box.BTN_OKCANCEL;
		config.defaultValue = config.defaultValue || "";
		var box = Box.getInstance({
			height : config.height,
			width  : config.width,
			centered: true,
			modal  : true,
			title: sTitle,
			winState:"normal",
			fullScreenBtn : false,
			maximizeBtn : false,
			minimizeBtn : false,
			render : false,
			icon: "info",
			buttonStyle: "icon",
			controlPane : true,
			controlBtnsInfo : config.buttonType.split(","),
			containerTemplate : Y.substitute(PROMPT_TEMPLATE,
					{dialogType: config.dialogType, dialogMessage: sMessage, defaultValue: config.defaultValue})
		});

		try{
			box.render();
		}catch(e){};
		
		Y.later(100, this, function(){box.show(); box.active();});

		box.getPromptValue = function() {
			return this.__promptValue;
		};

		Y.Array.each(config.buttonType.split(","), function(item) {
			box.on("dlg:" + item, Y.bind(function(){
				var input = box.get("contentBox").one(".prompt-value");
				box.__promptValue = input.get("value");
			}, this));
		});
		return box;


	};

}, "0.0.1", {requires : ["yam-control-box-base", "plugin", "substitute"]});