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
				//$('#statusOnDateLbl').html("Permit <i><b>#" + id + "</b></i> is in the <i><b>" + data.ProcessState.Code + "</b></i> phase as of " + (currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+currentDate.getFullYear() + ".");
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
		outputReviewsFunction(id);
		//outputDataFunction("Fire","Review",id);
		var testArray = outputDataElements(id);
		console.log(testArray);


	} else {
		$('#noInputWarning').html("<strong text-align=\"left\">Please enter a valid permit number.  Once submitted, please allow a few seconds for the page content to load.</strong>");
	}
})
// Gets the extra data elements, formats them, and outputs them into various tags on the details page
function outputDataElements(permitID){
	var permitDataElements = [];
	$.ajax("https://s3.amazonaws.com/permit-tracker-9000/source_files/DataElementExport.csv", {
		success: function(data) {
    		var dataElementsJsonObject = csvjson.csv2jsonQUOTES(data);
    		console.log(dataElementsJsonObject);
    		//console.log(padZipcodeToFive(dataElementsJsonObject.rows[1].Zip));
    		// look through the dataElementsJsonObject to get the index of the record that pertains to the permitID
    		var count = 0;
    		$.each(dataElementsJsonObject.rows, function(key,value){
    			if(value.PermitNumber.toString() === permitID){
    				return false;
    			}
    			count++;
    		});
    		//console.log(dataElementsJsonObject.rows[count]);
    		permitDataElements["State"] = dataElementsJsonObject.rows[count].State.toString();
    		permitDataElements["Zip"] = padZipcodeToFive(dataElementsJsonObject.rows[count].Zip).toString();
    		
    		// pad the Zipcode up to 5 with leading 0's
    		//permitDataElements.Zip = padZipcodeToFive(permitDataElements.Zip);
    		console.log("zip data elements");
			console.log(permitDataElements);
    		//return permitDataElements;
    		var testReturn = outputDataFunction(dataElementsJsonObject.rows[count].BuildingOrFire.toString(),"Review",permitID);

		},
		error: function() {
    		// Show some error message, couldn't get the CSV file
    		console.log('Could not access contents of data elements CSV file.')
		}
	});
	return permitDataElements;
}
// since all of the Zip codes near Boston, MA begin with a 0, this function ensures they all retain their leading 0.
function padZipcodeToFive(zipcode) {
 		if (zipcode<=99999) { 
 			zipcode = ("0000"+zipcode).slice(-5); 
 		}
  		return zipcode;
}

