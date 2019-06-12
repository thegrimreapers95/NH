var mongoose = require('mongoose');

//page schema
var ServiceSchema = mongoose.Schema({
	name:{
		type: String,
		require: true
	}
	
});

var Service = module.exports = mongoose.model('Service', ServiceSchema);