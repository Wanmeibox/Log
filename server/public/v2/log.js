var _ilog_api_url = ("https:" == document.location.protocol ? "https:" : "http:") + "//log.ttpark.cn/Log.aspx?m=";
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
function _ilog_countup(eventId,cellback,data) {
	if (eventId == undefined || eventId == null || eventId == "") {
		return;
	}
	var nowTime = new Date().getTime();
    var src = _ilog_api_url + "CountUp2&t=" + nowTime + "&eid=" + eventId;
	
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
		if(typeof(data) == 'object'){
			data = JSON.stringify(data);
		}
		src += "&data=" + encode(data);	
	}
	
	ajaxFunction(src,'GET','',function(res){
		if(typeof(res) == "string"){
			try{
				res = JSON.parse(res);
			}catch(e){}
		}
		cellback && cellback(res);
	});
}
// AJAX方法, 被自定义封装在该函数中
function ajaxFunction( url,type,data,func,async)
{
    var xmlHttp;
    try{
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();    // 实例化对象
    }
    catch( e ){
        // Internet Explorer
        try{
            xmlHttp = new ActiveXObject( "Msxml2.XMLHTTP" );
        }
        catch ( e ){
            try{
                xmlHttp = new ActiveXObject( "Microsoft.XMLHTTP" );
            }
            catch( e ){
                alert("您的浏览器不支持AJAX！");
                return false;
            }
        }
    }
    xmlHttp.onreadystatechange = function(){
        if( xmlHttp.readyState == 4  && xmlHttp.status == 200 ){
            func && func(xmlHttp.responseText);
        }
    }
    xmlHttp.open(type, url, async == undefined ? true : async );
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlHttp.send(data);
}
function _ilog_getdata(logId,cellback) {
	if (logId == undefined || logId == null || logId == "") {
		return;
	}
	var nowTime = new Date().getTime();
    var src = _ilog_api_url + "GetLogAttachData&t=" + nowTime + "&lid=" + logId;
	
	ajaxFunction(src,'GET','',cellback);
}
