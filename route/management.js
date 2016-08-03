/*
 * @author junmo
 * 后台管理界面，展示所有用户以及给用户添加权限，对应management.html
 */

var express = require('express'),
    router = express.Router(),
    Icon = require('../model/icon.js'),
    User = require('../model/user.js');
    Business = require('../model/business.js'),
    conf = require('../conf.js');


var addUserToMongo = require('../midware/addUserToMongo.js');

router.get('/', function(req, res, next){

	if (!req.user) {
		return res.redirect('http://iconfont.imweb.io/intro');
	}
	if (req.user.id === conf.userID) {
		User.find({

		}).exec(function(err, users){
			if (err) {
				return console.log(err)
			}
			res.render('management', {
				user: req.user,
				all: users
			});
		})
	}else{
		res.render('404', {
	        user: req.user
	    });
	}	
})

router.post('/value', function(req, res, next){
	var value = req.body.value;
	var userID = req.body.userID
	User.update({
		id: userID
	},{
		$set: {
			auth: value
		}
	}).exec(function(err, users){
		if (err) {
			return console.log(err)
		}
		res.status(200).send({
	        retcode: 0
	    });
	})	
})

module.exports = router;