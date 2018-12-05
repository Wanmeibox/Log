var base = require('./base');

module.exports = {
    get : async function(id){
        var sql = 'select * from log.log_error where id=@ID;';
        var result = await base.execSqlByParam(sql,{ID:id});
        console.log(result);
        if(result.length > 0){
            return result[0];
        }else{
            return false;
        }
    },
    add : async function(log){
        var sql = 'insert into log.log_error(projectID,uuid,version,line,col,source,message,ip,screenWidth,screenHeight,windowWidth,windowHeight,userAgent,url,referer,awayTime,awayType,address,province,city,latitude,longitude,serverTime,clientTime,data)values(@projectID,@uuid,@version,@line,@col,@source,@message,@ip,@screenWidth,@screenHeight,@windowWidth,@windowHeight,@userAgent,@url,@referer,@awayTime,@awayType,@address,@province,@city,@latitude,@longitude,default,@clientTime,@data);';
        var result = await base.execSqlByParam(sql,log);
        console.log(result);
        if(result.affectedRows){
            return result;
        }else{
            return {};
        }
    }
}