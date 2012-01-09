var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
// mongoose.connect('mongodb://localhost/kqm');
var url = process.env.MONGOHQ_URL || 'mongodb://localhost/kqm';
// console.log(url)
mongoose.connect(url);
var moment = require('moment');

var AirportSchema = new Schema({
    code  :  { type: String }
  , name   :  { type: String }
});

//{source: 'NBO', destination: 'MBA', code: 'KQ 604', dep: '09:30', arr: '10:30', equipment: 'Boeing 737-300', days: 'A'}
var FlightSchema = new Schema({
	source : {type: String},
	destination : {type: String},
	code: {type: String},
	dep: {type: String},
	arr: {type: String},
	equipment: {type: String},
	days: {type: String},
	duration: {type: String}
})

/**
 * Define model
 */
var Airport = mongoose.model('Airport', AirportSchema);
var Flight = mongoose.model('Flight', FlightSchema);


DataProvider=function() {};
// DataProvider.prototype.data = [];

// DataProvider.prototype.findAll = function(callback) {
// 	callback( null, this.data )
// };

/**
 * Create a paged timetable
 */
DataProvider.prototype.timetable = function(callback,from,to,dep,arr,page) {
	// console.log("From : " + from);
	var forDay = moment();
	var day = page || 0;
	forDay = forDay.add('days',day);
	
	var dayStr = forDay.format('dddd, MMMM Do YYYY');
	var dayIdx = forDay.format('ddd');
	
	console.log("Requested page " + dayStr + " Day: " + dayIdx);
	Flight.find({ source: from, destination: to }, function(error, docs) {
		if(error) callback (error)
		else {
			console.log("Number of flights is " + docs.length);
			callback(docs, dayStr,day);
		}
	});
};

/**
 * Find all the airports and return
 */
DataProvider.prototype.findAllAirports = function(callback) {
	Airport.find({}, function(error, docs) {
		if (error) callback(error)
		else {
			// console.log("Number of results is " + docs.length);
			callback(null, docs);
		}
	});
};

DataProvider.prototype.findAll

exports.DataProvider = DataProvider;