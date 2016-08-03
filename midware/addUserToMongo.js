/*
 * @author junmo
 # 判断用户是否为登录状态，如果未登录，跳转到登录页面
 * 用户登录之后，将用户名，id，头像更新并存进数据库
 */

var User = require('../model/user.js');

function addUserToMongo(req, res, next){
	var user = req.user;
	if (!user) {
		return res.redirect('http://iconfont.imweb.io/user/auth/qq');
	}


	User.find({
		id: req.user.id
	}).exec(function(err, user){
		// console.log(user);
		if (err) {
			return console.log("find user出错")
		}
		var newuser = {
			user: req.user.nickname,
			id: req.user.id,
			img: req.user._json.figureurl_qq_1
		};

		User.update({
			id: req.user.id
		},{
			$set: newuser
		}).exec(function(err){
			if (err) {
				return console.log(err)
			}
		})

		next();
	})
}

module.exports = addUserToMongo;