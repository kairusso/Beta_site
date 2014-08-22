<?php
require_once("socrata.php");
$socrata = new Socrata("http://data.cityofboston.gov/api");


if(isset($_POST['address'], $_POST['zip'])) {
	
	
	$suffixTakeOut = array("ST", "Street", "AV", "Ave", "Avenue", "RD", "Road", "Ter", "TE", "Terrace", "PL", "Place", 
	"SQ", "Square", "CT", "Court", "PK", "Park", "HW", "Highway", "DR", "Drive", "Wy", "Way", "Blvd", "BL", "Boulevard", 
	"Pkwy", "PW", "Parkway","Cir", "CI", "Circle", "Ln", "LA", "Lane", "Cres", "CC", "Crescent","Grn", "GR", "Green","Plz", "PZ", "Plaza", "RO", "Row", 
	"Wh", "Wharf", "Ts", "Xt", "Ext", "Brg", "BR", "bridge");

	/*   	DO NOT UNCOMMENT !!!!!!!!!!!!!!!!!
	$suffixPutIn = array("St", "St", "Ave", "Ave", "Ave", "Rd", "Rd", "Ter", "Ter", "Ter", "Pl", "Pl", 
	"Sq", "Sq", "Ct", "Ct", "Park", "Park", "Hwy", "Hwy", "Dr", "Dr", "Way", "Way", "Blvd", "Blvd", "Blvd", 
	"Pkwy", "Pkwy","Pkwy", "Cir", "Cir", "Cir", "Ln", "Ln", "Ln","Cres", "Cres", "Cres", "Grn", "Grn", "Grn","Plz" "Plz", "Plz", "Row", "Row", 
	"Wharf", "Wharf", "Ts", "Ext", "Ext", "Brg", "BR", "bridge");

	$stateTakeOut = array("MA", "mass", "massachusetts");

	$neighbourhoodTakeOut = array("Charlestown","Waterfront","South Boston","South Boston Waterfront","Dorchester","Allston","Brighton",
		"East Boston","Hyde Park","Jamaica Plain","West Roxbury","Downtown","Financial District","Roslindale","Beacon Hill","Roxbury",
		"Mattapan", "Greater Mattapan", "South End", "Fenway", "Kenmore", "Audubon Circle", "Longwood", "Back Bay", "Mission Hill","boston");

	$zipForAddress = array("02135","02134","02215","02467","02445","02111","02446","02114","02116","02115","02132","02131","02130",
		"02127","02136","02126","02137","02124","02125","02122","02121","02119","02118","02090","02199","02120","02112","02210","02110",
		"02109","02108","02133","02113","02201","02129","02128","2135","2134","2215","2467","2445","2111","2446","2114","2116","2115",
		"2132","2131","2130","2127","2136","2126","2137","2124","2125","2122","2121","2119","2118","2090","2199","2120","2112","2210","2110",
		"2109","2108","2133","2113","2201","2129","2128");*/
	
	$address = $_POST['address'];
	$zip = $_POST['zip'];
	$pieces = explode(' ', $address);



	$streetName = '';
	$suffixNotThere = true;
	
	for($i = 2; $i < count($pieces); $i++) {
		foreach($suffixTakeOut as $item) {
			if(strcasecmp($var1, $var2) == 0) {
				$suffixNotThere = false;
				$streetName = $pieces[1];
				for($j = 2; $j < $i; $j++) $streetName = $streetName . ' ' . $pieces[$j];
			}
		}
	}
	if($suffixNotThere) {
		$streetName = $pieces[1];
		for($j = 2; $j < count($pieces); $j++) {
			$streetName = $streetName . ' ' . $pieces[$j];
		}
	}

	if(strlen($zip) == 5) {
		$zipMySQL = substr($zip, 1, 4);
	} else { $zipMySQL = $zip; }

	if(strlen($zip) == 4) {
		$zipViola = "0" . $zip;
	} else { $zipViola = $zip; }

	


	$snum = $pieces[0];
	$sname = $streetName;
}

