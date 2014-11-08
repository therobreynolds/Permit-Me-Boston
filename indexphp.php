 <!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>PHP Permit Tracker 9000</title>
	<meta name="viewport" content="width=device-width">
	<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Lobster+Two" type="text/css">
	<link rel="icon" href="https://awsmedia.s3.amazonaws.com/favicon.ico" type="image/ico" >
	<link rel="shortcut icon" href="https://awsmedia.s3.amazonaws.com/favicon.ico" type="image/ico" >
	<![if IE]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]
	<link rel="stylesheet" href="styles.css" type="text/css">
</head>
<body>


<form action="index.php" method="get">
   <label for="number">Record Number:</label>
       <input type="text" name="number" id="number" />
   <input type="submit" value="Submit" />
</form>

<br />
<br />
 
<?php
header("Access-Control-Allow-Origin: *");



$number = $_GET['number'];

if(!empty($number)) {
       $filename = 'ExportData.csv';
       $contents = file($filename);

       foreach($contents as $line) {
               $arrayLine = explode(",", $line);
               if($number == $arrayLine[0]) {
                
             
                       echo ($line) . "\n";
                       break;
               }
       }
} else {
       echo "Please supply a number";
}

?>

</body>
</html>
