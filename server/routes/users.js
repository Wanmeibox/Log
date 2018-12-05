var express = require('express');
var router = express.Router();
var users = require('./../database/users');
var model = require('./model');


router.get('/set',async function(req, res, next) {
    var user = req.query;
    var login = await users.login(user);
    if(login){
        res.send(model.success(login))
    }else{
        res.send(model.error(100))
    }
});

module.exports = router;
