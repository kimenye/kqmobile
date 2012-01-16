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
			var lat = pos.coords.latitude;
			var lng = pos.coords.longitude;
			return new google.maps.LatLng(lat, lng);
		}
		else{
			var lat = pos.latitude;
			var lng = pos.longitude;
			return new google.maps.LatLng(lat, lng);
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
		// console.log("Request was successful " + data);
		var bounds = new google.maps.LatLngBounds();
		for(var idx=0;idx<data.length;idx++) {
			var loc = data[idx];
			console.log(loc.name);
			

			
			var latlng = new google.maps.LatLng(loc.lat, loc.lon);
			bounds.extend(latlng);
			var marker = new google.maps.Marker({
            	map: map,
				animation: google.maps.Animation.DROP,
				icon: 'images/kq_icon.jpg',
				clickable: true,
            	position: latlng
        	});
			map.setCenter(latlng);
			createWindow(map,marker,loc);
		}
		map.fitBounds(bounds);
	}
	
	function createWindow(map,marker,location) {
		//console.log("Creating window for " + location.name);
		var infowindow = new google.maps.InfoWindow({ 
			content: buildInfoWindow(location)//,
        	// size: new google.maps.Size(50,50)
	    });
	
		google.maps.event.addListener(marker, 'click', function() {
			console.log("Clicked the marker " + marker);
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
});