// Gets the Reviews data, formats it and outputs it to the #reviewsText tag on the details page
function outputReviewsFunction(permitID){
		var reviewsData = "";
		var reviewIconTagText = "";
		//var numericPermitID = permitID.replace(/\D/g,'');
		console.log(permitID);
			//get Review info
		$.ajax("https://s3.amazonaws.com/permit-tracker-9000/source_files/ReviewExport.csv", {
    		success: function(data) {
        		var reviewsJsonObject = csvjson.csv2jsonQUOTES(data);
        		//console.log(reviewsJsonObject);
        		// Now use jsonobject to do some charting...
				$.each(reviewsJsonObject.rows, function(key,value){
					if(value.PermitNumber.toString() === permitID){
						//console.log(value);
						//console.log(value.ReviewerName.toString());
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

// Loads the Milestones file and calls the outputDataFunction

//  Need to figure out a way to translate the milestone name to the generic
function loadMilestonesFile(){
	// get the milestone data from csv file
			$.ajax("https://s3.amazonaws.com/permit-tracker-9000/source_files/MilestoneExport.csv", {
    		success: function(data) {
        		var milestonesJsonObject = csvjson.csv2jsonQUOTES(data);
        		console.log(milestonesJsonObject);
        		// Now use jsonobject to do some charting...
				// $.each(milestonesJsonObject.rows, function(key,value){

				// });

    		},
    		error: function() {
        		// Show some error message, couldn't get the CSV file
        		console.log('Could not access contents of milestones CSV file.')
    		}
		});
}

// Gets the Reviews data, formats it and outputs it to the #reviewsText tag on the details page
function outputDataFunction(permitType,milestone,permitID){
	// Initialize variables
	var currentDate = new Date();
	// console.log(permitType);
	// console.log(milestone);
	//get Milestones info for Building permits
	if(permitType === "Building"){
		$.ajax("https://s3.amazonaws.com/permit-tracker-9000/source_files/BuildingMilestonesTranslated.csv", {
    		success: function(data) {
        		var buildingJsonObject = csvjson.csv2json(data);
        		console.log(buildingJsonObject);
        		// Now use jsonobject to do some charting...
				$.each(buildingJsonObject.rows, function(key,value){
					console.log(value);
				});
    		},
    		error: function() {
        		// Show some error message, couldn't get the CSV file
        		console.log('Could not access contents of building milestones CSV file.')
    		}
		});
	}
	//get Milestones info for Fire permits
	if(permitType === "Fire"){
		$.ajax("https://s3.amazonaws.com/permit-tracker-9000/source_files/FireMilestonesTranslated.csv", {
    		success: function(data) {
        		var fireJsonObject = csvjson.csv2json(data);
        		console.log(fireJsonObject);
        		// Now use jsonobject to do some charting...
				var currentMilestone = "";
				$.each(fireJsonObject.rows, function(key,value){
					console.log(value);
					if(value.Milestone.toString()===milestone){
						currentMilestone = value.DisplayStatus.toString();
						$('#statusOnDateLbl').html("Permit <i><b>#" + permitID + "</b></i> is in the <i><b>" + currentMilestone + "</b></i> phase as of " + (currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+currentDate.getFullYear() + ".");
						$('#descriptionLbl').text(value.Description.toString());
						return false;
					}
				});
				console.log(currentMilestone);
				if(currentMilestone==="Intake & Payment"){
					// Make the current box turn yellow
					$('#fireIntakePaymentStatusLbl').removeClass("alert alert-info");
					$('#fireIntakePaymentStatusLbl').addClass("alert alert-warning");

					// Make the subsequent boxes turn red
					$('#firePermitReviewStatusLbl').removeClass("alert alert-info");
					$('#firePermitReviewStatusLbl').addClass("alert alert-danger");

					$('#fireIssuanceStatusLbl').removeClass("alert alert-info");
					$('#fireIssuanceStatusLbl').addClass("alert alert-danger");

					$('#fireInspectionsStatusLbl').removeClass("alert alert-info");
					$('#fireInspectionsStatusLbl').addClass("alert alert-danger");

					$('#fireCompletedStatusLbl').removeClass("alert alert-info");
					$('#fireCompletedStatusLbl').addClass("alert alert-danger");
				}
				if(currentMilestone==="Permit Review"){
					// Make the previous boxes turn green
					$('#fireIntakePaymentStatusLbl').removeClass("alert alert-info");
					$('#fireIntakePaymentStatusLbl').addClass("alert alert-success");

					// Make the current box turn yellow
					$('#firePermitReviewStatusLbl').removeClass("alert alert-info");
					$('#firePermitReviewStatusLbl').addClass("alert alert-warning");

					// Make the subsequent boxes turn red
					$('#fireIssuanceStatusLbl').removeClass("alert alert-info");
					$('#fireIssuanceStatusLbl').addClass("alert alert-danger");

					$('#fireInspectionsStatusLbl').removeClass("alert alert-info");
					$('#fireInspectionsStatusLbl').addClass("alert alert-danger");

					$('#fireCompletedStatusLbl').removeClass("alert alert-info");
					$('#fireCompletedStatusLbl').addClass("alert alert-danger");
				}
				if(currentMilestone === "Issuance"){
					// Make the previous boxes turn green
					$('#fireIntakePaymentStatusLbl').removeClass("alert alert-info");
					$('#fireIntakePaymentStatusLbl').addClass("alert alert-success");

					$('#firePermitReviewStatusLbl').removeClass("alert alert-info");
					$('#firePermitReviewStatusLbl').addClass("alert alert-success");

					// Make the current box turn yellow
					$('#fireIssuanceStatusLbl').removeClass("alert alert-info");
					$('#fireIssuanceStatusLbl').addClass("alert alert-warning");

					// Make the subsequent boxes turn red
					$('#fireInspectionsStatusLbl').removeClass("alert alert-info");
					$('#fireInspectionsStatusLbl').addClass("alert alert-danger");

					$('#fireCompletedStatusLbl').removeClass("alert alert-info");
					$('#fireCompletedStatusLbl').addClass("alert alert-danger");
				}
				if(currentMilestone === "Inspections"){
					// Make the previous boxes turn green
					$('#fireIntakePaymentStatusLbl').removeClass("alert alert-info");
					$('#fireIntakePaymentStatusLbl').addClass("alert alert-success");

					$('#firePermitReviewStatusLbl').removeClass("alert alert-info");
					$('#firePermitReviewStatusLbl').addClass("alert alert-success");

					$('#fireIssuanceStatusLbl').removeClass("alert alert-info");
					$('#fireIssuanceStatusLbl').addClass("alert alert-success");

					// Make the current box turn yellow
					$('#fireInspectionsStatusLbl').removeClass("alert alert-info");
					$('#fireInspectionsStatusLbl').addClass("alert alert-warning");

					// Make the subsequent boxes turn red
					$('#fireCompletedStatusLbl').removeClass("alert alert-info");
					$('#fireCompletedStatusLbl').addClass("alert alert-danger");
				}
				if(currentMilestone === "Revoked" || currentMilestone === "Abandoned" || currentMilestone === "Completed"){
					// Make all the boxes turn green
					$('#fireIntakePaymentStatusLbl').removeClass("alert alert-info");
					$('#fireIntakePaymentStatusLbl').addClass("alert alert-success");

					$('#firePermitReviewStatusLbl').removeClass("alert alert-info");
					$('#firePermitReviewStatusLbl').addClass("alert alert-success");

					$('#fireIssuanceStatusLbl').removeClass("alert alert-info");
					$('#fireIssuanceStatusLbl').addClass("alert alert-success");

					$('#fireInspectionsStatusLbl').removeClass("alert alert-info");
					$('#fireInspectionsStatusLbl').addClass("alert alert-success");

					$('#fireCompletedStatusLbl').removeClass("alert alert-info");
					$('#fireCompletedStatusLbl').addClass("alert alert-success");	
				}
				
    		},
    		error: function() {
        		// Show some error message, couldn't get the CSV file
        		console.log('Could not access contents of fire milestones CSV file.')
    		}
		});
	}
	else {
		console.log('Invalid Permit Type submitted.');
	}
}


