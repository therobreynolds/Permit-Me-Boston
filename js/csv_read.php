<?php

$number = $_GET['number'];

if(!empty($number)) {
      $filename = 'ExportData.csv';
      $contents = file($filename);

      foreach($contents as $line) {
              $arrayLine = explode(",", $line);
              if($number == $arrayLine[0]) {
                      echo $line . "\n";
                      break;
              }
      }
} else {
      echo "Please supply a number";
}

?>