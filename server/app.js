var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");
var index = require('./routes/index');
var users = require('./routes/users');
var http = require('http');
var https = require('https');
var Resovle = require('./other/Resovle');

var app = express();


// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: "a"})
// setup the logger
app.use(logger("combined", {stream: accessLogStream}))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(function(req, res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
    res.header("Access-Control-Max-Age", "1728000");
    var ip = req.connection.remoteAddress;
    console.log(ip);
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret',
//    cookie: {maxAge: 1000 * 60 * 60,expires:1000 * 60 * 5},
    rolling: true
}));

app.set('jsonp callback name', 'cb');

app.use('/',function(req, res,next){

    next();
});

app.use('/', index);
app.use('/api/users', users);
app.use('/qr/room',function(req,res){
    res.send(req.query);
});
app.use('/qr_go',function(req,res){
    res.redirect('/qr/room?p='+req.query.p+'&d='+req.query.d);
});

var httpGet = function(path){
    return new Promise(function (resolve, reject) {
        var body = '';
        var req = http.request(path, function(res) {
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
var httpsGet = function(path){
    return new Promise(function (resolve, reject) {
        var body = '';
        var req = https.request(path, function(res) {
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
var httpsGetImg = function(obj){
    return new Promise(function (resolve, reject) {
        var body = '';
        var req = https.request(obj, function(res) {
            resolve(res.headers.location)
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            reject(e);
        })
        req.end();
    });
}
app.use('/http',async function(req,res){
    var url = decodeURIComponent(req.query.url);
    var start = decodeURIComponent(req.query.start);
    var end = decodeURIComponent(req.query.end);
    var type = decodeURIComponent(req.query.type);

    console.log(url);
    console.log(start);
    console.log(end);
    var content = url.indexOf('https') === 0 ? await httpsGet(url) : await httpGet(url);
    // console.log(content);
    if(start && start != "undefined"){
        if(type == "list"){
            content = Resovle.Resovles(content,start,end);
            console.log('Resovles')
        }else{
            content = Resovle.Resovle(content,start,end);
            console.log('Resovle')
        }
    }
    res.send(content);
});
app.use('/img',async function(req,res){
    var url = decodeURIComponent(req.query.url);
    var ref = decodeURIComponent(req.query.ref);
    console.log(url);
    var option = {
        host:url.substr(8,url.indexOf('/',10)-8),
        port:'443',
        method:'GET',
        path:url.substr(url.indexOf('/',10)),
        headers:{
            Referer: ref
        }
    }
    console.log(option);
    var content = url.indexOf('https') === 0 ? await httpsGetImg(option) : await httpGet(url);
    res.redirect(content);
});

app.get('/stop',function(request,response){
    console.log('stop server');
    response.send('bye');
    closeServer();
});

app.get('/sockets',function(request,response){
    var arr = [];
    sockets.forEach(function(socket){
        arr.push({
            ip:socket.remoteAddress,
            connecting:socket.connecting,
            createTime:socket.createTime
        })
    })
    response.jsonp(arr)
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var server = app.listen(7070,"0.0.0.0", function() {
  console.log("listen at 7070");
});
server.timeout = 15000;
var sockets = [];
var a = 0;
server.on("connection",function(socket){
    socket.createTime = new Date();
  sockets.push(socket);
  socket.once("close",function(){
     sockets.splice(sockets.indexOf(socket),1);
  });
});
server.on("close",function(){
    
});
 
//关闭之前，我们需要手动清理连接池中得socket对象
function closeServer(){
     sockets.forEach(function(socket){
         socket.destroy();
     });
     server.close(function(){
         console.log("close server!");
     });
}

var readFile = function (file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, function (err, data) {
            if (err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};
var writeFile = function (file,data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(file,data, function (err) {
            if (err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
};

var mkdirs = function(dirpath, callback) {
    fs.exists(dirpath, function(exists) {
        if(exists) {
            callback(dirpath);
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(ph.dirname(dirpath), function(){
                fs.mkdir(dirpath, callback);
            });
        }
    });
};