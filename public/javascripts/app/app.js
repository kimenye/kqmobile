$( '#planPage' ).live( 'pageinit',function(event){
	$('#dep_date').val(new Date.today().toString("yyyy-MM-dd"));
	$('#ret_date').val(new Date.today().add(3).days().toString("yyyy-MM-dd"));
});

$( '#timetablePage' ).live( 'pageinit',function(event){
	// $('#dep_date').val(new Date.today().toString("yyyy-MM-dd"));
	// $('#ret_date').val(new Date.today().add(3).days().toString("yyyy-MM-dd"));
});


$('#timetableViewPage').live('pageinit', function(event) {
	// alert('Page ready');
	$('#btn-next-timetable').click(function(e) {
		// e.stopImmediatePropagation();
	    // e.preventDefault();
		// alert('You clicked next');
		$('#frmTimetableView').submit();
	});
});

// $("#frmPlan").validate({
//     submitHandler: function(form) {
//     }
// });