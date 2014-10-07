$(document).ready(function() {
	var permitNumber = "";
	$('#submitBtn').click(function() {
		//console.log(permitNumber.substring(0,3).toLowerCase());
		permitNumber = $('#permitTxt').val();
		if(permitNumber.substring(0,3).toLowerCase()==="bfd"){
			alert("I am an alert box!");
			window.location.href = "details_fire.html?id="+$('#permitTxt').val();
		}
		else {
			alert("I am not an alert box!");
			window.location.href = "details.html?id="+$('#permitTxt').val();
		}
	    
	});

	$("#permitTxt").keyup(function(event){
	    if(event.keyCode == 13){
	        $('#submitBtn').click();
	    }
	});
})
