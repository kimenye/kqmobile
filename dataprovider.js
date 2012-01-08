var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
// mongoose.connect('mongodb://localhost/kqm');
var url = process.env.MONGOHQ_URL || 'mongodb://localhost/kqm';
console.log(url)
mongoose.connect(url);

var AirportSchema = new Schema({
    code  :  { type: String }
  , name   :  { type: String }
});

/**
 * Define model
 */
var Airport = mongoose.model('Airport', AirportSchema);

DataProvider=function() {};
// DataProvider.prototype.data = [];

// DataProvider.prototype.findAll = function(callback) {
// 	callback( null, this.data )
// };

DataProvider.prototype.findAllAirports = function(callback) {
	Airport.find({}, function(error, docs) {
		if (error) callback(error)
		else {
			console.log("Number of results is " + docs.length);
			callback(null, docs);
		}
	});
};

DataProvider.prototype.findAll

exports.DataProvider = DataProvider;