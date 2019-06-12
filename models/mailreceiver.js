var mongoose = require('mongoose');

//page schema
var MailreceiverSchema = mongoose.Schema({
	chucvu:{
		type: String,
		require: true
	},
	email:{
		type: String,
		require: true
	}
});

var Mailreceiver = module.exports = mongoose.model('Mailreceiver', MailreceiverSchema);