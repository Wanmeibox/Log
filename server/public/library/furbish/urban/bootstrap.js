(function(win){

	/**
	 * FILTERS defined for YAM library only, so we could change this value load
	 * debug or minified sources.
	 */
	var YAM_FILTERS = {
		"MIN" : "",
		"RAW" : {
			"searchExp": "(ya[em]|jq)([a-z\-]*)-min\\.js",
			"replaceStr": "$1$2.js"
		},
		"DEBUG": {
			"searchExp": "(ya[em]|jq)([a-z\-]*)-min\\.js",
			"replaceStr": "$1$2.js"
		},
		"ALL_RAW": "RAW",
		"ALL_DEBUG": "DEBUG"
	},

	getRootPath = function(srcPattern, comboPattern) {
		var b, nodes, i, src, match, pos;
		var doc = win.document;
		// get from querystring
		nodes = (doc && doc.getElementsByTagName('script')) || [];
		for (i=0; i<nodes.length; i=i+1) {
			src = nodes[i].src;
			if (src) {
				match = src.match(srcPattern);
				b = match && match[1];
				if(b) {
					return b;
				}else {
					pos = src.indexOf("/library/furbish/urban/bootstrap.js");
					if(pos > 0){
						src = src.substr(0, pos);
						return src.substr(src.lastIndexOf("/")) + "/";
					}
				}
			}
		}

		// use CDN default
		return b;
	},

	ROOTPATH = getRootPath(/^(.*)library\/furbish\/urban\/bootstrap([\.\-].*)js(\?.*)?$/) || "./",
	LIBPATH = ROOTPATH + "library",
	YUIPATH = "/3rdparty/yui/",
	YUI3171PATH = YUIPATH + "3.17.1/",
	JQUERYPATH = "/3rdparty/jquery/",
	OTHERPATH = "/3rdparty/other/",

	YAMBASE = "/furbish/urban",
	YAMEXT  = "/furbish/urban-ext",
	COMBOBASE = ROOTPATH + "combo?",

	//Global YAM configuration object
	YAM_config = {
		rootPath : ROOTPATH,
		basePath : LIBPATH + YAMBASE,
		extPath : LIBPATH + YAMEXT,

		/*Enable combine service, yui loader will send one combo request for a batch of javascripts*/
		/*Builder will replace this code to actual setting*/
		enableCombine : /*-@yamEnableCombine*/false,
		enableFlexModel : true,
		staticMode: false
	},
	enableCombine = YAM_config.enableCombine;
	YUI.YAM_config = YAM_config;

	//PLEASE DO NOT CHANGE THOSE CODE!!
	/*Builder will replace this code to actual JSON module dependence*/
	var yamModules = /*-@yamModules@-*/{};

	//PLEASE DO NOT CHANGE THOSE CODE!!
	/*Builder will replace this code to actual JSON module dependence*/
	var yaeModules = /*-@yaeModules@-*/{};

	var otherConfigFn = function(me) {
		if(/-css|-skin/.test(me.name)) {
			me.type = "css";
			me.path = me.path.replace(/\.js/, '.css');
			me.path = me.path.replace(/\-min/, '');
		} else {
			me.path = me.path.replace(/\-min/, '');
		}
	};

	var yamConfigFn = function(me) {
		if(/-css|-skin/.test(me.name)) {
			me.type = "css";
			me.path = me.name.replace("yam", "");
			me.path = me.path.replace(/\-/g, "/") + "/main.css";
		} else {
			me.path = me.path.split("/")[1];
			me.path = me.path.replace("yam-", "");
			me.path = me.path.replace(/\-/g, "/");
			me.path = "/" + me.path.replace("\/min", "");
		}
	};

	var Y = win.Y || YUI();
	win.Y = Y;

	win.YUI_config = {
		base: LIBPATH + YUI3171PATH,
		combine: enableCombine,
		comboBase: COMBOBASE,
		filter: "min",//"raw","debug","min"
		root: YUI3171PATH,
		groups: {
			yam: {
				base: LIBPATH + YAMBASE,
				comboBase: COMBOBASE,
				combine: enableCombine,
				name: "yam",
				patterns: {
					"yam-skin-": { configFn : yamConfigFn },
					"yam-": {configFn: yamConfigFn}
				},
				root: YAMBASE,
				modules : yamModules
			},
			jquery: {
				base: LIBPATH + JQUERYPATH,
				comboBase: COMBOBASE,
				combine: enableCombine,
				name: "jquery",
				patterns: {"jq": {
						configFn : otherConfigFn
					}
				},
				root: JQUERYPATH,
				filter: "RAW",
				modules : {}
			},
			other: {
				base: LIBPATH + OTHERPATH,
				comboBase: COMBOBASE,
				combine: enableCombine,
				name: "other",
				patterns: {"": {
						configFn : otherConfigFn
					}
				},
				root: OTHERPATH,
				filter: "RAW",
				modules : {}
			}
		}
	};

	if(win.Y) {
		Y.applyConfig(YUI_config);
	}

	if(Y.UA.ie==6) {
		document.execCommand("BackgroundImageCache",false,true);
	}

})(this);