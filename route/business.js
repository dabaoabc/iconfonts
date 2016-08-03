'use strict';
/*
 * @author helondeng,junmo
 * 从数据库获取项目名称，添加项目，对应upload.html页面
 */
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    Business = require('../models/business.js'),
    userAuthCheck = require('../utils/checkAuth.js'),
    conf = require('../conf.js'),
    auth = require('../midware/auth.js'),
    jsonParser = bodyParser.json(),
    addUserToMongo = require('../midware/addUserToMongo.js');


// 获取全部项目名称
router.get('/', addUserToMongo, function(req, res, next) {
    // check auth
    var user = req.user;
    Business.find()
        .exec(function(err, business) {
            if (err) {
                next(err);
                return;
            }
            res.render('business', {
                user: user,
                business: business
            });
        });
});

// 添加项目
router.post('/add', addUserToMongo, function(req, res, next) {
    var params = req.body;
    userAuthCheck(req.cookies.user, conf.auth.business, function(hasAuth) {
        if (hasAuth) {
            var business = new Business({
                name: params.business,
                pm: params.pm
            });
            business.save(function(err, b) {
                if (err) {
                    res.status(200).send({
                        retcode: 500
                    });
                    next(err);
                    return;
                }
                res.status(200).send({
                    retcode: 0,
                    result: b
                });
            });
        } else {
            res.status(200).send({
                retcode: 100000
            });
        }

    });
});

module.exports = router;