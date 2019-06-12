var mongoose = require('mongoose');

//page schema
var QuestionSchema = mongoose.Schema({
	question:{
		type: String,
		require: true
	},
	service_id:{
		type: mongoose.Schema.ObjectId,
		require: true
	}
});

var Question = module.exports = mongoose.model('Question', QuestionSchema);