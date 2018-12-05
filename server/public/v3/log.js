window._uuid = localStorage.getItem('_hzlog_uuid');
window.addEventListener('error',function(message,url,line,col,error){
    if(typeof(message) == "object"){
        url = message.filename;
        line = message.lineno;
        col = message.colno;
        error = message.error;
        message = message.message;
    }
    
    hzlog.error(message,url,line,col,error);
    return false;
});

window.addEventListener('click',function(event){
    var path = [];
    if(event.path){
        event.path.forEach(function(el){
            if(el.tagName){
                var str = el.tagName;
                if(el.id){
                    str += '#' + el.id;
                }
                el.classList.forEach(function(className){
                    str += '.' + className;
                });
                path.push(str);
            }
        });
    }
    hzlog.active(event.type,path.reverse().join('>'),event.x,event.y);
});
window.addEventListener('beforeunload',function(){
    hzlog.active('unload');
    clearTimeout(window._hzlog_timer);
    window._hzlog_send();
});

// window.document.onclick = function(){
//     console.log(event)
// }
// function performance1(){
//     if(performance){
        
//     }

// }
var hzlog = {
    api_url:("https:" == document.location.protocol ? "https:" : "http:") + "//log.ttpark.cn/",
    projectId:window._hzlog_projectID,
    version:window._hzlog_version,
    group:null,
    reday:function(){
        hzlog.active('pv');
        if(window._hzlog_ready){
            window._hzlog_ready();
        }
    },
    loadIframe:function(){
        var message = function(event){
            if(event.origin.indexOf('log.ttpark.cn') > -1){
                window._uuid = event.data;
                localStorage.setItem('_hzlog_uuid',event.data);
                hzlog.reday();
            }
            window.removeEventListener('message',message);
        }
        window.addEventListener('message',message);
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.crossOrigin = "Anonymous";
        iframe.src = location.protocol + '//log.ttpark.cn/v3/uuid.htm';
        if(document.head.append){
            document.head.append(iframe);
        }else{
            document.body.appendChild(iframe);
        }
    },
    countup:function(eventId,callback,data) {
        if (eventId == undefined || eventId == null || eventId == "") {
            return;
        }
        var para = {
            eid:eventId
        };
        hzlog.send('add',para,callback,data)
    },
    active:function(type,element,pageX,pageY,callback,data){
        var para = {
            type:type,
            pageX:pageX,
            pageY:pageY,
            element:encode(element)
        };
        hzlog.send('active/add',para,callback,data)
    },
    error: function(message,url,line,col,error){
        var para = {
            message:encode(message || error),
            line:line,
            col:col,
            source:encode(url)
        };
        hzlog.send('error/add',para);
    },
    api: function(time){
        var para = {
            status:time.status,
            uploadTime:time.uploadTime,
            waitTime:time.waitTime,
            loadTime:time.loadTime,
            apiurl:encode(time.url),
            method:time.method
        };
        hzlog.send('api/add',para);
    },
    send:function(method,para,callback,data){
        var nowTime = new Date().getTime();
        var src = hzlog.api_url + method;
        
        para.t = nowTime;
        para.pid = hzlog.projectId;
        para.uuid = window._uuid;
        para.atype = 1;
        if(window.performance)
            para.atime = parseInt(performance.now());
        para.sw=window.screen.width;
        para.sh=window.screen.height;
        para.ww=document.documentElement.clientWidth;
        para.wh=document.documentElement.clientHeight;
        if(hzlog.version){
            para.v=hzlog.version;
            
        }
        //src += "&url=" + encode(location.href);
        if(document.referrer){
            para.ref=encode(document.referrer);	
        }
        if(data){
            if(typeof(data) == 'object'){
                data = JSON.stringify(data);
            }
            para.data=encode(data);	
        }
        for(var key in para){
            var value = para[key];
            if(value !== undefined && value !== null){
                src += '&' + key + '=' + para[key];
            }
        }
        if(hzlog.group){
            hzlog.group.push({
                method:method,
                para:para
            });
        }else{
            hzlog.group = new Array();
            hzlog.group.push({
                method:method,
                para:para
            });
            window._hzlog_send = function(){
                var para = "list=" + encodeURIComponent(JSON.stringify(hzlog.group));
                hzlog.group = null;
                ajaxFunction(hzlog.api_url + 'group','POST',para,function(res){
                    if(typeof(res) == "string"){
                        try{
                            res = JSON.parse(res);
                        }catch(e){}
                    }
                    callback && callback(res);
                });
            }
            window._hzlog_timer = setTimeout(window._hzlog_send,400);
        }
        // ajaxFunction(src,'GET','',function(res){
        //     if(typeof(res) == "string"){
        //         try{
        //             res = JSON.parse(res);
        //         }catch(e){}
        //     }
        //     callback && callback(res);
        // });
    },
    getdata:function(logId,callback) {
        if (logId == undefined || logId == null || logId == "") {
            return;
        }
        var nowTime = new Date().getTime();
        var src = hzlog.api_url + "get?t=" + nowTime + "&lid=" + logId;
        
        ajaxFunction(src,'GET','',callback);
    }
}


function ajaxFunction( url,type,data,func,async){
    var xmlHttp;
    try{
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
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
    // xmlHttp.setRequestHeader("Content-Type","application/json");
    xmlHttp.send(data);
}

String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}
function encode(str) {
    return str;
    if(!str){
        return;
    }
    return encodeURIComponent(str).replaceAll("'", "%27");
}
function decode(str) {
    return decodeURIComponent(str.replaceAll("\\+", " "));
}

window._log_countup = hzlog.countup;
window._log_getdata = hzlog.getdata;
hzlog.loadIframe();
