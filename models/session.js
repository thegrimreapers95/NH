var mongoose = require('mongoose');

//page schema
var SessionSchema = mongoose.Schema({
	service_id:{
		type: mongoose.Schema.ObjectId,
		require: true
	},
	area_id:{
		type: mongoose.Schema.ObjectId,
		require: true
	},
	order_id:{
		type: Number,
		require: true
	},
	username:{
		type: String,
		require: true
	},
	order_time: {
		type: Date
	},
	time_start:{
		type: Date
	},
	time_end:{
		type: Date
	},
	comment_user:{	
		type: String
	},
	answer_id:{
		type: mongoose.Schema.ObjectId
	},
	comment_order:{
		type: String
	},
	so_luong_lenh:{
		type: Number
	},
	end_reason_id:{
		type: mongoose.Schema.ObjectId
	}

});

var Session = module.exports = mongoose.model('Session', SessionSchema);