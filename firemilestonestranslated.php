<?php
header("Access-Control-Allow-Origin: *");
ini_set('memory_limit', '512M');
 



$number = stripslashes($_GET['number']);
if(!empty($number)) {
       $filename = 'Fire Milestones Tranlsation Table.csv';
       $contents = file($filename);
$reviewExportArray = array ();
$count = 0;
       foreach($contents as $line) {
               $arrayLine = explode(",", $line);
               

               
                 
                      $reviewExportArray[$count] = 
                      array (
                        "Milestones" => $arrayLine[0],
                        "DisplayStatus" => $arrayLine[1],
                        "Description" => $arrayLine[2],
                        "ExpectedDuration" => $arrayLine[3],
                        "ContactInstructions" => $arrayLine[4],
                      
                        );
                      $count++;
                     


                       
               
               
       } echo json_encode($reviewExportArray);
} else {
       echo "Please supply a number";
}
?>