<?php

echo "test";

require_once("socrata.php");
$socrata = new Socrata("http://data.cityofboston.gov/api");



$VIOLATIONS_10 = array(100,200,350,450,550,740,975,1410,2225,23475);

for($i = 1; $i < 351072; $i++) {

	$con = mysqli_connect("10.241.110.44", "studenthousing", "B3tterLiving!", "studenthousing");

if ( mysqli_connect_errno() ) {
		echo "Could not connect";
		exit();
}

	$query = "property_id = '$i'";


	$params = array("\$where" => $query);

	$response = $socrata->get("/resource/8sq6-p7et.json", $params);	

	$SUM_RATING = 0;

	foreach ($response as $item) {
		$string = $item['description'];

		$query = "SELECT * FROM violations WHERE
			  short= '$string'";

		if ( $stmt = mysqli_query( $con, $query ) ) {

			$row = mysqli_fetch_array( $stmt );

			$proper = $row['proper'];
			$cat = $row['category'];
			$rat = $row['rating'];

			if (is_null($proper) ||
				is_null($cat) ||
				is_null($rat)) {}
			else { $SUM_RATING += $rat; }
		}

	}

	

	$VIOLA_SCORE = 10;

	if($SUM_RATING <= $VIOLATIONS_10[0]) { $VIOLA_SCORE = 10; }
    else if($SUM_RATING < $VIOLATIONS_10[9]) {
        for($j = 1; $j <= 9; $j++) {
            if($SUM_RATING < $VIOLATIONS_10[$j]) {
                $VIOLA_SCORE = (10-$j) + (($VIOLATIONS_10[$j]-$SUM_RATING)/(($VIOLATIONS_10[$j]-$VIOLATIONS_10[$j-1])));
                break;
            }
                    
        }
                
    } else {
        $VIOLA_SCORE = 0.0;
    }

    if($VIOLA_SCORE == 10) {

    } else {
	
    mysqli_query($con1, "INSERT INTO violaById
								VALUES ('$i', '$VIOLA_SCORE')");

	}

	

    echo $i;

    mysqli_close($con1);

}



?>