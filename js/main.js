$(document).ready(function() {
	$('#submitBtn').click(function() {
	    window.location.href = "details.html?id="+$('#permitTxt').val();
	});

	$("#permitTxt").keyup(function(event){
	    if(event.keyCode == 13){
	        $('#submitBtn').click();
	    }
	});
})
