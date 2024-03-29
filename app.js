
/**
 * Module dependencies.
 */

var express = require('express')
  // , routes = require('./routes')
  , moment = require('moment');

var app = module.exports = express.createServer();

var DataProvider = require('./dataprovider').DataProvider;
var data = new DataProvider();
var client = process.env.CLIENT || "kq";
var title = "title";
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  if (client == "kq")
    title = "Kenya Airways";
  else if(client == "fly540")
    title = "Fly540";
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('/', function(req, res) {
	//   	var ver = process.env.CLIENT || "kq";
	// var ua = req.headers['user-agent'];
	// console.log("Version is " + ver + " Agent: " + ua);
	res.render('index', { version: client, title: title, layout: layout(req, true) });
});

var locations = null;
data.findAllAirports(function(error, ports) {
    locations = ports;
});

//data.findLocations(function(error, ports) {
//    contactLocations = ports;
//}, client);
// var ports;

app.get('/plan', function(req, res) {
	var now = moment(new Date());

	var dep = now.format("YYYY-MM-DD");
	var ret = now.add('days',3).format("YYYY-MM-DD");
	
	res.render('plan', {subtitle: 'Plan', airports: locations, dep_date: dep, ret_date: ret, layout: layout(req), version: client, title: title});
});


app.get('/airports', function(req, res) {
    res.json(locations);
});

app.get('/timetable_json', function(req, res) {
//    console.log("In timetable json");
    var from = req.param('from_airport');
    var to = req.param('to_airport');
    var page = req.param('page');

    if (!page)
        page = 0;

//    console.log("from: %s, to: %s, page: %s, client: %s", from, to, page, client);
    data.timetable(function(flights,forDay,page,prev_url,next_url) {
        res.json({
            date: forDay,
            flights: flights,
            page: page
        });
    }, from, to, page,"timetable_view", client);

});

app.get('/plan_json', function(req, res) {
    console.log("In plan json");
    var from = req.param('from_airport');
    var to = req.param('to_airport');
    var page = req.param('page');
    var flight_type = req.param('flight_type');

    if (!page)
        page = 0;

    data.timetable(function(flights,forDay,page,prev_url,next_url) {
        res.json({
            date: forDay,
            flights: flights,
            page: page,
            flight_type: flight_type
        });
    }, from, to, page,"plan_view", client);

});

app.get('/plan_view', function(req, res) {
	var action = req.param('action');
	var from = req.param('from_airport');
	var to = req.param('to_airport');
	var page = req.param('page');
	var flight_type = req.param('flight_type');
	
	if (!page)
		page = 0;
		
	// console.log("Params: action=" +action+",from="+from+",to="+to+",page="+page);
	
	// if (action == 'search') {
		data.timetable(function(flights,forDay,page,prev_url,next_url) {
			res.render('plan_view', {subtitle: "Flights for "+ from + " - " + to, 
				date: forDay, 
				flights: flights, 
				next_url: next_url,
				prev_url: prev_url,
				flight_type: flight_type,
				page: page,
				layout: layout(req),
				version: client,
				title: title});
		}, from, to, page,"plan_view", client);
	// }	
});

app.get('/get_contact_locations', function(req, res) {
    data.findLocations(function(locations) {
        res.json(locations);
    }, client);
});

app.get('/timetable', function(req, res) {
	res.render('timetable', {subtitle: 'Timetable', airports: locations, layout: layout(req), title: title, version: client});
});

app.get('/information', function(req, res) {
    res.render('information', {subtitle: 'Information', title: title, version: client});
});

app.get('/mpesa', function(req, res) {
    res.render('mpesa', {subtitle: 'Mpesa', title: title, version: client});
});

app.get('/3dsecure', function(req, res) {
    res.render('3dsecure', {subtitle: '3D Secure', title: title, version: client});
});

app.get('/airtel', function(req, res) {
    res.render('airtel', {subtitle: 'Airtel Money', title: title, version: client});
});

