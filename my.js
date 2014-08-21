	function drawBigChart(crime, noise, hotline) {
		console.log(crime);
		console.log(noise);
		console.log(hotline);

		var c = parseDates(crime.sort(sortDates));
		var n = parseDates(noise.sort(sortDates));
		var h = parseDates(hotline.sort(sortDates));

		var chartData = {
			labels : c['labels'],

			datasets : [{ data : c['rows'],
			fillColor: "rgba(95, 166, 255,0.3)" },
			{ data : n['rows'],
			fillColor: "rgba(0, 100, 255,0.3)" },
			{ data : h['rows'],
			fillColor: "rgba(50, 166, 130,0.3)" }
			]
		}

		$('#charts').append('<canvas id="line"></canvas>');

		var ctx = document.getElementById('line').getContext("2d");
		ctx.canvas.width = 800;
		ctx.canvas.height = 400;

		var myChart = new Chart(ctx).Line(chartData, {
			bezierCurve : false,
			scaleFontFamily: "'Lato', sans-serif",
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
		});
	}

	function drawChart(data, sorter, parser, id) {
		data.sort(sorter);

		if (data.length < 2) {
			$('#charts').append('<h2 id="graph_fail_alert">Not enough data to draw a graph!</h2>');
			return false;
		}

		var result = parser(data);

		var lineChartData = {
			labels : result['labels'],

			datasets : [{ data : result['rows'],
			fillColor: "rgba(95, 166, 255,0.3)"
		}]
	}

	$('#charts').append('<canvas id="' + id + '"></canvas>');

	var ctx = document.getElementById(id).getContext("2d");
	ctx.canvas.width = 800;
	ctx.canvas.height = 400;

	var myChart = new Chart(ctx).Line(lineChartData, {
		bezierCurve : false,
		scaleFontFamily: "'Lato', sans-serif",
	});
}

function parseTime(data) {

	var labelList = [];
	var rows = [];
	current = 0;

	for (i = 0; i < 24; i++) {
		labelList.push(i);
	}

	var place = 0;

	$.each(data, function() {
		while (place != $(this).attr('time')) {
			rows.push(0);
			place++;
		}

		rows.push($(this).attr('freq'));
		place++;
	})

	while (rows.length < 24) {
		rows.push(0);
	}

	for (i = 0; i < 24; i++) {
		labelList[i] = makeTime(labelList[i]);
	}

	var result = [];
	result['labels'] = labelList;
	result['rows'] = rows;
	return result;
}

function parseDates(data) {

	var labelList = [];
	var rows = [];

	var curMonth = new Date().getMonth();
	var curYear = new Date().getYear();

	$.each(data, function () {

		while($(this).attr('time').substring(5,7).replace(/^0+/, '')-1 != curMonth) {
			rows.push(0);
			labelList.push(numToMonth(curMonth));
			curMonth = (curMonth + 1) % 12;

		}

		labelList.push(numToMonth($(this).attr('time').substring(5,7).replace(/^0+/, '')-1) + " '" + $(this).attr('time').substring(2,4));
		rows.push($(this).attr('freq'));
		curMonth = (curMonth + 1) % 12;
		console.log(curMonth);
	});

	var result = [];
	result['labels'] = labelList;
	result['rows'] = rows;
	return result;
}

function sortTimes(a, b) {
	return a.time - b.time;
}

function sortDates(a, b) {
	var ayear  = a.time.substring(0, 4);
	var amonth = a.time.substring(5,7).replace(/^0+/, '');
	var byear  = b.time.substring(0, 4);
	var bmonth = b.time.substring(5,7).replace(/^0+/, '');

	if (ayear === byear) {
		return amonth - bmonth;
	}
	else return ayear - byear;
}

function makeTime(num) {
	if (num === 0) { return '12am'; }
	else if (num > 12) { return (num % 12) + 'pm'; } 
	else { return num + 'am'; }
}

function numToMonth(num) {
	if (num == 0) { 
		return "Jan";
	} else if (num == 1) {
		return "Feb";
	} else if (num == 2) {
		return "Mar";
	} else if (num == 3) {
		return "Apr";
	} else if (num == 4) {
		return "May";
	} else if (num == 5) {
		return "Jun";
	} else if (num == 6) {
		return "Jul";
	} else if (num == 7) {
		return "Aug";
	} else if (num == 8) {
		return "Sep";
	} else if (num == 9) {
		return "Oct";
	} else if (num == 10) {
		return "Nov";
	} else if (num == 11) {
		return "Dec";
	} else {
		return false;
	}
}

function getFreqs(data) {
	var count = 0;
	$.each(data, function() {
		count = count + $(this).attr('freq');
	});	
	return count;
}

$(document).ready( function() {

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
			alert("Please fill the ZipCode Box correctly");

		} else {
			if (add === '' || isNaN(parts[0])) {
				alert("Please fill the Address Box correctly");

				$('div.header').children().each( function() {
					$(this).val('');
				});
			} else {


				var url = "/search_final.html?parameter=" + add + "&%&" +  zip;


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

			$('#output').append('<div id="main_output" class="row well">');
			$('#main_output').append(violations);

			})

	.fail( function() {
		document.getElementsByClassName('square')[0].style.height = '0px';
		document.getElementsByClassName('square')[0].style.width = '0px';
		alert("Address does not exist in our Boston Database, please try again...");
	});

	function styleViol(list, address) {
		var count = list.length;
		var string = '';
		var high = findHigh(list);

		if (count === 0) {
			return "No violations found at this adress";
		}

		else {	

			string = string + '<p id="main_title">Found <strong>' + total(list) + '</strong> violations for the past 10 years'+ '</p>';	

			$.each(list, function() {
				string = string + '<table class="deep"><tr><td id="year"><h2 id="year">' + $(this).attr('name') +
				'</h2></td><td></td></tr>';

				$.each($(this).attr('loInc'), function() {

					string = string + '<tr><td id="label"><p id="listed">' + $(this).attr('desc') + setIcon($(this).attr('cat')) +
					'</p></td><td id="bars"><div class="bar_wrap"><div id="a_bar" style="width:' + ($(this).attr('freq')/high)*100 + '%"><strong>(' +
						$(this).attr('freq') + ')</strong></div></div></td></tr>';

			});

				string = string + '</table>';
			});

			$('.address').empty();
			$('.address').append(address);
			
			return string;
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

	function total(list) {
		var total = 0;

		$.each(list, function() {
			$.each($(this).attr('loInc'), function() {
				total = total + $(this).attr('freq');
			});
		});

		return total;
	}

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
