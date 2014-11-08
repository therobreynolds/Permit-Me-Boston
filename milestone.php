<?php
header("Access-Control-Allow-Origin: *");
ini_set('memory_limit', '512M');
 



$number = stripslashes($_GET['number']);
if(!empty($number)) {
       $filename = 'MilestoneExport.csv';
       $contents = file($filename);
$milestoneExportArray = array ();
$count = 0;
       foreach($contents as $line) {
               $arrayLine = explode(",", $line);
               

               if($number == $arrayLine[0]) {
                 
                      $milestoneExportArray[$count] = 
                      array (
                         "PermitNumber" => $arrayLine[0],
                        "MilestoneName" => $arrayLine[1],
                        "MilestoneStartDate" => $arrayLine[2],
                        "AverageDurationOfMilestone" => $arrayLine[3],
                        "CityContactName" => $arrayLine[4],
                        // "Zip" => $arrayLine[7],
                        // "Permit POC Name" => $arrayLine[8],
                        );
                      $count++;
                     


                       
               }
               
       } echo json_encode($milestoneExportArray);
} else {
       echo "Please supply a number";
}
?>