app.get('/payment', function(req, res) {
    res.render('payment', {subtitle: 'Payment Methods', title: title, version: client});
});

app.get('/faq', function(req, res) {
    res.render('faq', {subtitle: 'FAQ', title: title, version: client});
});

app.get('/visahealth', function(req, res) {
    res.render('visahealth', {subtitle: 'Visa and Health Information', title: title, version: client});
});

app.get('/checkin', function(req, res) {
    res.render('checkin', {subtitle: 'Check in', title: title, version: client});
});

app.get('/checkin_view', function(req, res) {
    res.render('checkin_view', {subtitle: 'Check in', title: title, version: client});
});

app.get('/boarding_pass', function(req, res) {
    res.render('boarding_pass', {subtitle: 'Boarding Pass', title: title, version: client});
});

app.get('/timetable_view', function(req, res) {
	// console.log("Action is " + req.param('action'));
	var action = req.param('action');
	var from = req.param('from_airport');
	var to = req.param('to_airport');
	var page = req.param('page');
	
	if (!page)
		page = 0;
		
	// console.log("Params: action=" +action+",from="+from+",to="+to+",page="+page);
	
	if (action == 'search') {
		data.timetable(function(flights,forDay,page,prev_url,next_url) {
			res.render('timetable_view', {subtitle: "Timetable for "+ from + " - " + to, 
				date: forDay, 
				flights: flights, 
				next_url: next_url,
				prev_url: prev_url,
				page: page,
				layout: layout(req),
				title: title,
				version: client });
		}, from, to, page,"timetable_view", client);
	}
	
});

app.get('/select', function(req, res) {
	var code = req.param('code');
	var when = req.param('when');
	var price = req.param('price');
		
	data.findFlight(function(flight) {
		res.render('select', { subtitle: 'Add Flight', flight: flight, when: when, price: price, layout: layout(req), title: title, version: client});
	}, code);

});

app.get('/pay', function(req, res) {
	var code = req.param('code');
	var when = req.param('when');
	
	data.findFlight(function(flight) {
		res.render('pay', { subtitle: 'Pay', title: title, flight: flight, version: client, when: when, layout: layout(req)});
	}, code);
	
});

app.post('/pay', function(req, res) {
	var ref = req.param('confirmation_code');
	var code = req.param('code');
	var when = req.param('when');
	
	data.findFlight(function(flight) {
		res.render('booking', { subtitle: 'Your ticket', title: title, flight: flight, when: when, version:client, layout: layout(req)});
	}, code);
	
});

app.get('/contacts_raw', function(req, res) {
	var type = req.param('type');
	data.findLocationsByTypeAndAirline(function(locations) {
		res.json(locations);
	}, type, client);
});

app.get('/contacts', function(req,res) {
	data.findLocations(function(locations) {
		res.render('contacts', { layout: layout(req), locations: locations, title: title, version: client });
	}, client);
});

app.get('/contact', function(req, res) {
	var loc = req.param('name');
	data.findLocationByName(function(location) {
		res.render('contact', { contact: location, layout: layout(req), version: client, title: title});
	}, loc);
});

app.get('/offers', function(req, res) {
	data.findOffersByAirline(function(offers) {
		res.render('special_offers', { subtitle: 'Special Offers', layout: layout(req), title: title, version: client, offers: offers});
	}, client);
});

app.get('/map', function(req, res) {
	res.render('map_canvas', { subtitle: 'Map', title: title, version: client });
});

function layout(req,full) {
	var ua = req.headers['user-agent'];

	var operaMiniHeader = 'Opera/9.80 (J2ME/MIDP; Opera Mini/4.2.13212/26.1395; U; en) Presto/2.8.119 Version/10.54';
	if (ua == operaMiniHeader) {
		return 'layout_opera';
	}
	else {
		return (full)? 'layout' : 'layout_lite';
	}
};

//Listen on the correct port
var port = process.env.PORT || 3000;


console.log("The client is " + client, port);

app.listen(port, function() {
  console.log("Listening on " + port);
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
