<?php
header("Access-Control-Allow-Origin: *");

 ini_set('memory_limit', '512M');



$number = stripslashes($_GET['number']);
if(!empty($number)) {
       $filename = 'ExportData.csv';
       $contents = file($filename);

       foreach($contents as $line) {
               $arrayLine = explode(",", $line);
               if($number == $arrayLine[0]) {
                      $exportDataArray = array (
                        "PermitNumber" => $arrayLine[0],
                        "BuildingOrFire" => $arrayLine[1],
                        "PermitType" => $arrayLine[2],
                        "Address" => $arrayLine[3],
                        //"City" => $arrayLine[4],
                        "City" => $arrayLine[5],
                        "State" => $arrayLine[6],
                        "Zip" => $arrayLine[7],
                        "PermitPOCName" => $arrayLine[8],
                        );
                       echo json_encode($exportDataArray) . "\n";

                       break;
               }
       }
} else {
       echo "Please supply a number";
}

?>
