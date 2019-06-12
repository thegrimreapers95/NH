var mongoose = require('mongoose');

//page schema
var AreaSchema = mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	today_order_count: {
		type: Number,
		require: true
	}
	
});

var Area = module.exports = mongoose.model('Area', AreaSchema);