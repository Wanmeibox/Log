var base = require('./base');

module.exports = {
    get : async function(id){
        var sql = 'select * from log.log where id=@ID;';
        var result = await base.execSqlByParam(sql,{ID:id});
        console.log(result);
        if(result.length > 0){
            return result[0];
        }else{
            return false;
        }
    },
    add : async function(log){
        var sql = 'insert into log.log(eventID,uuid,version,ip,screenWidth,screenHeight,windowWidth,windowHeight,userAgent,url,referer,awayTime,awayType,address,province,city,latitude,longitude,serverTime,clientTime,data)values(@eventID,@uuid,@version,@ip,@screenWidth,@screenHeight,@windowWidth,@windowHeight,@userAgent,@url,@referer,@awayTime,@awayType,@address,@province,@city,@latitude,@longitude,default,@clientTime,@data);SELECT count from log.event where id=@eventID;';
        var result = await base.execSqlByParam(sql,log);
        console.log(result);
        if(result.length > 0){
            return result;
        }else{
            return [];
        }
    }
}