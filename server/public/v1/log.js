var _ilog_api_url = "http://log.ttpark.cn/Log.aspx?m=";
var _ilog_init_time = new Date().getTime();


String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}
function encode(str) {
    return encodeURIComponent(str).replaceAll("'", "%27");
}
function decode(str) {
    return decodeURIComponent(str.replaceAll("\\+", " "));
}

var _ilog_script;
function _ilog_countup(eventId, url,cellback,data) {
	if (eventId == undefined || eventId == null || eventId == "") {
		return;
	}
    _ilog_script = null;
    _ilog_script = document.createElement("script");
	var nowTime = new Date().getTime();
    var src = _ilog_api_url + "CountUp&t=" + nowTime + "&eid=" + eventId;
	
	if (cellback != undefined && cellback != null && cellback != "") {
        src += "&cb=" + cellback;
    }
	src += "&atype=1";
	src += "&atime=" + (nowTime - _ilog_init_time);
	src += "&sw="+window.screen.width;
	src += "&sh="+window.screen.height;
	src += "&ww="+document.documentElement.clientWidth;
	src += "&wh="+document.documentElement.clientHeight;
	//src += "&url=" + encode(location.href);
	if(document.referrer){
		src += "&ref=" + encode(document.referrer);	
	}
	if(data){
		src += "&data=" + encode(data);	
	}
	
    _ilog_script.type = "text/javascript";
    _ilog_script.src = src;
    document.getElementsByTagName("head")[0].appendChild(_ilog_script);
    setTimeout(_ilog_redirection, 500);
    function _ilog_redirection() {
		if (url != undefined && url != null && url != "") {
            location.href = url;
			return;
        }
		if ( typeof _ilog_script !== 'undefined'){
   			document.getElementsByTagName("head")[0].removeChild(_ilog_script);
    		_ilog_script = undefined;
		}
    }
}

function _ilog_getdata(logId,cellback) {
	if (logId == undefined || logId == null || logId == "") {
		return;
	}
    _ilog_script = null;
    _ilog_script = document.createElement("script");
	var nowTime = new Date().getTime();
    var src = _ilog_api_url + "GetLogAttachData&t=" + nowTime + "&lid=" + logId;
	
	if (cellback != undefined && cellback != null && cellback != "") {
        src += "&cb=" + cellback;
    }
	
    _ilog_script.type = "text/javascript";
    _ilog_script.src = src;
    document.getElementsByTagName("head")[0].appendChild(_ilog_script);
    setTimeout(_ilog_redirection, 500);
    function _ilog_redirection() {
		if ( typeof _ilog_script !== 'undefined'){
   			document.getElementsByTagName("head")[0].removeChild(_ilog_script);
    		_ilog_script = undefined;
		}
    }
}
