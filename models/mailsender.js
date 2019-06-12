var mongoose = require('mongoose');

//page schema
var MailsenderSchema = mongoose.Schema({
	email:{
		type: String,
		require: true
	},
	password:{
		type: String,
		require: true
	}
});

var Mailsender = module.exports = mongoose.model('Mailsender', MailsenderSchema);