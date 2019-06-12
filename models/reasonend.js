var mongoose = require('mongoose');

//page schema
var ReasonendSchema = mongoose.Schema({
	content:{
		type: String,
		require: true
	},
	allow_edit:{
		type: String
	}
});

var Reasonend = module.exports = mongoose.model('Reasonend', ReasonendSchema);