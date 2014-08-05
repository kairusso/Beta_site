<?php
require_once("socrata.php");
$socrata = new Socrata("http://data.cityofboston.gov/api");

if(isset($_POST['address'])) {
	$suffixTakeOut = array("ST", "Street", "AV", "Ave", "Avenue", "RD", "Road", "TE", "Terrace", "PL", "Place", 
	"SQ", "Square", "CT", "Court", "PK", "Park", "HW", "Highway", "DR", "Drive", "Wy", "Way", "BL", "Boulevard", 
	"PW", "Parkway", "CI", "Circle", "LA", "Lane", "CC", "Crescent", "GR", "Green", "PZ", "Plaza", "RO", "Row", 
	"Wh", "Wharf", "LN", "Ts", "Terrace", "Xt", "BR", "bridge");
	
	$address = $_POST['address'];
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
	
	$snum = $pieces[0];
	$sname = $streetName;
}

$query = "street = '$sname' AND (stno = '$snum' OR (stno <= '$snum' AND sthigh >= '$snum'))";


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
function relabel($string) {
	$con = mysqli_connect("localhost", "root", "root", "DOIT");

	$query = "SELECT * FROM violations WHERE
			  short= '$string'";

	if ( $stmt = mysqli_query( $con, $query ) ) {

			$row = mysqli_fetch_array( $stmt );

			$proper = $row['proper'];
			$cat = $row['category'];
			$rat = $row['rating'];

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
				$a->addInc(relabel($item['description']));
				$placed = true;
			}
		}

		if (!$placed) {
			array_push($result['list'], new Year($year, array(relabel($item['description']))));
		}
	}
	
	$cell = $response[0];
	
	$lat = $cell['latitude'];
	$lng = $cell['longitude'];

	$tripleArray = fire($lat, $lng);
	
	$result['crime'] = $tripleArray[0];
	$result['noise'] = $tripleArray[1];
	$result['hotline'] = $tripleArray[2];
	
	//foreach($noiseCategoryArray as $item) echo $item->__toString;
	
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

	$socrata2 = new Socrata("http://data.cityofboston.gov/api");
	
	$query2 = "within_circle(location, $lat, $lng, 215) AND year=2013";
	$params2 = array("\$where" => $query2);
	$response2 = $socrata2->get("/resource/7cdf-6fgx.json", $params2);
	
	
	$query3 = "within_circle(geocoded_location, $lat, $lng, 215)";
	$params3 = array("\$where" => $query3);
	$response3 = $socrata2->get("/resource/awu8-dc52.json", $params3);
	
	$temp = new crimeIncident(0, "other", 0);
	
	$crimeArray = array();
	$crimeCategoryArray = array();
	
	$noiseArray = array();
	$noiseCategoryArray = array();
	
	$hotlineArray = array();
	$hotlineCategoryArray = array();
	
	foreach($response2 as $item) {
		$temp = relabelCrime($item['incident_type_description']);
		
		if($temp == null) {  }
		elseif ($temp->cat == "Noise/Disturbance") {
			array_push($noiseArray, $temp);
		}
		else {
			array_push($crimeArray, $temp);
		}
	}
	
	foreach($response3 as $item) {
		$temp = relabelNoise($item['case_title']);
		
		if($temp == null) { }
		elseif ($temp->cat == "Noise/Disturbance") {
			array_push($noiseArray, $temp);
		} else {
			array_push($hotlineArray, $temp);
		}
	}
	
	foreach($crimeArray as $crime) {
		$test = true;
		foreach($crimeCategoryArray as $cat) {
			if($cat->cat == $crime->cat) {
				$cat->incFreq();
				$cat->addToRat($crime->rat);
				$test = false;
			}
		}
		if($test) {
			$temp = new crimeIncident(1, "", $crime->cat, $crime->rat);
			array_push($crimeCategoryArray, $temp);
		}
	}
	
	foreach($hotlineArray as $hot) {
		$test = true;
		foreach($hotlineCategoryArray as $cat) {
			if($cat->cat == $hot->cat) {
				$cat->incFreq();
				$cat->addToRat($hot->rat);
				$test = false;
			}
		}
		if($test) { 
			$temp = new crimeIncident(1, "", $hot->cat, $hot->rat);
			array_push($hotlineCategoryArray, $temp);
		}
	}
	
	foreach($noiseArray as $noise) {
		$test = true;
		foreach($noiseCategoryArray as $cat) {
			if($cat->cat == $noise->proper) {
				$cat->incFreq();
				$cat->addToRat($noise->rat);
				$test = false;
			}
		}
		if($test) { 
			$temp = new crimeIncident(1, "", $noise->proper, $noise->rat);
			array_push($noiseCategoryArray, $temp);
		}
	}
	
	$tripleArray = array($crimeCategoryArray, $noiseCategoryArray, $hotlineCategoryArray);
	
	return $tripleArray;
}




function relabelCrime($string) {
	$con = mysqli_connect("localhost", "root", "root", "DOIT");

	$query = "SELECT * FROM crimes WHERE
			  name = '$string'";

	if ( $stmt = mysqli_query( $con, $query ) ) {

			$row = mysqli_fetch_array( $stmt );
			$proper = $row['proper'];
			$cat = $row['category'];
			$rat = $row['value'];

			if (is_null($cat) ||
				is_null($rat)) {
				return null;
			}
			else { 
				return new crimeIncident(1, $proper, $cat, $rat); }
	}

	mysqli_close($con);
}

function relabelNoise($string) {
	$con = mysqli_connect("localhost", "root", "root", "DOIT");

	$query = "SELECT * FROM hotline WHERE
			  name= '$string'";

	if ( $stmt = mysqli_query( $con, $query ) ) {

			$row = mysqli_fetch_array( $stmt );
			$proper = $row['proper'];
			$cat = $row['category'];
			$rat = $row['value'];

			if (is_null($cat) ||
				is_null($rat)) {
				return null;
			}
			else { 
				return new crimeIncident(1, $proper, $cat, $rat); }
	}

	mysqli_close($con);
}

class crimeIncident {

	
	public $freq;
	public $proper;
	public $cat;
	public $rat;

	public function __construct($freq, $proper, $cat, $rat) {
		$this->freq = $freq;
		$this->proper = $proper;
		$this->cat  = $cat;
		$this->rat  = $rat;
	}

	public function __toString() {
		return $this->freq . ' ' . $this->proper . ' ' . $this->cat . ' ' . $this->rat;
	}

	//increase the frequency by 1
	public function incFreq() {
		$this->freq = $this->freq + 1;
	}
	
	public function addToRat($temp) {
		$this->rat = $this->rat + $temp;
	}
}

?>