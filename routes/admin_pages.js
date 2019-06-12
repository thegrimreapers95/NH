var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var Order = require('../models/order');
var User = require('../models/user');
var auth = require('../config/auth');
var reason = require('../models/reasonend');
var isAdmin = auth.isAdmin;

// Get Page model

router.get('/', isAdmin, function (req, res) {
    reason.find({},function(req,data){
    
        res.render('user', {
            reason_end:data
        });
   });  
});

/*
 * GET login
 */
router.get('/login', function (req, res) {

    if(res.locals.user){
        res.redirect('/');
    }
    else{
        res.render('user/login', {
            title: 'Log in'
        });
    }
    

});

//GET lock
router.get('/lock', function (req, res) {
    res.render('user/lock', {
        title: 'Lock'
    });

});
router.post('/lock', function (req, res) {
    User.findOne({code: req.body.code}, function (err, user) {
        console.log(user);
        req.session.employee = user;
        res.redirect('/feedbacks');
    });
});


/*
 * POST login
 */
router.post('/login', function (req, res, next) {
    var name = req.body.username;
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
    User.findOne({username: name},function(err,user){
        if(err){
            console.log(err);
        }
        if(user){
            if(bcrypt.compare(req.body.password, user.password)&& user.access == 0 ){
                user.status = 2;
                user.save().then(saved => {});
            }   
        }
       
    });
});
   
/*
 * GET logout
 */
router.get('/logout/:id', function (req, res) {
    var username = req.params.id;
    User.update({username: username},{status:3},function(err,data){
        if(err) console.log(err);
       
    });
    req.logout();
    
    req.flash('success', 'Bạn đã đăng suất khỏi hệ thống');
    res.redirect('/login');

});

// Exports
module.exports = router;


