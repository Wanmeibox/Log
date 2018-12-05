var express = require('express');
var router = express.Router();
var users = require('./../database/users');
var log = require('./../database/log');
var log_active = require('./../database/log_active');
var log_error = require('./../database/log_error');
var log_api = require('./../database/log_api');
var model = require('./model');
var weightList = require('./../other/weightList');
var http = require('http');
var ipList = new weightList(1000);

global.sessionMap = new Map();
global.sessionMap.set('hzl',{token:'hzl',user:{username:'hzl',groupid:1,id:1}})
var session_timeout = 1000 * 60 * 60 * 24 * 7;
function guidGenerator() {
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

router.get('/user/login',async function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var user = req.query;
    var login = await users.login(user);
    var timespan = new Date().getTime();
    
    if(login){
        var session = {
            token:guidGenerator(),
            user:login,
            loginTime:timespan,
            timeout:timespan + session_timeout
        }
        global.sessionMap.set(session.token,session);
        delete session.user.password;
        res.send(model.success(session))
    }else{
        res.send(model.error(100))
    }
});

/* GET home page. */
router.get('/Log.aspx',async function(req, res) {
    var method = req.query.m;
    var result = '';
    if(method == 'CountUp' || method == 'CountUp2'){
        result = await addLog(req);
    }
    if(method == 'GetLogAttachData'){
        result = await getLogData(req);
    }
    res.jsonp(result);
});

router.get('/add',async function(req, res) {
    var result = await addLog(req);
    res.jsonp(result);
});

router.get('/active/add',async function(req, res) {
    var result = await addLogActive(req);
    res.jsonp(result);
});

router.get('/error/add',async function(req, res) {
    var result = await addLogError(req);
    res.jsonp(result);
});

router.get('/api/add',async function(req, res) {
    var result = await addLogApi(req);
    res.jsonp(result);
});

router.get('/get',async function(req, res) {
    var result = await getLogData(req);
    res.jsonp(result);
});

router.post('/group',async function(req, res) {
    var group = JSON.parse(decodeURIComponent(req.body.list));
    var result = {success:true,result:[]};
    for(var i=0;i<group.length;i++){
        var item = group[i];
        switch(item.method){
            case 'active/add':
                result.result.push(await addLogActive(req,item.para));
                break;
            case 'error/add':
                result.result.push(await addLogError(req,item.para));
                break;
            case 'api/add':
                result.result.push(await addLogApi(req,item.para));
                break;
            case 'add':
                result.result.push(await addLog(req,item.para));
                break;
        }
    }
    res.jsonp(result);
});


router.get('/time',function(req, res) {
    var now = new Date();
    res.jsonp({
        timespan:now.getTime(),
        string:now.toString()
    });
});


router.get('/iplist',function(req, res) {
    var maxLength = req.query.max;
    if(maxLength && parseInt(maxLength) == maxLength){
        ipList.maxLength = maxLength;
    }
    res.jsonp({
        used:ipList.list.length,
        max:ipList.maxLength
    });
});

router.get('/address',async function(req, res) {
    res.jsonp(await getAddress(getClientIP(req)));
});

async function getPara(req,body){
    var query = body || req.query;
    var para = {
        eventID:query.eid,
        projectID:query.pid,
        uuid:query.uuid,
        version:query.v,
        type:query.type,
        element:query.element,
        pageX:query.pageX,
        pageY:query.pageY,
        referer:query.ref,
        clientTime:new Date(Number(query.t)),
        screenWidth:query.sw,
        screenHeight:query.sh,
        windowWidth:query.ww,
        windowHeight:query.wh,
        awayTime:query.atime,
        awayType:query.atype,
        data:query.data,
        userAgent:req.headers["user-agent"],
        url:req.headers['referer'],
        ip:getClientIP(req),
        line:query.line,
        col:query.col,
        source:query.source,
        message:query.message,
        apiUrl:query.apiurl,
        method:query.method,
        uploadTime:query.uploadTime,
        waitTime:query.waitTime,
        loadTime:query.loadTime,
        status:query.status
    }
    var address = await getAddress(para.ip);
    if(address){
        para.address = address.address;
        para.province = address.content.address_detail.province;
        para.city = address.content.address_detail.city;
        para.latitude = address.content.point.y;
        para.longitude = address.content.point.x;
    }
    return para;
}

