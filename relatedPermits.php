<?php
header("Access-Control-Allow-Origin: *");

 ini_set('memory_limit', '512M');


$address = "";
$number = stripslashes($_GET['number']);
$relatedPermitsArray = new Array();
if(!empty($number)) {
       $filename = 'ExportData.csv';
       $contents = file($filename);

       foreach($contents as $line) {
              $arrayLine = explode(",", $line);
              if($number == $arrayLine[0]) {
                  $address = $arrayLine[3];
                  break;
               }
       }
       $count = 0;
       foreach ($contents as $line) {
              $arrayLine = explode(",", $line);
              if($address == $arrayLine[3]) {
                  $relatedPermitsArray[$count] = $arrayLine[0];
                  $count++;
               }
       }
       echo json_encode($relatedPermitsArray);
} else {
       echo "Please supply a number";
}

?>
