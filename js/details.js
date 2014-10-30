$(document).ready(function() {
	// Get the permit number from the url of the page
	var id = location.search.replace('?', '').split('=')[1];
	// If an permit number is present, begin to get data
	if(id) {
		getData(id);
	} else {
		//  If there is no permit number present in the url, display warning message
		$('#noInputWarning').html("<strong text-align=\"left\">Please enter a valid permit number.  Once submitted, please allow a few seconds for the page content to load.</strong>");
	}
})
// Make the calls to get the data for the given permit
function getData(permitID){
	$.when(
	// Grab the data export data
	$.getJSON('http://default-environment-iygu5qavq7.elasticbeanstalk.com/data.php?number=' + permitID, function(data) {
	  	var dataElementsJsonObject = data;//.slice(0,1);
	}),
	// grab the milestone data
	$.getJSON('http://default-environment-iygu5qavq7.elasticbeanstalk.com/milestone.php?number=' + permitID, function(data) {
	  	var milestonesJsonObject = data;
	}),
	// grab the review data
	$.getJSON('http://default-environment-iygu5qavq7.elasticbeanstalk.com/review.php?number=' + permitID, function(data) {
	  	var reviewsJsonObject = data;
	}),
	// grab the buildingmilestones data
	$.getJSON('http://default-environment-iygu5qavq7.elasticbeanstalk.com/buildingmilestonestranslated.php?number=' + permitID, function(data) {
	  	var buildingJsonObject = data;
	}),
	// grab the firemilestones data
	$.getJSON('http://default-environment-iygu5qavq7.elasticbeanstalk.com/firemilestonestranslated.php?number=' + permitID, function(data) {
	  	var fireJsonObject = data;
	})
	).done(function(dataElementsJsonObject,milestonesJsonObject,reviewsJsonObject,buildingJsonObject,fireJsonObject){
		// Call the function to display the data with the resulting json objects
		displayData(dataElementsJsonObject,milestonesJsonObject,reviewsJsonObject,buildingJsonObject,fireJsonObject);
	});
}
// Use the argument json objects to fill in the data on the page
function displayData(dataElementsJsonObject,milestonesJsonObject,reviewsJsonObject,buildingJsonObject,fireJsonObject) {
	// Put the json objects into containers for use
	dataElementsList = dataElementsJsonObject.slice(0,1)[0];
	console.log(dataElementsList);
	milestonesList = milestonesJsonObject.slice(0,1)[0];
	console.log(milestonesList);
	reviewsList = reviewsJsonObject.slice(0,1)[0];
	console.log(reviewsList);
	buildingMilestonesTranslationList = buildingJsonObject.slice(0,1)[0];
	console.log(buildingMilestonesTranslationList);
	fireMilestonesTranslationList = fireJsonObject.slice(0,1)[0];
	console.log(fireMilestonesTranslationList);

	// Set variables for filling in the page
	var permitType = dataElementsList.BuildingOrFire.toString();
	var permitID = dataElementsList.PermitNumber.toString();
	// Put milestones in order
	var condensedMilestonesList = new Object();
	if(permitType === "Fire"){
		condensedMilestonesList.IntakePayment = new Object();
		condensedMilestonesList.PermitReview = new Object();
		condensedMilestonesList.Issuance = new Object();
		condensedMilestonesList.Inspections = new Object();
		condensedMilestonesList.Completed = new Object();
		
		$.each(milestonesList, function(key,value){
			console.log(value);
			$.each(fireMilestonesTranslationList, function(key1,value1){
				//console.log(value1);
				if(value.MilestoneName === value1.Milestones){
					console.log(value1.DisplayStatus);
					if(value1.DisplayStatus === "Intake & Payment"){
						if(condensedMilestonesList.IntakePayment.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.IntakePayment.MilesoneStartDate){
								condensedMilestonesList.IntakePayment.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.IntakePayment.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.IntakePayment.Description = value1.Description.toString();
							condensedMilestonesList.IntakePayment.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.IntakePayment.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.IntakePayment.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.IntakePayment.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Permit Review"){
						if(condensedMilestonesList.PermitReview.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.PermitReview.MilesoneStartDate){
								condensedMilestonesList.PermitReview.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.PermitReview.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.PermitReview.Description = value1.Description.toString();
							condensedMilestonesList.PermitReview.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.PermitReview.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.PermitReview.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.PermitReview.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Issuance"){
						if(condensedMilestonesList.Issuance.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.Issuance.MilesoneStartDate){
								condensedMilestonesList.Issuance.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.Issuance.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.Issuance.Description = value1.Description.toString();
							condensedMilestonesList.Issuance.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.Issuance.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.Issuance.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.Issuance.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Inspections"){
						if(condensedMilestonesList.Inspections.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.Inspections.MilesoneStartDate){
								condensedMilestonesList.Inspections.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.Inspections.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.Inspections.Description = value1.Description.toString();
							condensedMilestonesList.Inspections.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.Inspections.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.Inspections.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.Inspections.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Completed"||value1.DisplayStatus === "Revoked"||value1.DisplayStatus === "Abandoned"||value1.DisplayStatus === "** NOT USED **"){
						if(condensedMilestonesList.Completed.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.Completed.MilesoneStartDate){
								condensedMilestonesList.Completed.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.Completed.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.Completed.Description = value1.Description.toString();
							condensedMilestonesList.Completed.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.Completed.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.Completed.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.Completed.POC = value.CityContactName.toString();
						}
					}
				}
			});
			console.log(condensedMilestonesList);
		});
		// Determine the current Milestone and if a milestone has been skipped.  Also output some data elements.
		var currentMilestone = "";
		var milestoneSkipped = ["N","N","N","N","N"];
		if(condensedMilestonesList.Completed.DisplayStatus){
			currentMilestone = condensedMilestonesList.Completed.DisplayStatus;
			$('#descriptionLbl').html(condensedMilestonesList.Completed.Description);
		} else {
			if(condensedMilestonesList.Inspections.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Inspections.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Inspections.Description);
					if(typeof condensedMilestonesList.Inspections.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.Inspections.ContactInfo);
					}
				}
				$('#fireInspectionsStatusLbl').html(condensedMilestonesList.Inspections.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.Inspections.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Inspections.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Inspections.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus){
					milestoneSkipped[3] = "Y";
					$('#fireInspectionsStatusLbl').html("Inspections<br>N/A");
				}
			}
			if(condensedMilestonesList.Issuance.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Issuance.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Issuance.Description);
					if(typeof condensedMilestonesList.Issuance.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.Issuance.ContactInfo);
					}
				}
				$('#fireIssuanceStatusLbl').html(condensedMilestonesList.Issuance.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.Issuance.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Issuance.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Issuance.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus){
					milestoneSkipped[2] = "Y";
					$('#fireIssuanceStatusLbl').html("Issuance<br>N/A");
				}
			}
			if(condensedMilestonesList.PermitReview.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.PermitReview.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.PermitReview.Description);
					if(typeof condensedMilestonesList.PermitReview.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.PermitReview.ContactInfo);
					}
				}
				$('#firePermitReviewStatusLbl').html(condensedMilestonesList.PermitReview.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.PermitReview.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.PermitReview.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.PermitReview.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus || condensedMilestonesList.Issuance.DisplayStatus){
					milestoneSkipped[1] = "Y";
					$('#firePermitReviewStatusLbl').html("Permit Review<br>N/A");
				}
			}
			if(condensedMilestonesList.IntakePayment.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.IntakePayment.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.IntakePayment.Description);
					if(typeof condensedMilestonesList.IntakePayment.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.IntakePayment.ContactInfo);
					}
				}
				$('#fireIntakePaymentStatusLbl').html(condensedMilestonesList.IntakePayment.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.IntakePayment.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.IntakePayment.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.IntakePayment.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus|| condensedMilestonesList.Issuance.DisplayStatus || condensedMilestonesList.PermitReview.DisplayStatus){
					milestoneSkipped[0] = "Y";
					$('#fireIntakePaymentStatusLbl').html("Intake & Payment<br>N/A");
				}
			}
		}
		console.log('currentMilestone');
		console.log(currentMilestone);
		console.log(milestoneSkipped);
	} 
	// For Building Permits
	if(permitType === "Building"){
		condensedMilestonesList.IntakePayment = new Object();
		condensedMilestonesList.ProjectReview = new Object();
		condensedMilestonesList.ZoningReview = new Object();
		condensedMilestonesList.Issuance = new Object();
		condensedMilestonesList.Inspections = new Object();
		condensedMilestonesList.Occupancy = new Object();
		condensedMilestonesList.Completed = new Object();
		
		$.each(milestonesList, function(key,value){
			console.log(value);
			$.each(fireMilestonesTranslationList, function(key1,value1){
				//console.log(value1);
				if(value.MilestoneName === value1.Milestones){
					console.log(value1.DisplayStatus);
					if(value1.DisplayStatus === "Intake & Payment"){
						if(condensedMilestonesList.IntakePayment.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.IntakePayment.MilesoneStartDate){
								condensedMilestonesList.IntakePayment.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.IntakePayment.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.IntakePayment.Description = value1.Description.toString();
							condensedMilestonesList.IntakePayment.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.IntakePayment.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.IntakePayment.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.IntakePayment.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Project Review"){
						if(condensedMilestonesList.ProjectReview.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.ProjectReview.MilesoneStartDate){
								condensedMilestonesList.ProjectReview.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.ProjectReview.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.ProjectReview.Description = value1.Description.toString();
							condensedMilestonesList.ProjectReview.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.ProjectReview.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.ProjectReview.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.ProjectReview.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Zoning Review"){
						if(condensedMilestonesList.ZoningReview.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.ZoningReview.MilesoneStartDate){
								condensedMilestonesList.ZoningReview.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.ZoningReview.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.ZoningReview.Description = value1.Description.toString();
							condensedMilestonesList.ZoningReview.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.ZoningReview.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.ZoningReview.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.ZoningReview.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Issuance"){
						if(condensedMilestonesList.Issuance.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.Issuance.MilesoneStartDate){
								condensedMilestonesList.Issuance.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.Issuance.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.Issuance.Description = value1.Description.toString();
							condensedMilestonesList.Issuance.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.Issuance.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.Issuance.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.Issuance.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Inspections"){
						if(condensedMilestonesList.Inspections.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.Inspections.MilesoneStartDate){
								condensedMilestonesList.Inspections.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.Inspections.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.Inspections.Description = value1.Description.toString();
							condensedMilestonesList.Inspections.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.Inspections.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.Inspections.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.Inspections.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Occupancy"){
						if(condensedMilestonesList.Occupancy.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.Occupancy.MilesoneStartDate){
								condensedMilestonesList.Occupancy.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.Occupancy.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.Occupancy.Description = value1.Description.toString();
							condensedMilestonesList.Occupancy.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.Occupancy.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.Occupancy.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.Occupancy.POC = value.CityContactName.toString();
						}
					}
					if(value1.DisplayStatus === "Completed"||value1.DisplayStatus === "Revoked"||value1.DisplayStatus === "Abandoned"||value1.DisplayStatus === "** NOT USED **"){
						if(condensedMilestonesList.Completed.MilesoneStartDate){
							if(value.MilesoneStartDate<condensedMilestonesList.Completed.MilesoneStartDate){
								condensedMilestonesList.Completed.MilesoneStartDate = new Date(value.MilestoneStartDate.toString());
							}
						} else {
							condensedMilestonesList.Completed.DisplayStatus = value1.DisplayStatus.toString();
							condensedMilestonesList.Completed.Description = value1.Description.toString();
							condensedMilestonesList.Completed.ExpectedDuration = value1.ExpectedDuration.toString();
							condensedMilestonesList.Completed.MilestoneStartDate = new Date(value.MilestoneStartDate.toString());
							condensedMilestonesList.Completed.ContactInfo = value1.ContactInstructions.toString();
							condensedMilestonesList.Completed.POC = value.CityContactName.toString();
						}
					}
				}
			});
			console.log(condensedMilestonesList);
		});
		// Determine the current Milestone and if a milestone has been skipped.  Also output some data elements.
		var currentMilestone = "";
		var milestoneSkipped = ["N","N","N","N","N","N","N"];
		if(condensedMilestonesList.Completed.DisplayStatus){
			currentMilestone = condensedMilestonesList.Completed.DisplayStatus;
			$('#descriptionLbl').html(condensedMilestonesList.Completed.Description);
		} else {
			if(condensedMilestonesList.Occupancy.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Occupancy.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Occupancy.Description);
					if(typeof condensedMilestonesList.Occupancy.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.Occupancy.ContactInfo);
					}
				}
				$('#buildingOccupancyStatusLbl').html(condensedMilestonesList.Occupancy.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.Occupancy.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Occupancy.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Occupancy.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus){
					milestoneSkipped[5] = "Y";
					$('#buildingOccupancyStatusLbl').html("Occupancy<br>N/A");
				}
			}
			if(condensedMilestonesList.Inspections.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Inspections.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Inspections.Description);
					if(typeof condensedMilestonesList.Inspections.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.Inspections.ContactInfo);
					}
				}
				$('#buildingInspectionsStatusLbl').html(condensedMilestonesList.Inspections.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.Inspections.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Inspections.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Inspections.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus){
					milestoneSkipped[4] = "Y";
					$('#buildingInspectionsStatusLbl').html("Inspections<br>N/A");
				}
			}
			if(condensedMilestonesList.Issuance.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Issuance.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Issuance.Description);
					if(typeof condensedMilestonesList.Issuance.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.Issuance.ContactInfo);
					}
				}
				$('#buildingIssuanceStatusLbl').html(condensedMilestonesList.Issuance.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.Issuance.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Issuance.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Issuance.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus){
					milestoneSkipped[3] = "Y";
					$('#buildingIssuanceStatusLbl').html("Issuance<br>N/A");
				}
			}
			if(condensedMilestonesList.ZoningReview.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.ZoningReview.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.ZoningReview.Description);
					if(typeof condensedMilestonesList.ZoningReview.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.ZoningReview.ContactInfo);
					}
				}
				$('#buildingZoningReviewStatusLbl').html(condensedMilestonesList.ZoningReview.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.ZoningReview.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.ZoningReview.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.ZoningReview.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus || condensedMilestonesList.Issuance.DisplayStatus){
					milestoneSkipped[2] = "Y";
					$('#buildingZoningReviewStatusLbl').html("Zoning Review<br>N/A");
				}
			}
			if(condensedMilestonesList.ProjectReview.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.ProjectReview.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.ProjectReview.Description);
					if(typeof condensedMilestonesList.ProjectReview.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.ProjectReview.ContactInfo);
					}
				}
				$('#buildingProjectReviewStatusLbl').html(condensedMilestonesList.ProjectReview.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.ProjectReview.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.ProjectReview.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.ProjectReview.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus|| condensedMilestonesList.Issuance.DisplayStatus || condensedMilestonesList.ZoningReview.DisplayStatus){
					milestoneSkipped[1] = "Y";
					$('#buildingProjectReviewStatusLbl').html("Project Review<br>N/A");
				}
			}
			if(condensedMilestonesList.IntakePayment.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.IntakePayment.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.IntakePayment.Description);
					if(typeof condensedMilestonesList.IntakePayment.ContactInfo !== 'undefined'){
						$('#contactInfo').html(condensedMilestonesList.IntakePayment.ContactInfo);
					}
				}
				$('#buildingIntakePaymentStatusLbl').html(condensedMilestonesList.IntakePayment.DisplayStatus+"<br>"
					+"Started On: "+(condensedMilestonesList.IntakePayment.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.IntakePayment.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.IntakePayment.MilestoneStartDate.getFullYear());
			} else {
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus|| condensedMilestonesList.Issuance.DisplayStatus || condensedMilestonesList.ZoningReview.DisplayStatus || condensedMilestonesList.ProjectReview.DisplayStatus){
					milestoneSkipped[0] = "Y";
					$('#buildingIntakePaymentStatusLbl').html("Intake & Payment<br>N/A");
				}
			}
		}
		console.log('currentMilestone');
		console.log(currentMilestone);
		console.log(milestoneSkipped);
	}
	if(currentMilestone===""||currentMilestone===" "){ //if there are no milestones, then display a no progress message
		$('#statusOnDateLbl').html("No progress data is available for Permit #"+permitID+".");
		$('#descriptionLbl').html("");
	} else {
		// Send to a different function for display
		showProgress(permitType,currentMilestone,permitID,milestoneSkipped);
		showReviews(reviewsList);

		// Start filling in the other data elements on the page
		$('#permitInfoText').html("<u>Type of Permit:</u><br>"+dataElementsList.PermitType.toString());
		$('#contactPOC').html(dataElementsList.PermitPOCName.toString());
		$('#addressInfo').html(dataElementsList.Address.toString().substring(1,dataElementsList.Address.toString().length)+"<br>"+dataElementsList.City.toString()+", "+dataElementsList.State.toString()+" "+padZipcodeToFive(dataElementsList.Zip.toString()));
		// $('#').html();
		// $('#').html();
		// $('#').html();
	}
}

