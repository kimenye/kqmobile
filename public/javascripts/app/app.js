$( '#boardingPassPage' ).live( 'pageinit',function(event){
    $('.barcode').barcode({code:'code39'});
});

$( '#planPage' ).live( 'pageinit',function(event){
	// $('#dep_date').val(new Date.today().toString("yyyy-MM-dd"));
	// $('#ret_date').val(new Date.today().add(3).days().toString("yyyy-MM-dd"));
	
	// $( "#type_slider" ).bind( "change", function(event) {
	// 	// alert($( "#type_slider" ).val());
	// 	// if ('type')
	// 	var val = ( "#type_slider" ).val();
	// 	if (val == 'one-way') {
	// 		$('#ret_date').textinput('disable');
	// 	}
	// });
});

function CurrentLocation(geo_location, lat, lon) {
	this.locations = geo_location;
	this.lat = lat;
	this.lon = lon;
}

CurrentLocation.prototype.country = function() {
	// var country = null;
	if (this.locations) {
		return this.locations[this.locations.length-1].formatted_address;
	}
	else
	{
		return "Kenya";
	}
};

CurrentLocation.prototype.town = function() {
	if (this.locations) {
		return this.locations[this.locations.length-2].formatted_address;
	}
	else {
		return "Nairobi";
	}
};

CurrentLocation.prototype.latlong = function() {
	return new google.maps.LatLng(this.lat, this.lon);
};

var geoLocation = null;

$( '#homePage' ).live('pageinit', function(event) {
	if (navigator.geolocation) {
		//$.mobile.showPageLoadingMsg();
		navigator.geolocation.getCurrentPosition(
			function(position) {
				// alert(position.coords.latitude + "," + position.coords.longitude);
				var geocoder = new google.maps.Geocoder();
				var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				
				geocoder.geocode({'latLng': latlng}, function(results, status) {
					// for(var idx=0;idx<results.length;idx++)
					// 						console.log(results[idx].formatted_address);
					geoLocation = new CurrentLocation(results, position.coords.latitude, position.coords.longitude);
					console.log("Country is " + geoLocation.country() + " And town is " + geoLocation.town());
				});
				
			}, 
			function(msg) {
				//alert("Sorry we could not determine your location at this time");
				geoLocation = new CurrentLocation(null, -1.292066, 36.821946);
				console.log("Country is " + geoLocation.country() + " And town is " + geoLocation.town());
			}
		);
	}
});