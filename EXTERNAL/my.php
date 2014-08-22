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

?>