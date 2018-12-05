var error = {
    0:'',
    1:'会话不存在或已过期',
    100:'用户名或密码错误',
    101:'用户名错误',
    102:'密码错误',
    103:'登录次数过多',
    200:'请求参数有误',
    201:'数据不存在或已删除',
}
module.exports = {
    success:function(data,code){
        return {success:true,data:data,code:code}
    },
    error:function(code,message){
        return {success:false,message:message || error[code],code:code}
    },
    getUser:function(req){
        var token = req.body.token || req.query.token;
        var session = global.sessionMap.get(token);
        if(session && session.user){
            return session.user;
        }
        return null;
    }
}