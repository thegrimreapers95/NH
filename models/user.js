var mongoose = require('mongoose');

//page schema
var UserSchema = mongoose.Schema({
	username:{
		type: String,
		require: true
	},
	password:{
		type: String,
		require: true
	},
	name: {
		type: String,
		require: true
	},
	email: {
		type: String
	},
	service_id: {
		type: mongoose.Schema.ObjectId,
		require: true
	},
	status: {
		type: Number
	},
	port:{
		type:Number
	},
	access:{
		type:Number
	},
	area_id:{
		type: mongoose.Schema.ObjectId
	},	
	code: {
		type: String
	},
	today_finished_count:{
		type:Number
	}
});

var User = module.exports = mongoose.model('User', UserSchema);