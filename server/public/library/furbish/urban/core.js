YUI.add("yam-core", function(Y){
	
	Y.namespace("YAM").meta = {
		version : "0.0.1",
		name: "YUI Additional Modules",
		toString : function() {
			return this.name + " " + this.version;
		},
		rootPath: YUI.YAM_config.rootPath,
		basePath: YUI.YAM_config.basePath,
		extPath: YUI.YAM_config.extPath
	};
	
	var Y2 = Y.YAM;

	/**
	 * Hold a global object in YUI object directly, then we could create some object
	 * accessible from every YUI instance
	 */
	YUI.Env.Y2Global = YUI.Env.Y2Global || {
		/**
		 * Id generator for global unique
		 */
		generateId : (function() {
			var idGenerator = {};
			return function(prefix, config) {
				prefix = (prefix || "object");
				config = config || {};
				Y.mix(config, {from: "1", prefix: true, step:2});
				idGenerator[prefix] = idGenerator[prefix] || config.from;
				if(idGenerator[prefix]<config.from) { idGenerator[prefix] = config.from; }
				idGenerator[prefix] = idGenerator[prefix] + config.step;
				var index = idGenerator[prefix];
				return !config.prefix ? index : prefix + "-" + (index);
			};
		})()
	};

	//YUI.Env.Y2Event = YUI.Env.Y2Event || new Y.EventTarget();

	Y2.Global = YUI.Env.Y2Global;
	Y2.generateId = Y2.Global.generateId;

	/*
	 * EventTarget, this is a page-level MessageBus, we could use this
	 * to publish/subscribe global message to what ever component in same page.
	 *
	 * Updated: Use YUI global eventTarget instead,
	 * and then we could use broadcast property (broadcast = 2, see event-custom.js)
	 * when we publish a event, and mark bubble the event to global object.
	 *
	 * var Y2 = Y.YAM, MsgBus = Y.YAM.MessageBus;
	 *
	 * MsgBus.fire("app:lunchApp", {appId: "111"});
	 * MsgBus.on("app:lunchApp", f);
	 */
	Y2.MessageBus = YUI.Env.globalEvents;

	if(Y.UA.gecko) {
		Y.one("body").addClass("yui3-browser-ff");
	} else if (Y.UA.ie) {
		Y.one("body").addClass("yui3-browser-ie");
		Y.one("body").addClass("yui3-browser-ie" + Y.UA.ie);
	} else if(Y.UA.chrome) {
		Y.one("body").addClass("yui3-browser-chrome");
		Y.one("body").addClass("yui3-browser-chrome" + Y.UA.chrome);
	}

	if(Y.UA.chrome) {
		Y.DOM.creators.tr = "tbody";
		Y.DOM.creators.td = "tr";
	}
   	
	Y2.pageType = "desktop"; //iframe, windowOpenDialog, modalDialog


	
	

},'0.0.1',{requires:["node", "event-custom"]});