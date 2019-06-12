var express = require('express');
var router = express.Router();
var Session = require('../models/session');
var Order = require('../models/order');
var User = require('../models/user');
var moment =  require('moment');
// Get Page model


router.post('/start', function (req, res) {
   
    User.findOne({username: req.body.username},function(err,req){
        if (err) {  
            console.log(err);
        } 
        else{
            req.status = 0;
            req.save(function(err){
                if (err) {  
                    console.log(err);
                } 
            })
          
        }
    });

   
});

router.post('/end', function (req, res) {
    var order_id =  req.body.order_id;
    Order.deleteOne({ stt: order_id }, function (err) {
        if (err) {  
            console.log('loi');
        } 
    });
    var solenh = Number(req.body.so_luong_lenh);
    if(solenh == 0) solenh = 1;
    var id = req.body.reason;
    
    Session.findOneAndUpdate({_id:(req.body._id)}, {time_end:  moment().format(),comment_user:req.body.comment_user ,so_luong_lenh: solenh, end_reason_id: id },function(err,req){
        //console.log('session update');
        if (err) {  
            console.log(err);
        } 
    });
    User.findOne({username: req.body.username},function(err,req){
        if (err) {  
            console.log(err);
        } 
        else{
            req.status = 1;
            req.today_finished_count =  req.today_finished_count+ solenh;
            req.save(function(err){
                if (err) {  
                    console.log(err);
                } 
            })
          
        }
    });

 });

 router.post('/next', function (req, res) {
   
    User.findOneAndUpdate({username: req.body.username}, {status: 0},function(err,req){
        if (err) {  
            console.log(err);
        } 
    });
    Order.deleteOne({ stt: req.body.order_id }, function (err) {
        if (err) {  
            console.log('loi');
        } 
    
    });

 });

 
module.exports = router;
