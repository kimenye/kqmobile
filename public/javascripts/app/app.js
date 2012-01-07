$( '#planPage' ).live( 'pageinit',function(event){
	$('#dep_date').val(new Date.today().toString("yyyy-MM-dd"));
	$('#ret_date').val(new Date.today().add(3).days().toString("yyyy-MM-dd"));
});

$( '#timetablePage' ).live( 'pageinit',function(event){
	$('#dep_date').val(new Date.today().toString("yyyy-MM-dd"));
	$('#ret_date').val(new Date.today().add(3).days().toString("yyyy-MM-dd"));
});

// $("#frmPlan").validate({
//     submitHandler: function(form) {
//     }
// });