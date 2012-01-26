//thx @elroyjetson for the code example

// When map page opens get location and display map
$('.page-map').live("pagecreate", function() {
	console.log('creating map');
	
	var infowindow = new google.maps.InfoWindow();
	var maxDistanceKM = 50000; 
	
	if (geoLocation) {
		console.log('We already have the users position');
		gpsSuccess(null, geoLocation.latlong());
	}
	else {
		console.log("We don't have the users position");
		if (navigator.geoLocation) {
			navigator.geolocation.getCurrentPosition(gpsSuccess, function() { 
					console.log ("Could not geolocate");
					gpsSuccess(new google.maps.LatLng(-1.292066, 36.821946), null);
				}, {enableHighAccuracy:true, maximumAge: 300000});
		}
		else {
			gpsSuccess(new google.maps.LatLng(-1.292066, 36.821946), null);
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
			var lat = pos.coords.latitude;
			var lng = pos.coords.longitude;
			return new google.maps.LatLng(lat, lng);
		}
		else{
			var lat = pos.lat();
			var lng = pos.lng();
			return new google.maps.LatLng(lat, lng);
		}
	}
	
	function gpsSuccess(pos, latlong) {
		console.log("Found the users location " + pos + " " + latlong);
		var centre = (latlong)? latlong : createLatLong(pos); 
		var myOptions = {
			zoom: 10,
			center: centre,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    var map = new google.maps.Map(document.getElementById("map-canvas"),myOptions);
		loadMarkers(map, centre);
	}
	
	function loadMarkers(map, center) {
		console.log("Loading the markers");
		$.ajax({
          type: "GET",
          url: "contacts_raw?type=office",
          //data: ({name: theName}),
          cache: false,
          dataType: "json",
          success: function(data) {
				onSuccess(map, data, center);
			}
        });
	}
	
	function calculateDistance(map, data, center) {
		var service = new google.maps.DistanceMatrixService();
		var destinations = [];
		for(var idx=0;idx<data.length;idx++)
			destinations[destinations.length] = new google.maps.LatLng(data[idx].lat, data[idx].lon);

		service.getDistanceMatrix({
				origins: [center],
				destinations: destinations,
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.METRIC,
				avoidHighways: false,
				avoidTolls: false
			}, 
			function(response, status) {
				if (status != google.maps.DistanceMatrixStatus.OK) {
					console.log("There was an error in determining the distance");
				}
				else {
					var bounds = new google.maps.LatLngBounds();
					var origins = response.originAddresses;
					var destinations = response.destinationAddresses;
					
					//there is only one origin
					for(var idx=0;idx<response.rows[0].elements.length;idx++) {
						var result = response.rows[0].elements[idx];

						if (result.distance.value <= maxDistanceKM) {
							var latlng = new google.maps.LatLng(data[idx].lat, data[idx].lon);
							bounds.extend(latlng);
							var marker = new google.maps.Marker({
								map: map,
								animation: google.maps.Animation.DROP,
								icon: "images/" + data[idx].airline + "_icon.jpg",
								clickable: true,
								position: latlng
							});
							createWindow(map, marker, data[idx]);
						}
					}
					
					// var myLocation = new google.maps.Marker({
					// 						map: map,
					// 						animation: google.maps.Animation.DROP,
					// 						clicable: false,
					// 						position: center
					// 					});
					
					map.fitBounds(bounds);
					google.maps.event.trigger(map, 'resize');
				}
			}
		);
	}
	
	/**
	 * To be refactored as it is very innefficient
	 */
	function onSuccess(map,data, center) {
		console.log("Request was successful " + data);
		
		// var bounds = new google.maps.LatLngBounds();
		// 		for(var idx=0;idx<data.length;idx++) {
		// 			var loc = data[idx];
		// 			console.log(loc.name);
		// 			
		// 			var latlng = new google.maps.LatLng(loc.lat, loc.lon);
		// 			bounds.extend(latlng);
		// 			var marker = new google.maps.Marker({
		//             	map: map,
		// 				animation: google.maps.Animation.DROP,
		// 				icon: 'images/kq_icon.jpg',
		// 				clickable: true,
		//             	position: latlng
		//         	});
		// 			map.setCenter(latlng);
		// 			createWindow(map,marker,loc);
		// 		}
		// 		map.fitBounds(bounds);
		calculateDistance(map, data, center);
	}
	
	function createWindow(map,marker,location) {
		google.maps.event.addListener(marker, 'click', function() {
			// console.log("Clicked the marker " + marker);
			if (infowindow) {
				infowindow.close();
				$("#InfoWindowPane").html('');
			}
			infowindow = new google.maps.InfoWindow({ 
				content: buildInfoWindow(location)
			});
			infowindow.open(map,marker);
		});
	}
	
	function buildInfoWindow(location) {
		var iwContent   = '<div id="InfoWindow">';
		iwContent  += '<div>' + location.name + '</div>';
		iwContent += '<div class="iwGeo">' + location.geo + '</div>'
		iwContent  += '<ul data-role="listview" data-inset="true" id="InfoWindowList">';
		
		iwContent += '<li data-role="list-divider"><div>Phone Number</div></li>';
		iwContent += '<li><a href="tel:' + location.tel1 + '">' +  location.tel1 + '</a></li>';
				
		iwContent += '</ul></div></div>';
		
		$("#InfoWindowPane").html(iwContent);
        
        $("#InfoWindowList").listview({"inset": true});
        
       	iwContent = $("#InfoWindowPane").html();
				
		// console.log("Content: " + iwContent);
		return iwContent;
	}
	
	$("#nearest_me").bind("click", function(event, ui) {
		//alert("Clicked on nearest me");
	});
});