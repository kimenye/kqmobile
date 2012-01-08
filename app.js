
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
	//console.log("Requested plan");
	//res.render('plan', { title: 'Kenya Airways' });
	// airports.findAll(function(error, ports) {
	// 		res.render('plan', {title: 'Kenya Airways', airports: locations});
	// 	})
	res.render('plan', {title: 'Kenya Airways', airports: locations});
});

app.get('/timetable', function(req, res) {
	res.render('timetable', {title: 'Kenya Airways', airports: locations});
});

//Listen on the correct port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
