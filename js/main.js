$(document).ready(function() {
	$('#submitBtn').click(function() {
		var permitNumber = "";
		permitNumber = $('#permitTxt').val().toString();
		$.getJSON('https://default-environment-iygu5qavq7.elasticbeanstalk.com/data.php?number=' + permitNumber, function(data) {
			// Get the permit type to know how to redirect
			var permitTypeIndicator = data.BuildingOrFire.toString();
	    		if(permitTypeIndicator === "Fire"){
					window.location.href = "details_fire.html?id="+$('#permitTxt').val();
				}
				else {
					window.location.href = "details.html?id="+$('#permitTxt').val();
				} 
		}); 
	});
	$("#permitTxt").keyup(function(event){
	    if(event.keyCode == 13){
	        $('#submitBtn').click();
	    }
	});
})