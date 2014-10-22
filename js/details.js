$(document).ready(function() {
	var id = location.search.replace('?', '').split('=')[1];
	var appData;
	// var reviewsData = "";
	var reviewProgress = "";
	var reviewIcon = "";
	var defaultDuration = "";
	var currentDate = new Date();
	var addressName = "";
	var allAddresses = "";
	var streetAddress = "";

	// only if an ID is given
	//alert(id);
	if(id) {
		// get overall info
		$.ajax({
			url: "https://permitapidev.cityofboston.gov:4443/api/building/applicationinfo/"+id,
			type: "GET",
			dataType: "json",
			success: function (data) {
				console.log(data);
				appData = data;
				$('#statusOnDateLbl').html("Permit <i><b>#" + id + "</b></i> is in the <i><b>" + data.ProcessState.Code + "</b></i> phase as of " + (currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+currentDate.getFullYear() + ".");
				//$('#statusLbl').text(data.ProcessState.Code);
				//get the addresses of the applicants
				$.each( data.Applicants, function( key, value ){
					if(value.Contact.Identity.FullName === null){
						addressName = value.Contact.Identity.LastName;
					} else {
						addressName = value.Contact.Identity.FullName;
					}
					if(value.Contact.Address2 !== null){
						streetAddress = value.Contact.Address1+"<br>"+value.Contact.Address2;
					} else {
						streetAddress = value.Contact.Address1;
					}
					allAddresses += "<address>"+"<strong>"+addressName+"</strong>"+"<br>"+streetAddress+"<br>"+value.Contact.City+", "+value.Contact.State+" "+value.Contact.Zip+"</address>";
				});
				$('#addressInfo').html(allAddresses);
				$('#permitInfoText').html(data.ApplicationType.Description + "<br>" + "<u>Comments:</u>" + "<br>" + data.Comments);

				//get milestone data based on the returned result of the initial REST query
				$.ajax({
					url: "http://http://rawgit.com/therobreynolds/Permit-Me-Boston/master/json/ALT327257.xml",
					//url: "json/milestones.json",
					type: "GET",
					dataType: "xml",
					success: function (milestones) {
						$.each( milestones, function( key, value ) {
							if(value.Milestone === appData.ProcessState.Code) {
							  	console.log(value);
							  	$('#statusLbl').text(value.Status);
							  	$('#descriptionLbl').html("description goes here.");//.text(value.Description);
							  	if(value.Duration === "" || value.Duration === " "){
							  		defaultDuration = "Duration unavailable";
							  		$('#durationText').text(defaultDuration);
							  	}
							  	else {
							  		$('#durationText').text(value.Duration);
							  	}
							  	$('#performingText').text(value.WhoPerforming);
							  	$('#contactText').text(value.Contact);
							}
						});
					}
				});
			},
			failure: function (xqr) {
				alert("Failed to load data!");
			}
		});
		//getMilestonesFunction(appData);
		getReviewsFunction(id);



	} else {
		$('#noInputWarning').html("<strong text-align=\"left\">Please enter a valid permit number.  Once submitted, please allow a few seconds for the page content to load.</strong>");
	}
})
// Gets the Reviews data, formats it and outputs it to the #reviewsText tag on the details page
function getReviewsFunction(permitID){
		var reviewsData = "";
		var reviewIconTagText = "";
		//var numericPermitID = permitID.replace(/\D/g,'');
		console.log(permitID);
			//get Review info
		$.ajax("https://s3.amazonaws.com/permit-tracker-9000/source_files/ReviewExport.csv", {
    		success: function(data) {
        		var reviewsJsonObject = csvjson.csv2json(data);
        		console.log(reviewsJsonObject);
        		// Now use jsonobject to do some charting...
				$.each(reviewsJsonObject.rows, function(key,value){
					if(value.PermitNumber.toString() === permitID){
						console.log(value);
						console.log(value.ReviewerName.toString());
						if(value.ReviewStatus.toString() === "0") {
				   			reviewProgress = "Not yet Assigned";
				   			reviewIcon = "<span class=\"glyphicon glyphicon-ban-circle\" title=\"Not yet Assigned\"></span>";
					   		if(value.IsAssignedFlag.toString() === "Y"){
					   			reviewProgress = "Assigned, but not Started";
					   			reviewIcon = "<span class=\"glyphicon glyphicon-minus\" title=\"Assigned, but not Started\"></span>";
					   		}
					   		if(value.IsStartedFlag.toString() === "Y"){
					   			reviewProgress = "Started, but not yet Complete";
					   			reviewIcon = "<span class=\"glyphicon glyphicon-cog\" title=\"Started, but not yet Complete\"></span>";
					   		}
					   		if(value.IsCompleteFlag.toString() === "Y"){
					   			reviewProgress = "Complete, and awaiting Result";
					   			reviewIcon = "<span class=\"glyphicon glyphicon-time\" title=\"Complete, and awaiting Result\"></span>";
					   		}
				   		}
				   		else {
					   		// Hard coded to say Complete per phone call with Alex
					   		//reviewProgress = value.ReviewStatus.toString();
					   		reviewProgress = "Complete";
					   		reviewIconTagText = "glyphicon glyphicon-ok";
					   		// Removed per phone call with Alex
					   		// if(reviewProgress === "Refusal"){
					   		// 	reviewIconTagText = "glyphicon glyphicon-remove";
					   		// }
				   		reviewIcon = "<span class=\""+reviewIconTagText+"\" title=\""+reviewProgress+"\"></span>";
				   	}
				  	reviewsData += reviewIcon + " " + value.ReviewType.toString() + "<br>"; // + " : " +reviewProgress + "<br>"; //= value.ReviewResult.Code;
				  	
					}
				});
				$('#reviewsText').html(reviewsData);

    		},
    		error: function() {
        		// Show some error message, couldn't get the CSV file
        		console.log('Could not access contents of reviews CSV file.')
    		}
		});
}