// since all of the Zip codes near Boston, MA begin with a 0, this function ensures they all retain their leading 0.
function padZipcodeToFive(zipcode) {
 		if (zipcode<=99999) { 
 			zipcode = ("0000"+zipcode).slice(-5); 
 		}
  		return zipcode;
}

// Gets the Reviews data, formats it and outputs it to the #reviewsText tag on the details page
function showReviews(reviewsList){
	var reviewsData = "";
	var reviewIconTagText = "";

	$.each(reviewsList, function(key,value){
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
   		} else {
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
	  	
	});
	$('#reviewsText').html(reviewsData);
}

// Gets the Reviews data, formats it and outputs it to the #reviewsText tag on the details page
function showProgress(permitType,currentMilestone,permitID,milestoneSkipped){
	// Initialize variables
	var currentDate = new Date();
	$('#statusOnDateLbl').html("Permit <i><b>#" + permitID + "</b></i> is in the <i><b>" + currentMilestone + "</b></i> phase as of " + (currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+currentDate.getFullYear() + ".");
	// For Building permits
	if(permitType === "Building"){
		//console.log(currentMilestone);
		if(currentMilestone==="Intake & Payment"){
			// Make the current box turn yellow
			$('#buildingIntakePaymentStatusLbl').removeClass("alert alert-info");
			$('#buildingIntakePaymentStatusLbl').addClass("alert alert-warning");

			// Make the subsequent boxes turn red
			$('#buildingProjectReviewStatusLbl').removeClass("alert alert-info");
			$('#buildingProjectReviewStatusLbl').addClass("alert alert-danger");

			$('#buildingZoningReviewStatusLbl').removeClass("alert alert-info");
			$('#buildingZoningReviewStatusLbl').addClass("alert alert-danger");

			$('#buildingIssuanceStatusLbl').removeClass("alert alert-info");
			$('#buildingIssuanceStatusLbl').addClass("alert alert-danger");

			$('#buildingInspectionsStatusLbl').removeClass("alert alert-info");
			$('#buildingInspectionsStatusLbl').addClass("alert alert-danger");

			$('#buildingOccupancyStatusLbl').removeClass("alert alert-info");
			$('#buildingOccupancyStatusLbl').addClass("alert alert-danger");

			$('#buildingCompletedStatusLbl').removeClass("alert alert-info");
			$('#buildingCompletedStatusLbl').addClass("alert alert-danger");
		}
		if(currentMilestone==="Project Review"){
			// Make the previous boxes turn green
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentStatusLbl').removeClass("alert alert-info");
				$('#buildingIntakePaymentStatusLbl').addClass("alert alert-success");
			}

			// Make the current box turn yellow
			$('#buildingProjectReviewStatusLbl').removeClass("alert alert-info");
			$('#buildingProjectReviewStatusLbl').addClass("alert alert-warning");

			// Make the subsequent boxes turn red
			$('#buildingZoningReviewStatusLbl').removeClass("alert alert-info");
			$('#buildingZoningReviewStatusLbl').addClass("alert alert-danger");

			$('#buildingIssuanceStatusLbl').removeClass("alert alert-info");
			$('#buildingIssuanceStatusLbl').addClass("alert alert-danger");

			$('#buildingInspectionsStatusLbl').removeClass("alert alert-info");
			$('#buildingInspectionsStatusLbl').addClass("alert alert-danger");

			$('#buildingOccupancyStatusLbl').removeClass("alert alert-info");
			$('#buildingOccupancyStatusLbl').addClass("alert alert-danger");

			$('#buildingCompletedStatusLbl').removeClass("alert alert-info");
			$('#buildingCompletedStatusLbl').addClass("alert alert-danger");
		}
		if(currentMilestone==="Zoning Review"){
			// Make the previous boxes turn green
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentStatusLbl').removeClass("alert alert-info");
				$('#buildingIntakePaymentStatusLbl').addClass("alert alert-success");
			}

			if(milestoneSkipped[1]!="Y"){
				$('#buildingProjectReviewStatusLbl').removeClass("alert alert-info");
				$('#buildingProjectReviewStatusLbl').addClass("alert alert-success");
			}

			// Make the current box turn yellow
			$('#buildingZoningReviewStatusLbl').removeClass("alert alert-info");
			$('#buildingZoningReviewStatusLbl').addClass("alert alert-warning");

			// Make the subsequent boxes turn red
			$('#buildingIssuanceStatusLbl').removeClass("alert alert-info");
			$('#buildingIssuanceStatusLbl').addClass("alert alert-danger");

			$('#buildingInspectionsStatusLbl').removeClass("alert alert-info");
			$('#buildingInspectionsStatusLbl').addClass("alert alert-danger");

			$('#buildingOccupancyStatusLbl').removeClass("alert alert-info");
			$('#buildingOccupancyStatusLbl').addClass("alert alert-danger");

			$('#buildingCompletedStatusLbl').removeClass("alert alert-info");
			$('#buildingCompletedStatusLbl').addClass("alert alert-danger");
		}
		if(currentMilestone === "Issuance"){
			// Make the previous boxes turn green
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentStatusLbl').removeClass("alert alert-info");
				$('#buildingIntakePaymentStatusLbl').addClass("alert alert-success");
			}

			if(milestoneSkipped[1]!="Y"){
				$('#buildingProjectReviewStatusLbl').removeClass("alert alert-info");
				$('#buildingProjectReviewStatusLbl').addClass("alert alert-success");
			}

			if(milestoneSkipped[2]!="Y"){
				$('#buildingZoningReviewStatusLbl').removeClass("alert alert-info");
				$('#buildingZoningReviewStatusLbl').addClass("alert alert-success");
			}

			// Make the current box turn yellow
			$('#buildingIssuanceStatusLbl').removeClass("alert alert-info");
			$('#buildingIssuanceStatusLbl').addClass("alert alert-warning");

			// Make the subsequent boxes turn red
			$('#buildingInspectionsStatusLbl').removeClass("alert alert-info");
			$('#buildingInspectionsStatusLbl').addClass("alert alert-danger");

			$('#buildingOccupancyStatusLbl').removeClass("alert alert-info");
			$('#buildingOccupancyStatusLbl').addClass("alert alert-danger");

			$('#buildingCompletedStatusLbl').removeClass("alert alert-info");
			$('#buildingCompletedStatusLbl').addClass("alert alert-danger");
		}
		if(currentMilestone === "Inspections"){
			// Make the previous boxes turn green
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentStatusLbl').removeClass("alert alert-info");
				$('#buildingIntakePaymentStatusLbl').addClass("alert alert-success");
			}
			
			if(milestoneSkipped[1]!="Y"){
				$('#buildingProjectReviewStatusLbl').removeClass("alert alert-info");
				$('#buildingProjectReviewStatusLbl').addClass("alert alert-success");
			}

			if(milestoneSkipped[2]!="Y"){
				$('#buildingZoningReviewStatusLbl').removeClass("alert alert-info");
				$('#buildingZoningReviewStatusLbl').addClass("alert alert-success");
			}

			if(milestoneSkipped[3]!="Y"){
				$('#buildingIssuanceStatusLbl').removeClass("alert alert-info");
				$('#buildingIssuanceStatusLbl').addClass("alert alert-success");
			}
			
			// Make the current box turn yellow
			$('#buildingInspectionsStatusLbl').removeClass("alert alert-info");
			$('#buildingInspectionsStatusLbl').addClass("alert alert-warning");

			// Make the subsequent boxes turn red
			$('#buildingOccupancyStatusLbl').removeClass("alert alert-info");
			$('#buildingOccupancyStatusLbl').addClass("alert alert-danger");

			$('#buildingCompletedStatusLbl').removeClass("alert alert-info");
			$('#buildingCompletedStatusLbl').addClass("alert alert-danger");
		}
		if(currentMilestone === "Occupancy"){
			// Make the previous boxes turn green
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentStatusLbl').removeClass("alert alert-info");
				$('#buildingIntakePaymentStatusLbl').addClass("alert alert-success");
			}
			
			if(milestoneSkipped[1]!="Y"){
				$('#buildingProjectReviewStatusLbl').removeClass("alert alert-info");
				$('#buildingProjectReviewStatusLbl').addClass("alert alert-success");
			}

			if(milestoneSkipped[2]!="Y"){
				$('#buildingZoningReviewStatusLbl').removeClass("alert alert-info");
				$('#buildingZoningReviewStatusLbl').addClass("alert alert-success");
			}

			if(milestoneSkipped[3]!="Y"){
				$('#buildingIssuanceStatusLbl').removeClass("alert alert-info");
				$('#buildingIssuanceStatusLbl').addClass("alert alert-success");
			}

			if(milestoneSkipped[4]!="Y"){
				$('#buildingInspectionsStatusLbl').removeClass("alert alert-info");
				$('#buildingInspectionsStatusLbl').addClass("alert alert-success");
			}
			
			// Make the current box turn yellow
			$('#buildingOccupancyStatusLbl').removeClass("alert alert-info");
			$('#buildingOccupancyStatusLbl').addClass("alert alert-warning");

			// Make the subsequent boxes turn red
			$('#buildingCompletedStatusLbl').removeClass("alert alert-info");
			$('#buildingCompletedStatusLbl').addClass("alert alert-danger");
		}
		if(currentMilestone === "Revoked" || currentMilestone === "Abandoned" || currentMilestone === "Completed"){
			// Make all the boxes turn green
			$('#buildingIntakePaymentStatusLbl').removeClass("alert alert-info");
			$('#buildingIntakePaymentStatusLbl').addClass("alert alert-success");

			$('#buildingProjectReviewStatusLbl').removeClass("alert alert-info");
			$('#buildingProjectReviewStatusLbl').addClass("alert alert-success");

			$('#buildingZoningReviewStatusLbl').removeClass("alert alert-info");
			$('#buildingZoningReviewStatusLbl').addClass("alert alert-success");

			$('#buildingIssuanceStatusLbl').removeClass("alert alert-info");
			$('#buildingIssuanceStatusLbl').addClass("alert alert-success");

			$('#buildingInspectionsStatusLbl').removeClass("alert alert-info");
			$('#buildingInspectionsStatusLbl').addClass("alert alert-success");

			$('#buildingOccupancyStatusLbl').removeClass("alert alert-info");
			$('#buildingOccupancyStatusLbl').addClass("alert alert-success");

			$('#buildingCompletedStatusLbl').removeClass("alert alert-info");
			$('#buildingCompletedStatusLbl').addClass("alert alert-success");

		}
		// Fix Skipped Milestones
		//if(milestoneSkipped[0]==="Y"){}		
	}
	// For Fire permits
	if(permitType === "Fire"){
		//console.log(currentMilestone);
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
			if(milestoneSkipped[0]!="Y"){
				$('#fireIntakePaymentStatusLbl').removeClass("alert alert-info");
				$('#fireIntakePaymentStatusLbl').addClass("alert alert-success");
			}

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
			if(milestoneSkipped[0]!="Y"){
				$('#fireIntakePaymentStatusLbl').removeClass("alert alert-info");
				$('#fireIntakePaymentStatusLbl').addClass("alert alert-success");
			}
			
			if(milestoneSkipped[1]!="Y"){
				$('#firePermitReviewStatusLbl').removeClass("alert alert-info");
				$('#firePermitReviewStatusLbl').addClass("alert alert-success");
			}
			
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
			if(milestoneSkipped[0]!="Y"){
				$('#fireIntakePaymentStatusLbl').removeClass("alert alert-info");
				$('#fireIntakePaymentStatusLbl').addClass("alert alert-success");
			}
			
			if(milestoneSkipped[1]!="Y"){
				$('#firePermitReviewStatusLbl').removeClass("alert alert-info");
				$('#firePermitReviewStatusLbl').addClass("alert alert-success");
			}

			if(milestoneSkipped[2]!="Y"){
				$('#fireIssuanceStatusLbl').removeClass("alert alert-info");
				$('#fireIssuanceStatusLbl').addClass("alert alert-success");
			}
			
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
		// Fix Skipped Milestones
		//if(milestoneSkipped[0]==="Y"){}		
	}
	else {
		console.log('Invalid Permit Type submitted.');
	}
}


