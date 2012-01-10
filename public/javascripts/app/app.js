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

// var CurrentLocation = function(geo_location) {
// 	
// 	this.
// };

function CurrentLocation(geo_location) {
	this.locations = geo_location;
}

CurrentLocation.prototype.country = function() {
	// var country = null;
	return this.locations[this.locations.length-1].formatted_address;
};

CurrentLocation.prototype.town = function() {
	return this.locations[this.locations.length-2].formatted_address;
}

var geoLocation = null;

$( '#homePage' ).live('pageinit', function(event) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				// alert(position.coords.latitude + "," + position.coords.longitude);
				var geocoder = new google.maps.Geocoder();
				var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				
				geocoder.geocode({'latLng': latlng}, function(results, status) {
					// for(var idx=0;idx<results.length;idx++)
					// 						console.log(results[idx].formatted_address);
					geoLocation = new CurrentLocation(results);
					console.log("Country is " + geoLocation.country() + " And town is " + geoLocation.town());
				});
				
			}, 
			function(msg) {
				alert("Sorry we could not determine your location at this time");
			}
		);
	}
});

// $( '#timetablePage' ).live( 'pageinit',function(event){
// 	// $('#dep_date').val(new Date.today().toString("yyyy-MM-dd"));
// 	// $('#ret_date').val(new Date.today().add(3).days().toString("yyyy-MM-dd"));
// });
// 
// 
// $('#timetableViewPage').live('pageinit', function(event) {
// 	// alert('Page ready');
// 	$('#btn-next-timetable').click(function(e) {
// 		// e.stopImmediatePropagation();
// 	    // e.preventDefault();
// 		// alert('You clicked next');
// 		$('#frmTimetableView').submit();
// 	});
// });