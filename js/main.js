$(document).ready(function() {
	$('#submitBtn').click(function() {
		var permitNumber = "";
		permitNumber = $('#permitTxt').val().toString();
		if(permitNumber.substring(0,3).toLowerCase()==="bfd"){
			window.location.href = "details_fire.html?id="+$('#permitTxt').val();
		}
		else {
			window.location.href = "details.html?id="+$('#permitTxt').val();
		}   
	});
	$("#permitTxt").keyup(function(event){
	    if(event.keyCode == 13){
	        $('#submitBtn').click();
	    }
	});
})
