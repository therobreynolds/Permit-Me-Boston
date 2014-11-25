$(document).ready(function() {	
	// Get the permit number from the url of the page
	var id = location.search.replace('?', '').split('=')[1];
	// If an permit number is present, begin to get data
	if(id) {
		$('#permitTxt').val(id.toString());
		$('#load').show();
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
	  	var dataElementsJsonObject = data;
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
	}),
	// grab the related permits data
	$.getJSON('http://default-environment-iygu5qavq7.elasticbeanstalk.com/relatedPermits.php?number=' + permitID, function(data) {
	  	var relatedPermitsJsonObject = data;
	})
	).done(function(dataElementsJsonObject,milestonesJsonObject,reviewsJsonObject,buildingJsonObject,fireJsonObject,relatedPermitsJsonObject){
			// Call the function to display the data with the resulting json objects
			displayData(dataElementsJsonObject,milestonesJsonObject,reviewsJsonObject,buildingJsonObject,fireJsonObject,relatedPermitsJsonObject);
	})
	.fail(function(){
		// If any of the PHP functions fail to return a result, reload the page.  WARNING:: THIS MAY BE THE CAUSE OF AN INFINITE LOOP AT SOME POINT.
		//console.log('JSON return errors')
		//alert("One or more JSON objects returned empty from the PHP functions.");
		location.reload();
	});
}
// Use the argument json objects to fill in the data on the page
function displayData(dataElementsJsonObject,milestonesJsonObject,reviewsJsonObject,buildingJsonObject,fireJsonObject,relatedPermitsJsonObject) {
	// Put the json objects into containers for use
	dataElementsList = dataElementsJsonObject.slice(0,1)[0];
	// console.log(dataElementsList);
	milestonesList = milestonesJsonObject.slice(0,1)[0];
	// console.log(milestonesList);
	reviewsList = reviewsJsonObject.slice(0,1)[0];
	// console.log(reviewsList);
	buildingMilestonesTranslationList = buildingJsonObject.slice(0,1)[0];
	// console.log(buildingMilestonesTranslationList);
	fireMilestonesTranslationList = fireJsonObject.slice(0,1)[0];
	// console.log(fireMilestonesTranslationList);
	relatedPermitsList = relatedPermitsJsonObject.slice(0,1)[0];
	// console.log(relatedPermitsList);

	// Set variables for filling in the rest of the page
	var permitType = dataElementsList.BuildingOrFire.toString();
	var permitID = dataElementsList.PermitNumber.toString();

	// Display related permits
	var relatedPermitsOutput = "";
	$.each(relatedPermitsList, function(key,value){
		if(value === "Fire"){
			relatedPermitsOutput += "<li><a href=\"details_fire.html?id="+key+"\">"+key+"</a></li>";
		}
		if(value === "Building"){
			relatedPermitsOutput += "<li><a href=\"details.html?id="+key+"\">"+key+"</a></li>";
		}
	});
	if(relatedPermitsOutput!=""){
		relatedPermitsOutput = "<ul>"+relatedPermitsOutput+"</ul>";
		$('#relatedPermits').html(relatedPermitsOutput);
	}

	// Put milestones in order
	var condensedMilestonesList = new Object();
	if(permitType === "Fire"){
		condensedMilestonesList.IntakePayment = new Object();
		condensedMilestonesList.PermitReview = new Object();
		condensedMilestonesList.Issuance = new Object();
		condensedMilestonesList.Inspections = new Object();
		condensedMilestonesList.Completed = new Object();
		
		$.each(milestonesList, function(key,value){
			//console.log(value);
			$.each(fireMilestonesTranslationList, function(key1,value1){
				//console.log(value1);
				if(value.MilestoneName === value1.Milestones){
					//console.log(value1.DisplayStatus);
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
			//console.log(condensedMilestonesList);
		});
		// Determine the current Milestone and if a milestone has been skipped.  Also output some data elements.
		var currentMilestone = "";
		var milestoneSkipped = ["N","N","N","N","N"];
		var autoLinker = new Autolinker();
		var statusLbl = "";
		if(condensedMilestonesList.Completed.DisplayStatus){
			currentMilestone = condensedMilestonesList.Completed.DisplayStatus;
			$('#descriptionLbl').html(condensedMilestonesList.Completed.Description);
			$('#contactPOC').html(condensedMilestonesList.Completed.POC);
			$('#fireCompletedStatusLbl').html("<u>Completed On:</u><br>"
				+(condensedMilestonesList.Completed.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Completed.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Completed.MilestoneStartDate.getFullYear());
		} else {
			$('#fireCompletedStatusLbl').html("<u>Completed On:</u><br>N/A");
			if(condensedMilestonesList.Inspections.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Inspections.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Inspections.Description);
					$('#contactPOC').html(condensedMilestonesList.Inspections.POC);
					if(typeof condensedMilestonesList.Inspections.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.Inspections.ContactInfo));
					}
				}
				$('#fireInspectionsStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Inspections",fireMilestonesTranslationList)+"<br>"
					+"<u>Started On:</u><br>"+(condensedMilestonesList.Inspections.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Inspections.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Inspections.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus){
					milestoneSkipped[3] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Inspections",fireMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#fireInspectionsStatusLbl').html(statusLbl);
			}
			if(condensedMilestonesList.Issuance.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Issuance.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Issuance.Description);
					$('#contactPOC').html(condensedMilestonesList.Issuance.POC);
					if(typeof condensedMilestonesList.Issuance.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.Issuance.ContactInfo));
					}
				}
				$('#fireIssuanceStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Issuance",fireMilestonesTranslationList)+"<br>"
					+"<u>Started On:</u><br>"+(condensedMilestonesList.Issuance.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Issuance.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Issuance.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus){
					milestoneSkipped[2] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Issuance",fireMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#fireIssuanceStatusLbl').html(statusLbl);
			}
			if(condensedMilestonesList.PermitReview.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.PermitReview.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.PermitReview.Description);
					$('#contactPOC').html(condensedMilestonesList.PermitReview.POC);
					if(typeof condensedMilestonesList.PermitReview.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.PermitReview.ContactInfo));
					}
				}
				$('#firePermitReviewStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Permit Review",fireMilestonesTranslationList)+"<br>"
					+"<u>Started On:</u><br>"+(condensedMilestonesList.PermitReview.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.PermitReview.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.PermitReview.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus || condensedMilestonesList.Issuance.DisplayStatus){
					milestoneSkipped[1] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Permit Review",fireMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#firePermitReviewStatusLbl').html(statusLbl);
			}
			if(condensedMilestonesList.IntakePayment.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.IntakePayment.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.IntakePayment.Description);
					$('#contactPOC').html(condensedMilestonesList.IntakePayment.POC);
					if(typeof condensedMilestonesList.IntakePayment.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.IntakePayment.ContactInfo));
					}
				}
				$('#fireIntakePaymentStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Intake & Payment",fireMilestonesTranslationList)+"<br>"
					+"<u>Started On</u>:<br>"+(condensedMilestonesList.IntakePayment.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.IntakePayment.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.IntakePayment.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus|| condensedMilestonesList.Issuance.DisplayStatus || condensedMilestonesList.PermitReview.DisplayStatus){
					milestoneSkipped[0] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Intake & Payment",fireMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#fireIntakePaymentStatusLbl').html(statusLbl);
			}
		}
		// console.log('currentMilestone');
		// console.log(currentMilestone);
		// console.log(milestoneSkipped);
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
			// console.log(value);
			$.each(buildingMilestonesTranslationList, function(key1,value1){
				//console.log(value1);
				if(value.MilestoneName === value1.Milestones){
					// console.log(value1.DisplayStatus);
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
		var autoLinker = new Autolinker();
		var statusLbl = "";
		if(condensedMilestonesList.Completed.DisplayStatus){
			currentMilestone = condensedMilestonesList.Completed.DisplayStatus;
			$('#descriptionLbl').html(condensedMilestonesList.Completed.Description);
			$('#contactPOC').html(condensedMilestonesList.Completed.POC);
			$('#buildingCompletedStatusLbl').html("<u>Completed On:</u> "
				+(condensedMilestonesList.Completed.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Completed.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Completed.MilestoneStartDate.getFullYear());
		} else {
			$('#buildingCompletedStatusLbl').html("<u>Completed On:</u><br>N/A");
			if(condensedMilestonesList.Occupancy.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Occupancy.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Occupancy.Description);
					$('#contactPOC').html(condensedMilestonesList.Occupancy.POC);
					if(typeof condensedMilestonesList.Occupancy.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.Occupancy.ContactInfo));
					}
				}
				$('#buildingOccupancyStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Occupancy",buildingMilestonesTranslationList)+"<br>"
					+"<u>Started On:</u><br>"+(condensedMilestonesList.Occupancy.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Occupancy.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Occupancy.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus){
					milestoneSkipped[5] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Occupancy",buildingMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#buildingOccupancyStatusLbl').html(statusLbl);
			}
			if(condensedMilestonesList.Inspections.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Inspections.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Inspections.Description);
					$('#contactPOC').html(condensedMilestonesList.Inspections.POC);
					if(typeof condensedMilestonesList.Inspections.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.Inspections.ContactInfo));
					}
				}
				$('#buildingInspectionsStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Inspections",buildingMilestonesTranslationList)+"<br>"
					+"<u>Started On:</u><br>"+(condensedMilestonesList.Inspections.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Inspections.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Inspections.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus){
					milestoneSkipped[4] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Inspections",buildingMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#buildingInspectionsStatusLbl').html(statusLbl);
			}
			if(condensedMilestonesList.Issuance.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.Issuance.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.Issuance.Description);
					$('#contactPOC').html(condensedMilestonesList.Issuance.POC);
					if(typeof condensedMilestonesList.Issuance.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.Issuance.ContactInfo));
					}
				}
				$('#buildingIssuanceStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Issuance",buildingMilestonesTranslationList)+"<br>"
					+"<u>Started On:</u><br>"+(condensedMilestonesList.Issuance.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.Issuance.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.Issuance.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus){
					milestoneSkipped[3] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Issuance",buildingMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#buildingIssuanceStatusLbl').html(statusLbl);
			}
			if(condensedMilestonesList.ZoningReview.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.ZoningReview.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.ZoningReview.Description);
					$('#contactPOC').html(condensedMilestonesList.ZoningReview.POC);
					if(typeof condensedMilestonesList.ZoningReview.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.ZoningReview.ContactInfo));
					}
				}
				$('#buildingZoningReviewStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Zoning Review",buildingMilestonesTranslationList)+"<br>"
					+"<u>Started On:</u><br>"+(condensedMilestonesList.ZoningReview.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.ZoningReview.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.ZoningReview.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus || condensedMilestonesList.Issuance.DisplayStatus){
					milestoneSkipped[2] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Zoning Review",buildingMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#buildingZoningReviewStatusLbl').html(statusLbl);
			}
			if(condensedMilestonesList.ProjectReview.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.ProjectReview.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.ProjectReview.Description);
					$('#contactPOC').html(condensedMilestonesList.ProjectReview.POC);
					if(typeof condensedMilestonesList.ProjectReview.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.ProjectReview.ContactInfo));
					}
				}
				$('#buildingProjectReviewStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Project Review",buildingMilestonesTranslationList)+"<br>"
					+"<u>Started On:</u><br>"+(condensedMilestonesList.ProjectReview.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.ProjectReview.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.ProjectReview.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus|| condensedMilestonesList.Issuance.DisplayStatus || condensedMilestonesList.ZoningReview.DisplayStatus){
					milestoneSkipped[1] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Project Review",buildingMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#buildingProjectReviewStatusLbl').html(statusLbl);
			}
			if(condensedMilestonesList.IntakePayment.DisplayStatus){
				if(currentMilestone === ""){
					currentMilestone = condensedMilestonesList.IntakePayment.DisplayStatus;
					$('#descriptionLbl').html(condensedMilestonesList.IntakePayment.Description);
					$('#contactPOC').html(condensedMilestonesList.IntakePayment.POC);
					if(typeof condensedMilestonesList.IntakePayment.ContactInfo !== 'undefined'){
						$('#contactInfo').html(autoLinker.link(condensedMilestonesList.IntakePayment.ContactInfo));
					}
				}
				$('#buildingIntakePaymentStatusLbl').html("<u>Target Duration:</u><br>"+getDuration("Intake & Payment",buildingMilestonesTranslationList)+"<br>"
					+"<u>Started On:</u><br>"+(condensedMilestonesList.IntakePayment.MilestoneStartDate.getMonth()+1)+"/"+condensedMilestonesList.IntakePayment.MilestoneStartDate.getDate()+"/"+condensedMilestonesList.IntakePayment.MilestoneStartDate.getFullYear());
			} else {
				statusLbl = "";
				if(condensedMilestonesList.Completed.DisplayStatus||condensedMilestonesList.Occupancy.DisplayStatus || condensedMilestonesList.Inspections.DisplayStatus|| condensedMilestonesList.Issuance.DisplayStatus || condensedMilestonesList.ZoningReview.DisplayStatus || condensedMilestonesList.ProjectReview.DisplayStatus){
					milestoneSkipped[0] = "Y";
					statusLbl += "<u>Target Duration:</u><br>N/A<br><u>Started On:</u><br>N/A";
				} else {
					statusLbl += "<u>Target Duration:</u><br>"+getDuration("Intake & Payment",buildingMilestonesTranslationList)+"<br><u>Started On:</u><br>Not Yet Started";
				}
				$('#buildingIntakePaymentStatusLbl').html(statusLbl);
			}
		}
		// console.log('currentMilestone');
		// console.log(currentMilestone);
		// console.log(milestoneSkipped);
	}
	if(currentMilestone===""||currentMilestone===" "){ //if there are no milestones, then display a no progress message
		$('#statusOnDateLbl').html("No progress data is available for Permit #"+permitID+".");
		$('#descriptionLbl').html("");
	} else {
		// Send to a different function for display
		showProgress(permitType,currentMilestone,permitID,milestoneSkipped);
		showReviews(reviewsList);

		// Start filling in the other data elements on the page
		$('#permitInfoText').html(dataElementsList.PermitType.toString());
		//$('#contactPOC').html(dataElementsList.PermitPOCName.toString());
		$('#addressInfo').html(dataElementsList.Address.toString().substring(1,dataElementsList.Address.toString().length)+"<br>"+dataElementsList.City.toString()+", "+dataElementsList.State.toString()+" "+padZipcodeToFive(dataElementsList.Zip.toString()));
		// $('#').html();
		// $('#').html();
		// $('#').html();
	}
