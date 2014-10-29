$(document).ready(function() {
	$('#submitBtn').click(function() {
		var permitNumber = "";
		permitNumber = $('#permitTxt').val().toString();

		$.ajax("https://s3.amazonaws.com/permit-tracker-9000/source_files/DataElementExport.csv", {
			success: function(data) {
	    		var dataElementsJsonObject = csvjson.csv2jsonQUOTES(data);
	    		console.log(dataElementsJsonObject);
				var count = 0;
	    		$.each(dataElementsJsonObject.rows, function(key,value){
	    			if(value.PermitNumber.toString() === permitNumber){
	    				return false;
	    			}
	    			count++;
	    		});
	    		var permitTypeIndicator = dataElementsJsonObject.rows[count].BuildingOrFire.toString();
	    		if(permitTypeIndicator === "Fire"){
					window.location.href = "details_fire.html?id="+$('#permitTxt').val();
				}
				else {
					window.location.href = "details.html?id="+$('#permitTxt').val();
				} 
			},
			error: function() {
	    		// Show some error message, couldn't get the CSV file
	    		console.log('Could not access contents of data elements CSV file.')
			}
		});  
	});
	$("#permitTxt").keyup(function(event){
	    if(event.keyCode == 13){
	        $('#submitBtn').click();
	    }
	});
})