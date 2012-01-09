
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
app.post('/', routes.index);

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

app.get('/timetable_view', function(req, res) {
	// console.log("Action is " + req.param('action'));
	var action = req.param('action');
	var from = req.param('from_airport');
	var to = req.param('to_airport');
	var page = req.param('page');
	
	if (!page)
		page = 0;
		
	console.log("Params: action=" +action+",from="+from+",to="+to+",page="+page);
	
	if (action == 'search') {
		data.timetable(function(flights,forDay,page,prev_url,next_url) {
			res.render('timetable_view', {subtitle: "Timetable for "+ from + " - " + to, 
				date: forDay, 
				flights: flights, 
				next_url: next_url,
				prev_url: prev_url,
				page: page});
		}, from, to, page);
	}
	
});

//Listen on the correct port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
