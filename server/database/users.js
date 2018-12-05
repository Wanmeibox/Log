var base = require('./base');

var users = {}
users.login = async function(user){
    var sql = 'select * from User where UserName = @UserName and Password = @Password;update user set lastlogintime = current_timestamp() where UserName = @UserName;';
    var result = await base.execSqlByParam(sql,user);
    if(result.length > 0 && result[0].length > 0){
        return result[0][0];
    }else{
        return false;
    }
}
users.getUser = async function(id){
    var sql = 'select * from User where id = @id;';
    var result = await base.execSqlByParam(sql,{id:id});
    if(result.length > 0){
        return result[0];
    }else{
        return false;
    }
}
module.exports = users;