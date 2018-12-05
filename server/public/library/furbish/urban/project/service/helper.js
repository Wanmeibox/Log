YUI.add("yam-project-service-helper", function(Y){
  
	var Y2 = Y.YAM, ServiceHelper = {},
		Lang = Y.Lang,
		MessageBus = Y2.MessageBus,
		NOPE = function(){},
		SUCCESS_FN = "successFn",
		ERROR_FN = "errorFn",
		METHOD = "method",
		URL = "url",
		DATA = "data",
		PACK = "pack",
		OPERATION = "operation",
		FORCE_SERVER = "forceServer";
		

	Y2.meta.APIPath = Y2.meta.rootPath;
    Y2.meta.APIPath = 'http://dev.tongtongtingche.com.cn:8085/rs/'
	Y2.meta.resourcePath = Y2.meta.rootPath;
    Y2.meta.APIPath_Old = 'http://localhost:8080/rs/';

	var generalHandler = {
		start: function(id, args) {},
		complete: function(id, o, args) {},
		success: function(id, o, args) {
			var res = {};
			try {
				res = Y.JSON.parse(o.responseText);
			}
			catch (e) {
				alert("Invalid JSON data");
			}
			
			if((Lang.isBoolean(res.success) && res.success === true) ||
				Lang.isString(res.success)&& res.success === "true") {
				var fn = this.get(SUCCESS_FN);
				fn(res.data, res);
			} else {
				var errorFn = this.get(ERROR_FN);
				var returnValue = errorFn(res.data, res);
				if(returnValue !== false) {
					//standard error handler
					alert(res.message);
				}
			}
			
		},
		failure: function(id, o, args) {
			if(o.status === 401) {
				var res = {}, message="", redirectUrl="";
				try {
					res = Y.JSON.parse(o.responseText);
					message = res.message;
					redirectUrl = res.data.redirectUrl;
				}
				catch (e) {
					
				}
				//redirect to login page....
				MessageBus.fire("app:error", {errorCode: "ERR10401", status: 401, url:args[0], message:message, redirectUrl:redirectUrl});
			}
		},
		end: function(id, args) {}
		
	};
	
	var ioRequest = Y.Base.create("ajaxReq", Y.Base, [], {
		
		call: function() {
			if((!Y2.staticMode || this.get(FORCE_SERVER) === true)
					&& this.get("forceMock") !== true) {
				if(!this._io) {
					var url = this.get(URL);
					var stamp =  (new Date()).getTime();
					url = url + ((url.indexOf("?")>-1) ? "&" : "?") + stamp;
					this._io = Y.io(url, {
						method : this.get(METHOD),
						data: this.get(DATA),
						on: generalHandler,
						context: this,
						arguments: [url]
					});
				}
			} else {
				var self = this;
				Y.use("yam-project-mock", function(Y){
					var Y2= Y.YAM;
					Y2.mockIo(self.get(PACK), self.get(OPERATION), {
						on: generalHandler,
						context: self
					});
				});
				
			}
			return this;
		},
		
		abort: function() {
			if(this._io && this._io.isInProgress()) {
				this._io.abort();				
			}
		},
		
		when: function(successFn, context) {
			successFn = Y.bind(successFn, context);
			this.set(SUCCESS_FN, successFn);
			return this;
		},
		
		error: function(errorFn, context) {
			errorFn = Y.bind(errorFn, context);
			this.set(ERROR_FN, errorFn);
			return this;
		}
		
		
	}, {
		ATTRS : {
			method : { value: "GET" },
			data: {value: ""},
			url: {value: ""},
			pack: {value: ""},
			operation: {value: ""},
			successFn : {value: NOPE },
			errorFn: {value: NOPE},
			disableGlobalError: {value: false},
			forceServer: {value:false},
			forceMock: {value:null}
		}
	});

	function openItInFrame(o) {
		var i = Y.Node.create('<iframe id="iframe-open-' + o.id + '" name="iframe-open-' + o.id + '" />');
			i._node.style.position = 'absolute';
			i._node.style.top = '-1000px';
			i._node.style.left = '-1000px';
			i._node.src = o.src;
			if (Y.UA.ie){
				i._node.onreadystatechange = o.loadedCallbackFn;
			}else {
				Y.on("load", o.loadedCallbackFn,'#iframe-open-' + o.id)
			}		
		Y.one('body').appendChild(i);	
	}

	ServiceHelper.newIFrameService = function(pack, operation, url) {
		url = url || ("api/" + pack + "/" +operation.toLowerCase() + "");
		var id = pack + "__" + operation.toLowerCase();
		return function(data,loadedCallbackFn) {
			loadedCallbackFn = loadedCallbackFn||function(){};
            data = data || {};
			data.t = (new Date()).getTime().toString();
			var dataStr = Y.QueryString.stringify(data);
            dataStr += "&token="+encodeURIComponent(localStorage.getItem("accessToken"))+"&timestamp="+new Date().getTime()+"&userID="+localStorage.getItem("userID");
			openItInFrame({id:id, src:Y2.meta.APIPath + url + (url.indexOf('?') == -1 ? "?" : "&") + dataStr,loadedCallbackFn:loadedCallbackFn});
		}
	}

	ServiceHelper.newService = function(pack, operation, method, url) {
		if (pack) {
			url = url || ("api/" + pack + "/" +operation.toLowerCase());
		} else {
			url = url || ("api" + "/" +operation.toLowerCase());
		}
		var verifyStr = "?token="+encodeURIComponent(localStorage.getItem("accessToken"))+"&timestamp="+new Date().getTime()+"&userID="+localStorage.getItem("userID");
		method = method || "GET";
		var request = function(dataObj) {
			var req = new ioRequest({
				url: Y2.meta.APIPath + url + verifyStr,
				method : method,
				pack: pack,
				data: dataObj,
				operation: operation
			});
			req.call();
			return req;
		}

		if(!this[pack]) {
			this[pack] = {}
		}
		this[pack][operation] = request;
		return request;
	}
	
	Y2.ServiceHelper = ServiceHelper;

	MessageBus.on("app:error", function(e){
		var code = e.errorCode;
		if(code === "ERR10401") {
			var errorMessage = e.message;
			var redirectUrl = e.redirectUrl;
			//alert(e.message + "," + e.url);
			(function(){
				//close all
				var topWin = window.top;
				if(!topWin.__xsense) {
					if(topWin.window.dialogArguments) {
						//topWin = topWin.window.opener;
						topWin = topWin.window.dialogArguments.hostWin;
						//alert('window modal dialog');
						window.close();
					} else if(topWin.window.opener) {
						topWin = topWin.window.opener;
						//alert('window.open dialog');
						window.close();
					}
					if(!topWin.__xsense) {
						return;
					}
				}
				if(topWin.__xsense) {
					var scene = topWin.__xsense;
					scene.fire("session:invalid", {message: errorMessage, redirectUrl: redirectUrl}, "desktop");
					scene.fire("session:invalid", {message: errorMessage, redirectUrl: redirectUrl}, "navigation");
					scene.closeAllDialogs();
				}
			})();
		}
	});
	
	
}, "0.0.1", {requires: ["yam-core", "io-base", "base", "json", "querystring-stringify"]});