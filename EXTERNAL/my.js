	//draw the chart based on returned data 
	function drawChart(data) {

		//sort the list of years in descending order
		data.sort(function (a, b) {
			return a.name - b.name;
		});

		console.log(data);

		//if there is not enough data, don't post anything
		if (data.length < 2) {
			$('#main_output').append('<h2 id="graph_fail_alert">Not enough data to draw a graph!</h2>');
			return false;
		}

		var labelList = [];
		var rows = [];
		var curYear = new Date().getFullYear() - 10;
		console.log(curYear);

		//creates the data for the graph
		$.each(data, function() {
			//fill in the front of the list with empty data
			while ($(this).attr('name') != curYear) {
				labelList.push(curYear);
				rows.push(0);
				curYear++;
			}

			//add data
			labelList.push($(this).attr('name'));
			rows.push(count($(this).attr('loInc')));
			curYear++;
		});

		//fill in the end of the list
		while(labelList.length < 10) {
			labelList.push(curYear);
			rows.push(0);
			curYear++;
		}

		//build chart line data
		var lineChartData = {
			labels : labelList,

			datasets : [{ data : rows,
				fillColor: "rgba(95, 166, 255,0.3)"
			}]
		}

		//create the chart div
		$('#main_output').append('<canvas id="graph"></canvas>');

		//chart settings
		var ctx = document.getElementById('graph').getContext("2d");
		ctx.canvas.width = 800;
		ctx.canvas.height = 400;

		//append chart to page
		var myChart = new Chart(ctx).Line(lineChartData, {
			bezierCurve : false,
			scaleFontFamily: "'Lato', sans-serif",
		});
	}

	//
	function count(data) {
		var result = 0;

		$.each(data, function() {
			result += $(this).attr('freq');
		});

		return result;
	}

	$(document).ready( function() {


		//handle user input
		$("input#searchA").keyup(function(event){
			if(event.keyCode == 13){
				$("input#submit").click();
			}
		});

		$("input#searchZ").keyup(function(event){
			if(event.keyCode == 13){
				$("input#submit").click();
			}
		});


		$("input#submit").click( function() {

			var add = $("input#searchA").val().trim();
			var zip = $("input#searchZ").val().trim();
			add = add.replace(',', '');
			add = add.replace('.', '');
			zip = zip.replace(',', '');
			zip = zip.replace('.', '');


			var parts = add.split(" ");

			if ((zip.length != 4 && zip.length != 5) || isNaN(zip)) {
				alert("Please fill the ZipCode Box correctly e.g. '02134'");

			} else {
				if (add === '' || isNaN(parts[0])) {
					alert("Please fill the Address Box correctly e.g. '1 City Hall'");

					$('div.header').children().each( function() {
						$(this).val('');
					});
				} else {


					var url = "search_final.html?parameter=" + add + "&%&" +  zip;


					window.open(url,"_self")

				} 

			}


		});


		var getParams = function () {
  		// This function is anonymous, is executed immediately and 
  		// the return value is assigned to QueryString!
  		var address = "";
  		var query = window.location.search.substring(1);
  		var vars = query.split("=");
  		var secondSplit = vars[1].split("&%&");
  		var thirdSplit = secondSplit[0].split("%20");
  		var street = "";
  		for (var i=1; i<thirdSplit.length; i++) {
  			if(thirdSplit[i] === '') {}
  				else { street = street + " " + thirdSplit[i].replace(/[0-9]/g, ''); }
  		}
  		var address = thirdSplit[0] + street;
  		var zip = secondSplit[1];
  		var passToPhp = [address, zip];
  		return passToPhp;
  	} ();

  	var passToPhp = getParams;
  	var address1 = passToPhp[0];
  	var zip1 = passToPhp[1];

  	console.log(address1);
  	console.log(zip1);

  	$.ajax({
  		url: "my.php", 
  		type: "POST",
  		data: {address: address1, zip: zip1},
  		dataType: "json"
  	})
  	.done( function( returnedData ) {

  		console.log(returnedData);

  		var violations = styleViol(returnedData.list, returnedData.address);
  		var countTotal = total(returnedData.list);

  		$('#totalJS').hover( function() {
					textTemp = $('#totalJS').text();
					$('#totalJS').text(countTotal);
				}, function(){
    				$('#totalJS').text(textTemp);
		});


  		$('#output').append('<div id="main_output" class="row well">');
  		//append violation data
  		$('#main_output').append(violations);
  		$('#main_output').append('<h2 class="gray_titles" id="chart_title">No. of Violations by Year</h3>');
  		drawChart(returnedData.list);

  	})

  	.fail( function() {
  		document.getElementsByClassName('square')[0].style.height = '0px';
  		document.getElementsByClassName('square')[0].style.width = '0px';
  		alert("Address does not exist in our Boston Database, please try again...");
  	});

  	//create the violations table
  	function styleViol(list, address) {
  		var count = list.length;
  		var string = '';
  		var high = findHigh(list);

  		if (count === 0) {
  			return "No violations found at this adress";
  		}

  		else {	

  			string = string + '<div id="address_header"><h3 id="address">' + address + '</h3><p class="gray_titles" id="main_title">Found <strong>' + total(list) + '</strong> violations for the past 10 years'+ '</p></div>';	

  			$.each(list, function() {
  				string = string + '<table class="deep"><tr><td id="year"><h2 id="year">' + $(this).attr('name') +
  				'</h2></td><td></td></tr>';

  				$.each($(this).attr('loInc'), function() {

  					string = string + '<tr><td id="label"><p id="listed">' + $(this).attr('desc') + setIcon($(this).attr('cat')) +
  					'</p></td><td id="bars"><div class="bar_wrap"><div id="a_bar" style="width:' + ($(this).attr('freq')/high)*100 + '%"><strong>(' +
  						$(this).attr('freq') + ')</strong></div></div></td></tr>';

  			});

  			});

  			return string + '</table>';
  		}
  	}

	///search the year list for the highest frequency
	//
	function findHigh(list) {
		var high = 0;

		$.each(list, function() {
			$.each($(this).attr('loInc'), function() {
				if ($(this).attr('freq') > high) {
					high = $(this).attr('freq');
				}
			});
		});

		return high;
	}

	//count the number of violations
	function total(list) {
		var total = 0;

		$.each(list, function() {
			$.each($(this).attr('loInc'), function() {
				total = total + $(this).attr('freq');
			});
		});

		return total;
	}

	//set the icon based on the category of the incident
	function setIcon(cat) {
		var src = '';

		if (cat === 'Trash') { src = 'VIOLATIONS/TRASH.png'}
		else if (cat === 'Overgrown Weeds') { src = 'VIOLATIONS/WEEDS.png' }
		else if (cat === 'Graffiti') { src = 'VIOLATIONS/GRAFFITI.png' }
		else if (cat === 'Permit/Registration') { src = 'VIOLATIONS/REG_PERM.png' }
		else if (cat === 'Repair/Maintenance') { src = 'VIOLATIONS/MR.png' }
		else if (cat === 'Safety/Fire Protection') { src = 'VIOLATIONS/FIRE_SAFE.png' }
		else if (cat === 'Street Light Outages') { src = 'HOTLINE/LIGHT.png' }
		else if (cat === 'Dead Animal Pick up') { src = 'HOTLINE/DEAD_ANIMAL.png' }
		else if (cat === 'Illegal Dumping/Trash') { src = 'HOTLINE/TRASH.png' }
		else if (cat === 'Poor/Dangerous Conditions of Property') { src = 'HOTLINE/POOR_DAMAGED.png' }
		else if (cat === 'Pest Activity') { src = 'HOTLINE/PEST.png' }
		else if (cat === 'Pothole Repair') { src = 'HOTLINE/POTHOLE.png' }
		else if (cat === 'Work w/out Permit') { src = 'HOTLINE/REG_PERM.png' }
		else if (cat === 'Traffic Signal/Sign Repair') { src = 'HOTLINE/TRAFFIC_SIGN_REPAIR.png' }
		else if (cat === 'Abandoned Vehicle') { src = 'HOTLINE/ABANDONED_VEH.png' }
		else if (cat === 'Unsatisfactory Living Conditions') { src = 'HOTLINE/POOR_DAMAGED.png' }
		else if (cat === 'Utilities Issues') { src = 'HOTLINE/UTILITY.png' }
		else if (cat === 'Violence') { src = 'CRIME/VIOLENCE.png' }
		else if (cat === 'Homicide') { src = 'CRIME/HOMICIDE.png' }
		else if (cat === 'Weapons') { src = 'CRIME/WEAPONS.png' }
		else if (cat === 'Harassement') { src = 'CRIME/HARASSEMENT.png' }
		else if (cat === 'Property') { src = 'CRIME/PROPERTY.png' }
		else if (cat === 'Larceny/Theft/B&E') { src = 'CRIME/LARCENY_THEFT.png' }
		else if (cat === 'Robbery') { src = 'CRIME/ROBBERY.png' }
		else if (cat === 'Drug') { src = 'CRIME/DRUGS.png' }
		else if (cat === 'Prostitution') { src = 'CRIME/PROSTITUTION.png' }
		else if (cat === 'Simple Assault') { src = 'CRIME/SIMPLE_ASSAULT.png' }
		else if (cat === 'Public Drinking') { src = 'NOISE/PUB_DRINKING.png' }
		else if (cat === 'Disorderly Conduct') { src = 'NOISE/DISORDERLY.png' }
		else if (cat === 'Argue') { src = 'NOISE/ARGUE.png' }
		else if (cat === 'Gathering') { src = 'NOISE/GATHERING.png' }
		else if (cat === 'Work Hours-Loud Noise Complaints') { src = 'NOISE/WOR_HOURS.png' }
		else if (cat === 'Loud Parties/Music/People') { src = 'NOISE/party.png' }
		else if (cat === 'Public Events Noise Disturbances') { src = 'NOISE/PUBLIC_EVENT.png' }
		else { src = 'VIOLATIONS/OTHER.png' }

		return '<img id="icon" src="images/' + src + '"/>';
}
});
