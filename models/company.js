var mongoose = require('mongoose');

//page schema
var CompanySchema = mongoose.Schema({
	name:{
		type: String,
		require: true
	},
	logo:{
		type: String,
		
	},
	hotline:{
		type: String
	},
	address:{
		type: String,
		
	}
});

var Company = module.exports = mongoose.model('Company', CompanySchema);