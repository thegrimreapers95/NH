var mongoose = require('mongoose');

//page schema
var FeedbackdetailSchema = mongoose.Schema({
	
	answerdetail_id:{
		type: mongoose.Schema.ObjectId,
		require: true
	},
	session_id:{
		type: mongoose.Schema.ObjectId,
		require: true
	},
	
});

var Feedbackdetail = module.exports = mongoose.model('Feedbackdetail', FeedbackdetailSchema);