/*
$snum = 1130;
$sname = "commonwealth";
$zipViola = "02134";
$zipMySQL = "2134";
*/

$conMain = mysqli_connect("10.241.110.44", "studenthousing", "B3tterLiving!", "studenthousing");

//Go into the Master address list (seperated by ZIP) and extract the LAT, LONG and PARCEL ID for the address



	if($zipMySQL < 2118) {$query = "SELECT * FROM under2118 WHERE
			  StreetName = '$sname' AND (StreetLow = '$snum' OR (StreetLow <= '$snum' AND StreetHigh >= '$snum')) AND ZipCode = '$zipMySQL'";}
	else if($zipMySQL < 2122) {$query = "SELECT * FROM under2122 WHERE
			  StreetName = '$sname' AND (StreetLow = '$snum' OR (StreetLow <= '$snum' AND StreetHigh >= '$snum')) AND ZipCode = '$zipMySQL'";}
	else if($zipMySQL < 2126) {$query = "SELECT * FROM under2126 WHERE
			  StreetName = '$sname' AND (StreetLow = '$snum' OR (StreetLow <= '$snum' AND StreetHigh >= '$snum')) AND ZipCode = '$zipMySQL'";}
	else if($zipMySQL < 2128) {$query = "SELECT * FROM under2128 WHERE
			  StreetName = '$sname' AND (StreetLow = '$snum' OR (StreetLow <= '$snum' AND StreetHigh >= '$snum')) AND ZipCode = '$zipMySQL'";}
	else if($zipMySQL < 2131) {$query = "SELECT * FROM under2131 WHERE
			  StreetName = '$sname' AND (StreetLow = '$snum' OR (StreetLow <= '$snum' AND StreetHigh >= '$snum')) AND ZipCode = '$zipMySQL'";}
	else if($zipMySQL < 2135) {$query = "SELECT * FROM under2135 WHERE
			  StreetName = '$sname' AND (StreetLow = '$snum' OR (StreetLow <= '$snum' AND StreetHigh >= '$snum')) AND ZipCode = '$zipMySQL'";}
	else {$query = "SELECT * FROM over2135 WHERE
			  StreetName = '$sname' AND (StreetLow = '$snum' OR (StreetLow <= '$snum' AND StreetHigh >= '$snum')) AND ZipCode = '$zipMySQL'";}


$LATITUDE;
$LONGITUDE;
$PARCEL_ID;
$OWNER;
$ROOMS;

if ( $stmt = mysqli_query( $conMain, $query ) ) {

			global $LATITUDE, $LONGITUDE, $PARCEL_ID;

			$row = mysqli_fetch_array( $stmt );
			$LATITUDE = $row['LAT'];
			$LONGITUDE = $row['LONG'];
			$PARCEL_ID = $row['ParcelId'];


}

// Now that we have the PArcel ID go through our buildingbyfines data in order to see how many rooms the building has in order to weigh the avg

$queryByParcel = "SELECT * FROM buildingbyfines WHERE
			  ParcelId = '$PARCEL_ID'";

if ( $stmt = mysqli_query( $conMain, $queryByParcel ) ) {

			global $ROOMS;

			$row = mysqli_fetch_array( $stmt );
			$ROOMS = $row['Rooms'];
}


// Now that we have the PArcel ID go into the database IDandOwner to get the owner of the Parcel

$queryIdOwner = "SELECT * FROM idandowner WHERE
			  Parcel_ID = '$PARCEL_ID'";


if ( $stmt = mysqli_query( $conMain, $queryIdOwner ) ) {

			global $OWNER;

			$row = mysqli_fetch_array( $stmt );
			$OWNER = $row['OWNER'];
}

// Now that we have the owner go through our buildingbyfines data in order to see how his other properties stack up

$queryByOwner = "SELECT * FROM buildingbyfines WHERE
			  Owner = '$OWNER'";

$OWNER_ARRAY = array();


if ( $stmt = mysqli_query( $conMain, $queryByOwner ) ) {

			global $OWNER_ARRAY;
			global $OWNER;

			while($row = mysqli_fetch_array( $stmt )) { 
				

				$tempOwner = new ownerObject($row['ParcelId'], "", $row['FineAVG'], $OWNER);
				array_push($OWNER_ARRAY,  $tempOwner);

			}
			

} 

foreach ($OWNER_ARRAY as $item) {

	$currentP = $item->parcel;

	$address = "";

	$testBoolean = true;


	if($testBoolean) {
	$queryThroughAllAddresses = "SELECT * FROM under2118 WHERE
			  ParcelId = '$currentP'";

	if ( $stmt = mysqli_query( $conMain, $queryThroughAllAddresses ) ) {

			$row = mysqli_fetch_array( $stmt );

			if(is_null($row['StreetName'])) {
			} else {

				$item->add = $row['StreetLow'] . ' ' . $row['StreetName'] . ", " . $row['Neighbourhood'] . ' ' . $row['ZipCode'];
				$testBoolean = false;
				//break;
			}
	}
	}


	if($testBoolean) {
	$queryThroughAllAddresses = "SELECT * FROM under2122 WHERE
			  ParcelId = '$currentP'";

	if ( $stmt = mysqli_query( $conMain, $queryThroughAllAddresses ) ) {

			$row = mysqli_fetch_array( $stmt );
			if(is_null($row['StreetName'])) {
			} else {
				$item->add = $row['StreetLow'] . ' ' . $row['StreetName'] . ", " . $row['Neighbourhood'] . ' ' . $row['ZipCode'];
				$testBoolean = false;
				//break;
			}
	}
	}

	if($testBoolean) {
	$queryThroughAllAddresses = "SELECT * FROM under2126 WHERE
			  ParcelId = '$currentP'";

	if ( $stmt = mysqli_query( $conMain, $queryThroughAllAddresses ) ) {

			$row = mysqli_fetch_array( $stmt );
			if(is_null($row['StreetName'])) {
			} else {
				$item->add = $row['StreetLow'] . ' ' . $row['StreetName'] . ", " . $row['Neighbourhood'] . ' ' . $row['ZipCode'];
				$testBoolean = false;
				//break;
			}
	}
	}

	if($testBoolean) {
	$queryThroughAllAddresses = "SELECT * FROM under2128 WHERE
			  ParcelId = '$currentP'";

	if ( $stmt = mysqli_query( $conMain, $queryThroughAllAddresses ) ) {

			$row = mysqli_fetch_array( $stmt );
			if(is_null($row['StreetName'])) {
			} else {
				$item->add = $row['StreetLow'] . ' ' . $row['StreetName'] . ", " . $row['Neighbourhood'] . ' ' . $row['ZipCode'];
				$testBoolean = false;
				//break;
			}
	}
	}

	if($testBoolean) {
	$queryThroughAllAddresses = "SELECT * FROM under2131 WHERE
			  ParcelId = '$currentP'";

	if ( $stmt = mysqli_query( $conMain, $queryThroughAllAddresses ) ) {

			$row = mysqli_fetch_array( $stmt );
			if(is_null($row['StreetName'])) {
			} else {
				$item->add = $row['StreetLow'] . ' ' . $row['StreetName'] . ", " . $row['Neighbourhood'] . ' ' . $row['ZipCode'];
				$testBoolean = false;
				//break;
			}
	}
	}

	if($testBoolean) {
	$queryThroughAllAddresses = "SELECT * FROM under2135 WHERE
			  ParcelId = '$currentP'";

	if ( $stmt = mysqli_query( $conMain, $queryThroughAllAddresses ) ) {

			$row = mysqli_fetch_array( $stmt );
			if(is_null($row['StreetName'])) {
			} else {
				$item->add = $row['StreetLow'] . ' ' . $row['StreetName'] . ", " . $row['Neighbourhood'] . ' ' . $row['ZipCode'];
				$testBoolean = false;
				//break;
			}
	}

	}


	if($testBoolean) {
	$queryThroughAllAddresses = "SELECT * FROM over2135 WHERE
			  ParcelId = '$currentP'";

	if ( $stmt = mysqli_query( $conMain, $queryThroughAllAddresses ) ) {

			$row = mysqli_fetch_array( $stmt );
			if(is_null($row['StreetName'])) {
			} else {
				$item->add = $row['StreetLow'] . ' ' . $row['StreetName'] . ", " . $row['Neighbourhood'] . ' ' . $row['ZipCode'];
				$testBoolean = false;
				//break;
			}
	}
 	}

}


//Check for doubles 
/*
foreach ($OWNER_ARRAY as $item) {
	global $OWNER_ARRAY;

	for ($i = 0; $i < sizeof($OWNER_ARRAY); $i++) {
		if($item->add === $OWNER_ARRAY[i]) {
			unset($OWNER_ARRAY[i]);
			$OWNER_ARRAY = array_values($OWNER_ARRAY);
			var_dump($OWNER_ARRAY);
		} 
	}
}
*/


class ownerObject {
	public $parcel;
	public $add;
	public $fineAVG;
	public $owner;

	public function __construct($parcel, $add, $FineAVG, $owner) {
		$this->parcel = $parcel;
		$this->add = $add;
		$this->fineAVG = $FineAVG;
		$this->owner = $owner;
	}
}

mysqli_close($conMain);



$query = "street = '$sname' AND (stno = '$snum' OR (stno <= '$snum' AND sthigh >= '$snum')) AND zip = '$zipViola'";


$params = array("\$where" => $query);

$response = $socrata->get("/resource/8sq6-p7et.json", $params);

///Year Class
//
class Year {

	public $name;
	public $loInc;

	public function __construct($name, $loInc) {
		$this->name = $name;
		$this->loInc = $loInc;
	}

	public function __toString() {
		return "Year: " . $this->name . $this->listToString();
	}

	public function listToString() {

		$result = '';

		foreach ($this->loInc as $value) {
			 $result = $result . ' ' . $value;
		}

		return $result;
	}

	//add an incident to a particular year's incident list
	public function addInc($inc) {
		$placed = false;

		foreach ($this->loInc as $value) {
			if ($inc->desc === $value->desc) {
				$value->incFreq();
				$placed = true;
			}
		}

		if ($placed === false) {
			array_push($this->loInc, $inc);
		}
	}
}

///Incident Class
//
class Incident {

	public $freq;
	public $desc;
	public $cat;
	public $rat;

	public function __construct($freq, $desc, $cat, $rat) {
		$this->freq = $freq;
		$this->desc = $desc;
		$this->cat  = $cat;
		$this->rat  = $rat;
	}

	public function __toString() {
		return $this->freq . ' ' . $this->desc . ' ' . $this->cat;
	}

	//increase the frequency by 1
	public function incFreq() {
		$this->freq = $this->freq + 1;
	}
}


///return a new Incident with the correct labels
//
function relabel($string, $value) {
	$con = mysqli_connect("10.241.110.44", "studenthousing", "B3tterLiving!", "studenthousing");

	$query = "SELECT * FROM violations WHERE
			  short= '$string'";

	if ( $stmt = mysqli_query( $con, $query ) ) {

			$row = mysqli_fetch_array( $stmt );

			$proper = $row['proper'];
			$cat = $row['category'];

			if($value == "N/A") $rat = $row['rating'];
			else $rat = $value;

			global $ROOMS;

			$rat = $rat/$ROOMS;

			if (is_null($proper) ||
				is_null($cat) ||
				is_null($rat)) {
				return new Incident(1, "Other", "Other", 0);
			}
			else { return new Incident(1, $proper, $cat, $rat); }
	}

	mysqli_close($con);
}

function parseJson($response) {
	$result['list'] = array();

	$result['address'] = getAddress($response[0]);

	foreach ($response as $item) {
		$year = substr($item['status_dttm'], 0, 4);
		$placed = false;

		foreach ($result['list'] as $a) {
			if ($a->name === $year) {
				$a->addInc(relabel($item['description'], $item['value']));
				$placed = true;
			}
		}

		if (!$placed) {
			array_push($result['list'], new Year($year, array(relabel($item['description'], $item['value']))));
		}
	}
	
	$cell = $response[0];
	
	$lat = $cell['latitude'];
	$lng = $cell['longitude'];

	global $LATITUDE, $LONGITUDE, $OWNER_ARRAY;

	$tripleArray = fire($LATITUDE, $LONGITUDE);
	//$tripleArray = fire($lat, $lng);
	
	$result['crime'] = $tripleArray[0];
	$result['crimeDates'] = $tripleArray[1];
	$result['crimeTimes'] = $tripleArray[2];
	$result['noise'] = $tripleArray[3];
	$result['noiseDates'] = $tripleArray[4];
	$result['noiseTimes'] = $tripleArray[5];
	$result['hotline'] = $tripleArray[6];
	$result['hotlineDates'] = $tripleArray[7];
	$result['hotlineTimes'] = $tripleArray[8];
	$result['owner'] = $OWNER_ARRAY;
	
	echo json_encode($result);
}

function getAddress($cell) {
	if (isset($cell['sthigh'])) {
		return $cell['stno'].'-'.$cell['sthigh'].' '.$cell['street'].' '.strtolower($cell['suffix'])
		.' '.$cell['city'].' '.$cell['zip'];
	}
		return $cell['stno'].' '.$cell['street'].' '.strtolower($cell['suffix'])
		.' '.$cell['city'].' '.$cell['zip'];
}

function tester() {
	$result = array();
	array_push($result, new Year(2013, array()));

	echo "Compiled!";

	echo '</br></br>';

	$inc0 = new Incident(2, 'trash', 'cleanliness');
	$inc1 = new Incident(3, 'hole', 'cleanliness');
	echo $inc0->__toString();
	$inc0->incFreq();
	echo $inc0->__toString();

	echo '</br>';

	$array = array();
	array_push($array, $inc0);
	array_push($array, $inc1);

	$year0 = new Year(2014, $array);
	echo $year0->__toString();
	$inc2 = new Incident(4, 'holes', 'man');
	$year0->addInc($inc2);
	echo '</br>';
	echo $year0->__toString();
	echo '</br>';
}

parseJson($response);

//--------------------------------------//------------------------------//--------------------//---------//----//--//- 
 
function fire($lat, $lng) {

	$year = date("Y")-1;
	$month = date("m");
	$day = date("d");

	//echo $year.' '.$month.' '.$day.'</br>';

	$socrata2 = new Socrata("http://data.cityofboston.gov/api");
	
	$query2 = "within_circle(location, $lat, $lng, 215) AND fromdate>='$year-$month-$day'";
	$params2 = array("\$where" => $query2);
	$response2 = $socrata2->get("/resource/7cdf-6fgx.json", $params2);
	
	$query3 = "within_circle(geocoded_location, $lat, $lng, 215) AND open_dt>='$year-$month-$day'";
	$params3 = array("\$where" => $query3);
	$response3 = $socrata2->get("/resource/awu8-dc52.json", $params3);

	//echo json_encode($response2).'</br>';
	//echo json_encode($response3).'</br>';
	
	$crimeCategoryArray = array();
	$crimeDateArray = array();
	$crimeTimeArray = array();
	
	$noiseCategoryArray = array();
	$noiseDateArray = array();
	$noiseTimeArray = array();
	
	$hotlineCategoryArray = array();
	$hotlineDateArray = array();
	$hotlineTimeArray = array();
	
	foreach($response2 as $item) {
		$temp = relabelCrime($item['incident_type_description'], $item['fromdate']);
		
		if($temp == null) {  }
		elseif ($temp->cat == "Noise/Disturbance") {

			$test = true;
			foreach($noiseCategoryArray as $cat) {
				if($cat->cat == $temp->proper) {
					$cat->incFreq();
					$cat->addToRat($temp->rat);
					$test = false;
					$test2 = true;
					$test3 = true;
					foreach($noiseDateArray as $dateTime) {
						if($dateTime->time == $temp->date) {
							$dateTime->incFreq();
							$test2 = false;
						}
					}
					if($test2) {
						$tempDate = new timeDate(1, $temp->date);
						array_push($noiseDateArray,  $tempDate);
					}
					foreach($noiseTimeArray as $dateTime) {
						if($dateTime->time == $temp->time) {
							$dateTime->incFreq();
							$test3 = false;
						}
					}
					if($test3) {
						$tempTime = new timeDate(1, $temp->time);
						array_push($noiseTimeArray,  $tempTime);
					}
					
				}
			}
			if($test) { 
				$tempN = new crimeIncident(1, "", $temp->proper, $temp->rat);
				array_push($noiseCategoryArray, $tempN);
			}

		} else {
			
			$test = true;
			foreach($crimeCategoryArray as $cat) {
				if($cat->cat == $temp->cat) {
					$cat->incFreq();
					$cat->addToRat($temp->rat);
					$test = false;
					$test2 = true;
					$test3 = true;
					foreach($crimeDateArray as $dateTime) {
						if($dateTime->time == $temp->date) {
							$dateTime->incFreq();
							$test2 = false;
						}
					}
					if($test2) {
						$tempDate = new timeDate(1, $temp->date);
						array_push($crimeDateArray,  $tempDate);
					}
					foreach($crimeTimeArray as $dateTime) {
						if($dateTime->time == $temp->time) {
							$dateTime->incFreq();
							$test3 = false;
						}
					}
					if($test3) {
						$tempTime = new timeDate(1, $temp->time);
						array_push($crimeTimeArray,  $tempTime);
					}
				}
			}
			if($test) {
				$tempC = new crimeIncident(1, "", $temp->cat, $temp->rat);
				array_push($crimeCategoryArray, $tempC);
			}

		}
	}
	
	foreach($response3 as $item) {
		$temp = relabelNoise($item['case_title'], $item['open_dt']);
		
		if($temp == null) { }
		elseif ($temp->cat == "Noise/Disturbance") {
			
			$test = true;
			foreach($noiseCategoryArray as $cat) {
				if($cat->cat == $temp->proper) {
					$cat->incFreq();
					$cat->addToRat($temp->rat);
					$test = false;

					$test2 = true;
					$test3 = true;
					foreach($noiseDateArray as $dateTime) {
						if($dateTime->time == $temp->date) {
							$dateTime->incFreq();
							$test2 = false;
						}
					}
					if($test2) {
						$tempDate = new timeDate(1, $temp->date);
						array_push($noiseDateArray,  $tempDate);
					}

					foreach($noiseTimeArray as $dateTime) {
						if($dateTime->time == $temp->time) {
							$dateTime->incFreq();
							$test3 = false;
						}
					}
					if($test3) {
						$tempTime = new timeDate(1, $temp->time);
						array_push($noiseTimeArray,  $tempTime);
					}
				}
			}
			if($test) { 
				$tempN = new crimeIncident(1, "", $temp->proper, $temp->rat);
				array_push($noiseCategoryArray, $tempN);
			}

		} else {
			
			$test = true;
			foreach($hotlineCategoryArray as $cat) {
				if($cat->cat == $temp->cat) {
					$cat->incFreq();
					$cat->addToRat($temp->rat);
					$test = false;
					$test2 = true;
					$test3 = true;
					foreach($hotlineDateArray as $dateTime) {
						if($dateTime->time == $temp->date) {
							$dateTime->incFreq();
							$test2 = false;
						}
					}
					if($test2) {
						$tempDate = new timeDate(1, $temp->date);
						array_push($hotlineDateArray,  $tempDate);
					}
					foreach($hotlineTimeArray as $dateTime) {
						if($dateTime->time == $temp->time) {
							$dateTime->incFreq();
							$test3 = false;
						}
					}
					if($test3) {
						$tempTime = new timeDate(1, $temp->time);
						array_push($hotlineTimeArray,  $tempTime);
					}
				}
			}
			if($test) { 
				$tempH = new crimeIncident(1, "", $temp->cat, $temp->rat);
				array_push($hotlineCategoryArray, $tempH);
			}
		}
	}
	
	$tripleArray = array($crimeCategoryArray, $crimeDateArray, $crimeTimeArray, $noiseCategoryArray, $noiseDateArray, $noiseTimeArray, 
		$hotlineCategoryArray, $hotlineDateArray, $hotlineTimeArray);
	
	return $tripleArray;
}




function relabelCrime($string, $date) {
	$con = mysqli_connect("10.241.110.44", "studenthousing", "B3tterLiving!", "studenthousing");

	$query = "SELECT * FROM crimes WHERE
			  name = '$string'";

	if ( $stmt = mysqli_query( $con, $query ) ) {

			$row = mysqli_fetch_array( $stmt );
			$proper = $row['proper'];
			$cat = $row['category'];
			$rat = $row['value'];
			$pieces = explode('T', $date);
			$restD = substr($pieces[0], 0, 4) . "-" . substr($pieces[0], 5, 2);
			$restT = substr($pieces[1], 0, 2);

			if (is_null($cat) ||
				is_null($rat)) {
				return null;
			}
			else { 
				return new crimeIncident(1, $proper, $cat, $rat, $restD, $restT); }
	}

	mysqli_close($con);
}

function relabelNoise($string, $date) {
	$con = mysqli_connect("10.241.110.44", "studenthousing", "B3tterLiving!", "studenthousing");

	$query = "SELECT * FROM hotline WHERE
			  name= '$string'";

	if ( $stmt = mysqli_query( $con, $query ) ) {

			$row = mysqli_fetch_array( $stmt );
			$proper = $row['proper'];
			$cat = $row['category'];
			$rat = $row['value'];
			$pieces = explode('T', $date);
			$restD = substr($pieces[0], 0, 4) . "-" . substr($pieces[0], 5, 2); // returns "d"
			$restT = substr($pieces[1], 0, 2);

			if (is_null($cat) ||
				is_null($rat)) {
				return null;
			}
			else { 
				return new crimeIncident(1, $proper, $cat, $rat, $restD, $restT); }
	}

	mysqli_close($con);
}

class crimeIncident {

	
	public $freq;
	public $proper;
	public $cat;
	public $rat;
	public $date;
	public $time;

	public function __construct($freq, $proper, $cat, $rat, $date, $time) {
		$this->freq        = $freq;
		$this->proper      = $proper;
		$this->cat         = $cat;
		$this->rat         = $rat;
		$this->date        = $date;
		$this->time        = $time;
	}

	public function __toString() {
		return $this->freq . ' ' . $this->proper . ' ' . $this->cat . ' ' . $this->rat . ' ' . $this->dateAndTime;
	}

	//increase the frequency by 1
	public function incFreq() {
		$this->freq = $this->freq + 1;
	}
	
	public function addToRat($temp) {
		$this->rat = $this->rat + $temp;
	}
}

class timeDate {
	public $freq;
	public $time;

	public function __construct($freq, $time) {
		$this->freq = $freq;
		$this->time = $time;
	}


	public function incFreq() {
		$this->freq += 1;
	}
}

?>