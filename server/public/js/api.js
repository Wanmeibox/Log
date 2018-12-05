//缓存设置   s秒 m分 h时 d天 w周 M月 y年。规则：正整数+字母缩写
var cache_time_general = '10m';
var cache_time_general_long = '2h';
var cache_time_general_short = '2s';
var cache_time_radio = '1d';
var cache_time_album = '1d';

var api_url = 'http://pwapp.org:7070/';
//var api_url = '/';
//var api_url = 'http://127.0.0.1:8088/';

function api_ajax(action, para, success, error) {
    $.ajax({
        type : para.type || 'GET',
        url : api_url + action,
        dataType : 'json',
        contentType : para.contentType,
        async : para.async,
        data : para.data,
        cache : false,
        processData : para.processData,
        beforeSend : function(xhr) {
            if (para.progress) {
                var xhr = this.xhr();
                if (xhr instanceof window.XMLHttpRequest) {
                    xhr.upload.addEventListener('progress', para.progress,
                            false);
                    this.xhr = function() {
                        return xhr;
                    }
                }
            }
        },
        success : function(res) {
            if (success)
                success(res);
        },
        error : function(res) {
            if (error) {
                error(res);
            }
        }
    });
}

function ajax_general(action, para, success, error) {
    if (para.cache) {
        var data = _GET_DATA(action + JSON.stringify(para.data));
        if (data) {
            console.log(data, 'from cache');
            success(data);
            return;
        }
    }
    if(para.spinner){
        showLoadding();
    }
    if (para.async == undefined) {
        para.async = true;
    }
    if(typeof(FormData) == "function" && para.data instanceof FormData){
        para.contentType = false;
        para.processData = false;
        para.type = 'POST';
    }else{
        para.contentType = para.contentType || 'application/x-www-form-urlencoded';
    }
    
    api_ajax(action,para,function(res) {
        if(para.spinner){
            hideLoadding();
        }
        if (para.cache) {
            _SET_DATA(action + JSON.stringify(para.data), res,para.cache);
        }
        console.log(res);
        success && success(res);
    }, function(res){
        error && error(res);
    });
}

function getGeneralData() {
    var session = Storage.get('session') || {};
    return {
        token:session.token
    }
}

[
    //用户接口
    'user/login',                       
    'user/logout',                       
    'user/changePassword',                       
    
    //mission
    'api/mission/getMission',
    'api/mission/getMissions',
    'api/mission/getMyMissions',
    'api/mission/getMissionLog',
    'api/mission/changeMissionLogState',
    'api/mission/addSrceenShots',
    
    //group,member
    'api/group/getLeaderGroups',
    'api/group/getGroupMembers',
    
    //微信相关
    'api/wechat/signature'                        
].forEach(function(item){
    window[("api_"+item).replaceAll('/','_').replace('api_api_','api_')] = function(para, success, error){
        var url = item;
        
        var data = getGeneralData();
        if(typeof(para) == 'function'){
            error = success;
            success = para;
        }else if(typeof(FormData) == "function" && para instanceof FormData){
            data = para;
        }else{
            $.extend(data,para);
            delete data._type;
            delete data._contentType;
        }
        
        ajax_general(url, {
            data : data,
            cache : false,
            type : para._type,
            contentType : para._contentType,
            spinner: para._spinner === undefined ? true : para._spinner
        }, function(res) {
            if(res.success){
                if (success) {
                    success(res.data);
                }
            }else{
                if(res.code == -1){
                    if(!window._disabled){
                        window._disabled = true;
                        Box.alert(res.message,null,{
                            ok:function(){
                                delete window._disabled;
                                parent.location = '/mobile/login.html';
                            }
                        });
                    }
                }
                error && error(res);
            }
            
        }, error);
    }
});

function getSignature(){
    api_wechat_signature({url:location.href},function(data){
        var d = data;
        wx.config({
            debug: false,
            appId: d.appId,
            timestamp: d.timestamp,
            nonceStr: d.nonceStr,
            signature: d.signature,
            jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ",
                "onMenuShareWeibo",
                "onMenuShareQZone",
                "startRecord",
                "stopRecord",
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "uploadVoice",
                "downloadVoice",
                "chooseImage",
                "previewImage",
                "uploadImage",
                "downloadImage",
                "translateVoice",
                "getNetworkType",
                "openLocation",
                "getLocation",
                "hideOptionMenu",
                "showOptionMenu",
                "hideMenuItems",
                "showMenuItems",
                "hideAllNonBaseMenuItem",
                "showAllNonBaseMenuItem",
                "closeWindow",
                "scanQRCode",
                "chooseWXPay",
                "openProductSpecificView",
                "addCard",
                "chooseCard",
                "openCard"
            ]
        });

        wx.ready(function () {
        });

        wx.error(function (res) {
            showMessage(res.errMsg);
        });

        window.close = function(){
        wx.closeWindow();
        }
    },function(res){
        mui.toast(res.message);
        this._pending_login.ok();
        return false;
    });
}


