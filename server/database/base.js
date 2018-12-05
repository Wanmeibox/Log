var mysql = require("mysql");
var pool  = mysql.createPool({
    connectionLimit: 10,
  host     : 'log.ttpark.cn',
  port     : 3306,
  user     : 'root',
  password : 'Egova2018',
  database : 'log',
    multipleStatements:true
});

var getConnection = function () {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err){
                console.log(err)
                reject(err);
            }else{
                resolve(connection);
            }
        });
    });
};
var execSqlPromise = function (conn,sql) {
    return new Promise(function (resolve, reject) {
        conn.query(sql, function(err, results, fields) {
            conn.release();
            if (err){
                console.error(err)
                reject(err);
            }else{
//                console.log(results)
                resolve(results);
            }
        });
    });
};

module.exports = {
//    execSql:function(sql,callback){
//        var conn = getConnection();
//        pool.getConnection(function(err, connection) {
//            connection.query(sql, function (error, results, fields) {
//                connection.release();
//                if (error) throw error;
//                callback(results,fields);
//            });
//        });
//    },
    execSql:async function(sql){
        var conn = await getConnection();
        console.info(sql)
        return await execSqlPromise(conn,sql);
    },
    execSqlByParam:async function(sql,object,callback){
        for(var key in object){
            sql = sql.replace(new RegExp('@'+key,'gim'),mysql.escape(object[key]));
        }
        return await this.execSql(sql);
    },
    sqlParse:function(sql,object){
        for(var key in object){
            sql = sql.replace(new RegExp('@'+key,'gim'),mysql.escape(object[key]));
        }
        return sql;
    }
    
}