$('#load').hide();
}

// since all of the Zip codes near Boston, MA begin with a 0, this function ensures they all retain their leading 0.
function padZipcodeToFive(zipcode) {
 		if (zipcode<=99999) { 
 			zipcode = ("0000"+zipcode).slice(-5); 
 		}
  		return zipcode;
}

function getDuration(displayStatus,milestonesTranslationList){
	var duration = "";
	$.each(milestonesTranslationList, function(key,value){
		if(value.DisplayStatus.toString() === displayStatus){
			duration = value.ExpectedDuration;
		}
	});
	if(duration === ""){
		duration = "N/A";
	}
	return duration;
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
			// Modify the current milestone tile appearance
			$('#buildingIntakePaymentTile').removeClass("tile-progress tile-inactive");
			$('#buildingIntakePaymentTile').addClass("tile-progress tile-active");
			$('#buildingIntakePaymentTile').attr("title","This is the current milestone for this permit.");
			$('#buildingIntakePaymentNumber').attr("src","css/images/1on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#buildingProjectReviewTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingZoningReviewTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingIssuanceTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingInspectionsTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingOccupancyTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone==="Project Review"){
			// Modify the previous milestone tile tooltips
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			}
			// Modify the current milestone tile appearance
			$('#buildingProjectReviewTile').removeClass("tile-progress tile-inactive");
			$('#buildingProjectReviewTile').addClass("tile-progress tile-active");
			$('#buildingProjectReviewTile').attr("title","This is the current milestone for this permit.");
			$('#buildingProjectReviewNumber').attr("src","css/images/2on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#buildingZoningReviewTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingIssuanceTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingInspectionsTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingOccupancyTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone==="Zoning Review"){
			// Modify the previous milestone tile tooltips
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[1]!="Y"){
				$('#buildingProjectReviewTile').attr("title","This permit has already passed this milestone.");
			}
			// Modify the current milestone tile appearance
			$('#buildingZoningReviewTile').removeClass("tile-progress tile-inactive");
			$('#buildingZoningReviewTile').addClass("tile-progress tile-active");
			$('#buildingZoningReviewTile').attr("title","This is the current milestone for this permit.");
			$('#buildingZoningReviewNumber').attr("src","css/images/3on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#buildingIssuanceTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingInspectionsTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingOccupancyTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone === "Issuance"){
			// Modify the previous milestone tile tooltips
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[1]!="Y"){
				$('#buildingProjectReviewTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[2]!="Y"){
				$('#buildingZoningReviewTile').attr("title","This permit has already passed this milestone.");
			}
			// Modify the current milestone tile appearance
			$('#buildingIssuanceTile').removeClass("tile-progress tile-inactive");
			$('#buildingIssuanceTile').addClass("tile-progress tile-active");
			$('#buildingIssuanceTile').attr("title","This is the current milestone for this permit.");
			$('#buildingIssuanceNumber').attr("src","css/images/4on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#buildingInspectionsTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingOccupancyTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone === "Inspections"){
			// Modify the previous milestone tile tooltips
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			}			
			if(milestoneSkipped[1]!="Y"){
				$('#buildingProjectReviewTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[2]!="Y"){
				$('#buildingZoningReviewTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[3]!="Y"){
				$('#buildingIssuanceTile').attr("title","This permit has already passed this milestone.");
			}
			// Modify the current milestone tile appearance
			$('#buildingInspectionsTile').removeClass("tile-progress tile-inactive");
			$('#buildingInspectionsTile').addClass("tile-progress tile-active");
			$('#buildingInspectionsTile').attr("title","This is the current milestone for this permit.");
			$('#buildingInspectionsNumber').attr("src","css/images/5on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#buildingOccupancyTile').attr("title","This permit has not yet reached this milestone.");
			$('#buildingCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone === "Occupancy"){
			// Modify the previous milestone tile tooltips
			if(milestoneSkipped[0]!="Y"){
				$('#buildingIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[1]!="Y"){
				$('#buildingProjectReviewTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[2]!="Y"){
				$('#buildingZoningReviewTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[3]!="Y"){
				$('#buildingIssuanceTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[4]!="Y"){
				$('#buildingInspectionsTile').attr("title","This permit has already passed this milestone.");
			}
			// Modify the current milestone tile appearance
			$('#buildingOccupancyTile').removeClass("tile-progress tile-inactive");
			$('#buildingOccupancyTile').addClass("tile-progress tile-active");
			$('#buildingOccupancyTile').attr("title","This is the current milestone for this permit.");
			$('#buildingOccupancyNumber').attr("src","css/images/6on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#buildingCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone === "Revoked" || currentMilestone === "Abandoned" || currentMilestone === "Completed"){
			// Modify the previous milestone tile tooltips
			$('#buildingIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			$('#buildingProjectReviewTile').attr("title","This permit has already passed this milestone.");
			$('#buildingZoningReviewTile').attr("title","This permit has already passed this milestone.");
			$('#buildingIssuanceTile').attr("title","This permit has already passed this milestone.");
			$('#buildingInspectionsTile').attr("title","This permit has already passed this milestone.");
			$('#buildingOccupancyTile').attr("title","This permit has already passed this milestone.");
			// Modify the current milestone tile appearance
			$('#buildingCompletedTile').removeClass("tile-progress tile-inactive");
			$('#buildingCompletedTile').addClass("tile-progress tile-active");
			$('#buildingCompletedTile').attr("title","This permit has already passed this milestone.");
			$('#buildingCompletedNumber').attr("src","css/images/7on.png");

		}		
	}
	// For Fire permits
	if(permitType === "Fire"){
		//console.log(currentMilestone);
		if(currentMilestone==="Intake & Payment"){
			// Modify the current milestone tile appearance
			$('#fireIntakePaymentTile').removeClass("tile-progress tile-inactive");
			$('#fireIntakePaymentTile').addClass("tile-progress tile-active");
			$('#fireIntakePaymentTile').attr("title","This is the current milestone for this permit.");
			$('#fireIntakePaymentNumber').attr("src","css/images/1on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#firePermitReviewTile').attr("title","This permit has not yet reached this milestone.");
			$('#fireIssuanceTile').attr("title","This permit has not yet reached this milestone.");
			$('#fireInspectionsTile').attr("title","This permit has not yet reached this milestone.");
			$('#fireCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone==="Permit Review"){
			// Modify the previous milestone tile tooltip
			if(milestoneSkipped[0]!="Y"){
				$('#fireIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			}
			// Modify the current milestone tile appearance
			$('#firePermitReviewTile').removeClass("tile-progress tile-inactive");
			$('#firePermitReviewTile').addClass("tile-progress tile-active");
			$('#firePermitReviewTile').attr("title","This is the current milestone for this permit.");
			$('#firePermitReviewNumber').attr("src","css/images/2on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#fireIssuanceTile').attr("title","This permit has not yet reached this milestone.");
			$('#fireInspectionsTile').attr("title","This permit has not yet reached this milestone.");
			$('#fireCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone === "Issuance"){
			// Modify the previous milestone tile tooltips
			if(milestoneSkipped[0]!="Y"){
				$('#fireIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			}			
			if(milestoneSkipped[1]!="Y"){
				$('#firePermitReviewTile').attr("title","This permit has already passed this milestone.");
			}
			// Modify the current milestone tile appearance
			$('#fireIssuanceTile').removeClass("tile-progress tile-inactive");
			$('#fireIssuanceTile').addClass("tile-progress tile-active");
			$('#fireIssuanceTile').attr("title","This is the current milestone for this permit.");
			$('#fireIssuanceNumber').attr("src","css/images/3on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#fireInspectionsTile').attr("title","This permit has not yet reached this milestone.");
			$('#fireCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone === "Inspections"){
			// Modify the previous milestone tile tooltips
			if(milestoneSkipped[0]!="Y"){
				$('#fireIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[1]!="Y"){
				$('#firePermitReviewTile').attr("title","This permit has already passed this milestone.");
			}
			if(milestoneSkipped[2]!="Y"){
				$('#fireIssuanceTile').attr("title","This permit has already passed this milestone.");
			}
			// Modify the current milestone tile appearance
			$('#fireInspectionsTile').removeClass("tile-progress tile-inactive");
			$('#fireInspectionsTile').addClass("tile-progress tile-active");
			$('#fireInspectionsTile').attr("title","This is the current milestone for this permit.");
			$('#fireInspectionsNumber').attr("src","css/images/4on.png");
			// Modify the tooltips for the subsequent milestone tiles
			$('#fireCompletedTile').attr("title","This permit has not yet reached this milestone.");
		}
		if(currentMilestone === "Revoked" || currentMilestone === "Abandoned" || currentMilestone === "Completed"){
			// Modify the previous milestone tile tooltips
			$('#fireIntakePaymentTile').attr("title","This permit has already passed this milestone.");
			$('#firePermitReviewTile').attr("title","This permit has already passed this milestone.");
			$('#fireIssuanceTile').attr("title","This permit has already passed this milestone.");
			$('#fireInspectionsTile').attr("title","This permit has already passed this milestone.");			
			// Modify the current milestone tile appearance
			$('#fireCompletedTile').removeClass("tile-progress tile-inactive");
			$('#fireCompletedTile').addClass("tile-progress tile-active");
			$('#fireCompletedTile').attr("title","This permit has already passed this milestone.");
			$('#fireCompletedNumber').attr("src","css/images/5on.png");
		}		
	} else {
		console.log('Invalid Permit Type submitted.');
	}
}