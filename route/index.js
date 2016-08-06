var express = require('express'),
    router = express.Router();
var User = require('../model/user.js'),
    Business = require('../model/business.js'),
    Icon = require('../model/icon.js');
var myupload = require('../route/upload'),
    // mybusiness = require('../route/business'),
    mymain = require('../route/main'),
    myuser = require('../route/user'),
    mytag = require('../route/tag'),
    myupdate = require('../route/updateIcon'),
    mydownload = require('../route/download'),
    mysearch = require('../route/search'),
    management = require('../route/management');
var passport = require('passport');   
var QQStrategy = require('passport-qq').Strategy; 
var addUserToMongo = require('../midware/addUserToMongo.js');

var conf = require('../conf.js');
// var User = require('../models/user.js');

router.use('/', mymain);
router.use('/upload', myupload);
router.use('/download', mydownload);
router.use('/search', mysearch);
router.use('/management', management);
router.use('/tag', mytag);
router.use('/user', myuser);
router.use('/myindex', mymain);
router.use('/update', myupdate);
router.use(passport.initialize());
router.use(passport.session());


router.get('/business',function(req, res) {
    res.render('404', {
        user: req.user
    });
});
router.use('/checkin', function(req, res){
    res.render('checkin', {
        user: req.user
     });
 });
router.get('/rule', function(req, res){
    res.render('rule',{
        user: req.user
    });
});
router.get('/intro', function(req, res){
    res.render('intro', {
        user: req.user
     });
 });

router.get('/404', function(req, res) {
    res.render('404', {
        user: req.user
    });
});

// console.log(QQStrategy);
// passport序列化
passport.serializeUser(function(user, done) {
  done(null, user);
});
// passport反序列化
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
// QQ接口登录设置
passport.use(new QQStrategy({
    clientID: conf.appId,
    clientSecret: conf.appKey,
    callbackURL: conf.origin + '/user/auth/qq/callback',
    state: 1
},function(accessToken, refreshToken, profile, done){
    // json格式详情见 http://wiki.connect.qq.com/get_user_info
    // profile = {
    //     id: openid,
    //     nickname: nickname,
    //     _json: json
    // }
    var newuser = {
      user: profile.nickname,
      id: profile.id,
      img: profile._json.figureurl_qq_1
    };
    User.find({
      id: newuser.id
    }).exec(function(err, user){
      if (user.length !== 0) {
          return done(err, profile);
      }
      User.create(newuser, function(err){
        if (err) next();
        return done(err, profile);
      });

    })
    
}));





router.get('/user/auth/qq',
  passport.authenticate('qq'),
  function(req, res){
// The request will be redirected to qq for authentication, so this
// function will not be called.
});

//   GET /auth/qq/callback
router.get('/user/auth/qq/callback', 
  passport.authenticate('qq', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login')
// }

module.exports = router;
