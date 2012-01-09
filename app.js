
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

var DataProvider = require('./dataprovider').DataProvider;
var data = new DataProvider();
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);


var locations = null;
data.findAllAirports(function(error, ports) {
	locations = ports;
});
// var ports;

app.get('/plan', function(req, res) {
	res.render('plan', {subtitle: 'Plan', airports: locations});
});

app.get('/timetable', function(req, res) {
	res.render('timetable', {subtitle: 'Timetable', airports: locations});
});

app.post('/timetable', function(req, res) {
	// console.log("Action is " + req.param('action'));
	var action = req.param('action');
	var from = req.param('from_airport');
	var to = req.param('to_airport');
	// var dep = req.param('dep_date');
	// var ret = req.param('rep_date');
	
	if (action == 'search') {
		data.timetable(function(flights,forDay) {
			res.render('timetable_view', {subtitle: "Timetable for "+ from + " - " + to, date: forDay, flights: flights, hdn_source: from});
		}, from, to);
	}
	
});

//Listen on the correct port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
