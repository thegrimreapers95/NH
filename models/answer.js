var mongoose = require('mongoose');

//page schema
var AnswerSchema = mongoose.Schema({
	content:{
		type: String,
		require: true
	},
	level:{
		type: Number,
		require: true
	}
});

var Answer = module.exports = mongoose.model('Answer', AnswerSchema);