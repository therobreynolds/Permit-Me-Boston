$(document).ready(function() {
	$.ajax({
		url: "https://permitapidev.cityofboston.gov:4443/api/building/applicationinfo/"+id,
		type: "GET",
		dataType: "json",
		success: function (data) {
			console.log(data);
		}
	});
})