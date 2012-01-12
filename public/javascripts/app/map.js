//thx @elroyjetson for the code example

// When map page opens get location and display map
$('.page-map').live("pagecreate", function() {
	console.log('creating map');
	
	if (geoLocation) {
		console.log('We already have the users position');
		gpsSuccess(null, geoLocation.latlong());
	}
	else {
		console.log("We don't have the users position");
		if (navigator.geoLocation) {
			navigator.geolocation.getCurrentPosition(gpsSuccess, function() { console.log ("Could not geolocate")}, {enableHighAccuracy:true, maximumAge: 300000});
		}
	}
	// 	/*
	// 	if not supported, you might attempt to use google loader for lat,long
	// 	$.getScript('http://www.google.com/jsapi?key=YOURAPIKEY',function(){
	// 		lat = google.loader.ClientLocation.latitude;
	// 		lng = google.loader.ClientLocation.longitude;
	// 	});			
	// 	*/
	
	function createLatLong(pos) {
		if( pos.coords )
		{ 
			lat = pos.coords.latitude;
			lng = pos.coords.longitude;
		}
		else{
			lat = pos.latitude;
			lng = pos.longitude;
		}
	}
	
	function gpsSuccess(pos, latlong) {
		var myOptions = {
			zoom: 10,
			center: (latlong)? latlong : createLatLong(pos),
			mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    var map = new google.maps.Map(document.getElementById("map-canvas"),myOptions);
		loadMarkers(map);
	}
	
	function loadMarkers(map) {
		$.ajax({
          type: "GET",
          url: "contacts_raw?type=office",
          //data: ({name: theName}),
          cache: false,
          dataType: "json",
          success: function(data) {
				onSuccess(map, data);
			}
        });
	}
	
	/**
	 * To be refactored as it is very innefficient
	 */
	function onSuccess(map,data) {
		console.log("Request was successful " + data);
		
		var geocoder = new google.maps.Geocoder();
		for(var idx=0;idx<data.length;idx++) {
			console.log(data[idx].name);
			
			geocoder.geocode( { 'address': data[idx].geo}, function(results, status) {
	      		if (status == google.maps.GeocoderStatus.OK) {
		        	map.setCenter(results[0].geometry.location);
		        	var marker = new google.maps.Marker({
		            	map: map,
						animation: google.maps.Animation.DROP,
						icon: 'images/kq_icon.jpg',
		            	position: results[0].geometry.location
		        	});
					createWindow(map,marker,location);
					
		      	} else {
		        	console("Geocode was not successful for the following reason: " + status);
		      	}
		    });
		}
	}
	
	function createWindow(map,marker,location) {
		// var name = data[idx].name;
		var infowindow = new google.maps.InfoWindow(
	      	{ content: location.name,
	        	size: new google.maps.Size(50,50)
	      	});
		google.maps.event.addListener(marker, 'click', function() {
		    // map.setZoom(8);
		    // 			console.log("Clicked the map");
		    // 			infowindow.open(map,marker);
			// $.mobile.changePage('#contactPage', {transition: 'pop', role: 'dialog'});   
		});
	}
});