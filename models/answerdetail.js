var mongoose = require('mongoose');

//page schema
var AnswerdetailSchema = mongoose.Schema({
	answer_id:{
		type: mongoose.Schema.ObjectId,
		require: true
	},
	content:{
		type: String,
		require: true
	}
});

var Answerdetail = module.exports = mongoose.model('Answerdetail', AnswerdetailSchema);