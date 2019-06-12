var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var Services = require('../models/service');
var Orders = require('../models/order');
var answers = require('../models/answer');
var session = require('../models/session');
var answerdetails = require('../models/answerdetail');
var feedbackdetails = require('../models/feedbackdetail');
var reason = require('../models/reasonend');
router.get('/', function (req, res) {
    console.log(req.session.employee);
    // console.log(res.locals.user.service_id);
    var user = req.session.employee;
        answers.find({}).sort({level: 0}).exec(function(req,result) {
            answerdetails.find({},function(req,data){
                res.render('feedbacks', {
                    title: "Đánh giá nhân viên",
                    user: user,
                    questions:data,
                    answers: result,
                    answerdetails:data
                });
               
           });  
           
        });
    
});
 

router.post('/', async function (req, res) {
   
    var id = req.body._id;
    var answer = req.body.answer;
    var comment_order = req.body.comment_order;;
    var feedbackdetail1 = [];
    
    feedbackdetail1 = req.body['answerdetails[]'];
    if(req.body._id){
        if(req.body.level!=3){
            session.findByIdAndUpdate({_id:id},{answer_id:answer},function(){
            });
        }
        else{
            session.findByIdAndUpdate({_id:id},{answer_id:answer,comment_order:comment_order},function(){
                
            });
            for(var i = 0;i<feedbackdetail1.length;i++){
                var feedbackdetail = new feedbackdetails({
                    answerdetail_id:feedbackdetail1[i],
                    session_id:id
                });
                feedbackdetail.save().then(saved => console.log("Them feedbackdetail", saved));
            }
        }
       
    }
    else{
        res.redirect('/feedbacks');
    }
});

    
// Exports
module.exports = router;
