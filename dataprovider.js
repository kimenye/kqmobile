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
	airline: {type: String},
	source : {type: String},
	destination : {type: String},
	code: {type: String},
	dep: {type: String},
	arr: {type: String},
	equipment: {type: String},
	days: {type: String},
	duration: {type: String},
	price: {type: String}
});

//{ town: 'Nairobi', name: 'Barclays Plaza', geo: 'Barclays Plaza, Loita Street, Nairobi', country: 'Kenya', type: 'KQ', services: 'Sales,Ticketting' }
var LocationSchema = new Schema({
	airline: {type: String},
	town : {type: String},
	name : {type: String},
	geo : {type: String},
	lat: {type: Number},
	lon: {type: Number},
	country  : {type: String},
	type : {type: String},
	services : {type: String},
	tel1 : {type: String},
	tel2type : {type: String},
	tel2 : {type: String},
	email: {type: String}
});

// { airline: 'fly540', heading: 'Special offer to US$60 Mombasa', detail: 'Fly540 special offer US$60 to Mombasa, book in the next month to qualify'}
var OfferSchema = new Schema({
	airline: {type: String},
	heading: {type: String},
	detail: {type: String}
});

/**
 * Define model
 */
var Airport = mongoose.model('Airport', AirportSchema);
var Flight = mongoose.model('Flight', FlightSchema);
var Location = mongoose.model('Location', LocationSchema);
var Offer = mongoose.model('Offer', OfferSchema);


DataProvider=function() {};
// DataProvider.prototype.data = [];

DataProvider.prototype.findOffersByAirline = function(callback, airline) {
	Offer.find({ airline: airline }, function(error, offers) {
		if (error) callback(error)
		else {
			callback(offers);
		}
	});
};

DataProvider.prototype.findLocationByName = function(callback, name) {
	console.log("Finding location with name " + name);
	Location.findOne({ name: name}, function(error, location) {
		if (error) callback(error)
		else {
			callback(location)
		}
	});
};

DataProvider.prototype.findLocationsByTypeAndAirline = function(callback, type, airline) {
	Location.find({ type: type, airline: airline}, function(error, locs) {
		if (error) callback(error)
		else
			callback(locs);
	});
};

//find locations
DataProvider.prototype.findLocations = function(callback, airline) {
	Location.find({airline: airline}, function(error, locs) {
		if(error) callback(error)
		else {
			// console.log(locs.length);
			callback(locs);
		}
	});
};

DataProvider.prototype.findFlight = function(callback,flight_code) {
	Flight.findOne({ code: flight_code}, function(error, flight) {
		if(error) callback(error)
		else {
			callback(flight);
		}
	});
};

/**
 * Create a paged timetable
 */
DataProvider.prototype.timetable = function(callback,from,to,page,base_url,airline) {
	page = parseInt(page);
	var now = moment().add('days', page);
	
	var dayStr = now.format('dddd, MMMM Do YYYY');
	var dayIdx = now.format('ddd');
	
	var next_url = "#";
	var prev_url = "#";
	var url = base_url + "?action=search&from_airport="+from+"&to_airport="+to+"&page=";
	
	var nextPageIdx = (page + 1) < 6 ? (page + 1): 6;
	var prevPageIdx = (page - 1) >=0 ? (page - 1): 0;
	next_url = url + nextPageIdx;
	prev_url = url + prevPageIdx;

	// console.log("Next page: " + next_url);
	// console.log("Prev page: " + prev_url);
	
	var regExp = new RegExp(dayIdx,"g");
	
	var query = Flight.find({});
	query.where('source', from);
	query.where('airline', airline);
	query.where('destination', to);
	query.where('days', regExp);
	query.exec(function(error,docs) {
		if(error) callback (error)
		else {
			console.log("Number of flights is " + docs.length);
			callback(docs, dayStr, page, prev_url, next_url);
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

/**
 * Find all the locations and return
 */
DataProvider.prototype.findAllLocations = function(callback) {
    Location.find({}, function(error, docs) {
        if (error) callback(error)
        else {
            callback(null, docs);
        }
    });
};

DataProvider.prototype.findAll

exports.DataProvider = DataProvider;