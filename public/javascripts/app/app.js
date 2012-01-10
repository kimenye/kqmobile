$( '#planPage' ).live( 'pageinit',function(event){
	// $('#dep_date').val(new Date.today().toString("yyyy-MM-dd"));
	// $('#ret_date').val(new Date.today().add(3).days().toString("yyyy-MM-dd"));
	
	$( "#type_slider" ).bind( "change", function(event) {
		// alert($( "#type_slider" ).val());
		// if ('type')
		var val = ( "#type_slider" ).val();
		if (val == 'one-way') {
			$('#ret_date').textinput('disable');
		}
	});
});

$( '#contactsPage' ).live('pageinit', function(event) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				// alert(position.coords.latitude + "," + position.coords.longitude);
				var geocoder = new google.maps.Geocoder();
				var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				
				geocoder.geocode({'latLng': latlng}, function(results, status) {
					for(var idx=0;idx<results.length;idx++)
						console.log(results[idx].formatted_address);
				});
				
			}, 
			function(msg) {
				alert(msg);
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