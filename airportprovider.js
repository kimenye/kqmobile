var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
// mongoose.connect('mongodb://localhost/kqm');
var connection = process.env.MONGOHQ_URL | 'mongodb://localhost/kqm';
mongoose.connect(connection);

var AirportSchema = new Schema({
    code  :  { type: String }
  , name   :  { type: String }
});

/**
 * Define model
 */
var Airport = mongoose.model('Airport', AirportSchema);

AirportProvider=function() {};
AirportProvider.prototype.data = [];

AirportProvider.prototype.findAll = function(callback) {
	callback( null, this.data )
};

AirportProvider.prototype.findAll = function(callback) {
	Airport.find({}, function(error, docs) {
		if (error) callback(error)
		else {
			console.log("Number of results is " + docs.length);
			callback(null, docs);
		}
	});
};

exports.AirportProvider = AirportProvider;