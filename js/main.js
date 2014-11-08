$(document).ready(function() {
	$('#submitBtn').click(function() {
		$('#load').show();
		var permitNumber = "";
		permitNumber = $('#permitTxt').val().toString().toUpperCase();
		$.getJSON('http://default-environment-iygu5qavq7.elasticbeanstalk.com/data.php?number=' + permitNumber, function(data) {
			// Get the permit type to know how to redirect
			var permitTypeIndicator = data.BuildingOrFire.toString();
	    		if(permitTypeIndicator === "Fire"){
	    			console.log(permitNumber);
					window.location.href = "details_fire.html?id="+permitNumber;
				}
				else {
					window.location.href = "details.html?id="+permitNumber;
				} 
			},
			setTimeout(function() {
				$('#load').hide();
					$('#noInputWarning').html("<b>The permit number, #"+permitNumber+", for which you are attempting to search, does not appear in the system.  Please verify that you have entered a valid permit number and try again.</b>");
			}, 2000)
		); 
	});
	$("#permitTxt").keyup(function(event){
	    if(event.keyCode == 13){
	        $('#submitBtn').click();
	    }
	});
})