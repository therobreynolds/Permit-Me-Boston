<?php
header("Access-Control-Allow-Origin: *");
ini_set('memory_limit', '512M');
 



$number = stripslashes($_GET['number']);
if(!empty($number)) {
       $filename = 'ReviewExport.csv';
       $contents = file($filename);
$reviewExportArray = array ();
$count = 0;
       foreach($contents as $line) {
               $arrayLine = explode(",", $line);
               

               if($number == $arrayLine[0]) {
                 
                      $reviewExportArray[$count] = 
                      array (
                        "PermitNumber" => $arrayLine[0],
                        "ReviewType" => $arrayLine[1],
                        "ReviewerName" => $arrayLine[2],
                        "IsAssignedFlag" => $arrayLine[3],
                        "IsStartedFlag" => $arrayLine[4],
                        "IsCompleteFlag" => $arrayLine[5],
                        "ReviewStatus" => $arrayLine[6],
                        // "Zip" => $arrayLine[7],
                        // "Permit POC Name" => $arrayLine[8],
                        );
                      $count++;
                     


                       
               }
               
       } echo json_encode($reviewExportArray);
} else {
       echo "Please supply a number";
}
?>