async function addLog(req,body){
    var para = await getPara(req,body);
    var result = await log.add(para);
    if(result[0].affectedRows > 0){
        return {
            success:true,
            id:result[0].insertId,
            count:result[1][0].count
        }
    }else{
        return {success:false}
    }
}
async function getLogData(req){
    var id = req.query.lid;
    var result = await log.get(id);
    return {
        id:id,
        eventID:result.eventID,
        uuid:result.uuid,
        ip:result.ip,
        serverTime:result.serverTime,
        clientTime:result.clientTime,
        data:result.data
    }
}

async function addLogActive(req,body){
    var para = await getPara(req,body);
    var result = await log_active.add(para);
    if(result.affectedRows > 0){
        return {
            success:true,
            id:result.insertId
        }
    }else{
        return {success:false}
    }
}

async function addLogError(req,body){
    var para = await getPara(req,body);
    var result = await log_error.add(para);
    if(result.affectedRows > 0){
        return {
            success:true,
            id:result.insertId
        }
    }else{
        return {success:false}
    }
}

async function addLogApi(req,body){
    var para = await getPara(req,body);
    var result = await log_api.add(para);
    if(result.affectedRows > 0){
        return {
            success:true,
            id:result.insertId
        }
    }else{
        return {success:false}
    }
}

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
// function getClientIP(req) {
//     return req.ip || req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
//         req.connection.remoteAddress || // 判断 connection 的远程 IP
//         req.socket.remoteAddress || // 判断后端的 socket 的 IP
//         req.connection.socket.remoteAddress;
// };

var getClientIP = function(req) {
    var ipStr = req.headers['X-Real-IP'] || req.headers['x-forwarded-for'];
    if (ipStr) {
        var ipArray = ipStr.split(",");
        if (ipArray.length > 1) { //如果获取到的为ip数组
            for (var i = 0; i < ipArray.length; i++) {
                var ipNumArray = ipArray[i].split(".");
                var tmp = ipNumArray[0] + "." + ipNumArray[1];
                if (tmp == "192.168" || (ipNumArray[0] == "172" && ipNumArray[1] >= 16 && ipNumArray[1] <= 32) || tmp == "10.7") {
                    continue;
                }
                return ipArray[i];
            }
        }
        return ipArray[0];
    } else { //获取不到时
        return req.ip || req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
                req.connection.remoteAddress || // 判断 connection 的远程 IP
                req.socket.remoteAddress || // 判断后端的 socket 的 IP
                req.connection.socket.remoteAddress;
    }
};



async function getAddress(ip){
    if(!ip || ip == "127.0.0.1"){
        return null;
    }
    var result = ipList.get(ip);
    if(!result){
        result = await httpGet('api.map.baidu.com','/location/ip?ak=7tsrblMRFSPBY2R7cN6XOnif81gNo7Fw&coor=bd09ll&ip='+ip);
        result = JSON.parse(result);
        if(result.status == 0){
            ipList.set(ip,result);
        }
    }
    return result;
}

var httpGet = function(host,path){
    return new Promise(function (resolve, reject) {
        var opt = {
             host:host,
             port:'80',
             method:'GET',
             path:path,
             headers:{}
        }

        var body = '';
        var req = http.request(opt, function(res) {
            res.on('data',function(d){
                body += d;
            }).on('end', function(){
                resolve(body);
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            reject(e);
        })
        req.end();
    });
}
// function clone(obj) {
//     var o;
//     if (typeof obj == "object") {
//         if (obj === null) {
//             o = null;
//         } else {
//             if (obj instanceof Array) {
//                 o = [];
//                 for (var i = 0, len = obj.length; i < len; i++) {
//                     o.push(clone(obj[i]));
//                 }
//             } else {
//                 o = {};
//                 for (var j in obj) {
//                     o[j] = clone(obj[j]);
//                 }
//             }
//         }
//     } else {
//         o = obj;
//     }
//     return o;
// }
module.exports = router;
