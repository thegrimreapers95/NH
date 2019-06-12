var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');

var User = require('../models/user');
// Get Page model

router.get('/', function (req, res) {
    User.find({port: {$ne: 0}, access: 0}).sort({port: 1}).exec(function(req,user){
         res.render('dashboard', {
         user:user
    });
    })  
    
});

// Exports
module.exports = router;
