var mongoose = require('mongoose');

//page schema
var OrderSchema = mongoose.Schema({
	service_id:{
		type: mongoose.Schema.ObjectId,
		require: true
	},
	stt:{
		type: Number,
		require: true
	},
	status:{
		type: Number,
		require: true
	},
	order_time: {
		type: Date,
	}, 
	area_id: {
		type: mongoose.Schema.ObjectId,
	}
});

var Order = module.exports = mongoose.model('Order', OrderSchema);