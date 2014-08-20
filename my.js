	function drawOwner(data) {
		var acc = '';

		$.each(data, function() {
			acc += '<p>' + $(this).attr('parcel') + '</p>';
		});

		$('#main_output').append(acc);
	}

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

		var VIOLATIONS_TOTAL = 0;
		var CRIME_TOTAL = 0;
		var NOISE_TOTAL = 0;
		var HOTLINE_TOTAL = 0;

		var VIOLA_RATING;
		var CRIME_RATING;
		var NOISE_RATING;
		var HOT_RATING;

		var VIOLA_WEIGHT = 1; 
		var CRIME_WEIGHT = 1;
		var NOISE_WEIGHT = 1;
		var HOT_WEIGHT = 1; 

		var spot = 0;



		$(document).ready( function() {

		$('#big_one').css('background-color', 'rgb(235, 235, 235)');

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
			
			console.log(add);

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

		//log(getParams);

			document.getElementsByClassName('square')[0].style.height = '12px';
			document.getElementsByClassName('square')[0].style.width = '12px';

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

				$('#info-box').append('<p id="address">Showing results for:   <strong>' + returnedData.address + '</strong></p>');
			
				var violations = styleViol(returnedData.list, returnedData.address);
				var crime = styleCrime(returnedData.crime, 1);
				var noise = styleCrime(returnedData.noise, 2);
				var hotline = styleCrime(returnedData.hotline, 3);

				var textTemp;

				$('#big_one').click( function() {
					$('#charts').remove();
					$('#this_one').append('<div class="col-md-4 well" id="charts">');
					$('#charts').empty();
					$('#main_output').empty();
					$('#main_output').append('<p class="col-md-2">Other Stats</p>');

					$('#main_output').append(
						'<div class="col-md-3"><p id="total_title">Displaying the 5 most frequent incidents for each category</p>' +
						'<table id="total_table">' + 
							'<tr>' +
								'<td class="total_cell"><p id="total_label">Violations</p>' + top5(returnedData.crime) + '</td>' +
								'<td class="total_cell" id="b1"><p id="total_label">Crime</p>' + top5(returnedData.crime) + '</td>' +
							'</tr>' + 
							'<tr>' + 
								'<td class="total_cell" id="b2"><p id="total_label">Hotline</p>' + top5(returnedData.hotline) + '</td>' +
								'<td class="total_cell"><p id="total_label">Noise</p>' + top5(returnedData.noise) + '</td>' +
							'</tr></table></div>');

					$('#charts').append('<h2 id="chart_title">Crime, Noise and Hotline by Month</h2>');

					drawBigChart(returnedData.crimeDates,
								 returnedData.noiseDates,
								 returnedData.hotlineDates);
					$('#violations').css('background-color', '#eee');
					$('li#big_one').css('background-color', '#ccc');
					$('li#crime').css('background-color', '#eee');
					$('li#noise').css('background-color', '#eee');
					$('li#hotline').css('background-color', '#eee');
					$('li#owner').css('background-color', '#eee');

				});

				$('#totalJS').hover( function() {
					textTemp = $('#totalJS').text();
					$('#totalJS').text('Total');
				}, function(){
    				$('#totalJS').text(textTemp);
				});

				$('#owner').click( function() {
					$('#charts').remove();
					$('#main_output').empty();
					drawOwner(returnedData.owner);

					$('#violations').css('background-color', '#eee');
					$('li#big_one').css('background-color', '#eee');
					$('li#crime').css('background-color', '#eee');
					$('li#noise').css('background-color', '#eee');
					$('li#hotline').css('background-color', '#eee');
					$('li#owner').css('background-color', '#ccc');
				});
				
				$('#violations').click( function() {
					$('#charts').remove();
					$('#main_output').empty();
					$('#main_output').append(violations);
					//$('#bar').append('<p>Code Violations by Month</p>');
					//chartJSLine(returnedData.crimeDates);

					$('#violations').css('background-color', '#ccc');
					$('li#big_one').css('background-color', '#eee');
					$('li#crime').css('background-color', '#eee');
					$('li#noise').css('background-color', '#eee');
					$('li#hotline').css('background-color', '#eee');
					$('li#owner').css('background-color', '#eee');
				});

				$('#violaJS').hover( function() {
					textTemp = $('#violaJS').text();
					$('#violaJS').text(VIOLA_RATING);
				}, function(){
    				$('#violaJS').text(textTemp);
				});
				
				$('#crime').click( function() {
					$('#charts').remove();
					$('#this_one').append('<div class="col-md-4 well" id="charts">');
					$('#charts').empty();
					$('#main_output').empty();
					$('#main_output').append('<p id="main_title">Displaying all crime incidents within 250 meters of your address in the last year</p>');
					$('#main_output').append(crime);
					$('#charts').append('<h2 id="chart_title">Crime Violations by Month</h2>');
					drawChart(returnedData.crimeDates, sortDates, parseDates, 'date_line');
					$('#charts').append('<h2 id="chart_title">Crime Violations by Time of Day</h2>');
					drawChart(returnedData.crimeTimes, sortTimes, parseTime, 'time_line');

					$('#crime').css('background-color', '#ccc');
					$('li#big_one').css('background-color', '#eee');
					$('#violations').css('background-color', '#eee');
					$('li#noise').css('background-color', '#eee');
					$('li#hotline').css('background-color', '#eee');
					$('li#owner').css('background-color', '#eee');
				});

				$('#crimeJS').hover( function() {
					textTemp = $('#crimeJS').text();
					$('#crimeJS').text(CRIME_RATING);
				}, function(){
    				$('#crimeJS').text(textTemp);
				});
				
				$('#noise').click( function() {
					$('#charts').remove();
					$('#this_one').append('<div class="col-md-4 well" id="charts">');
					$('#charts').empty();
					$('#main_output').empty();
					$('#main_output').append('<p id="main_title">Displaying all noise incidents within 250 meters of your address in the last year</p>');
					$('#main_output').append(noise);
					$('#charts').append('<h2 id="chart_title">Crime Violations by Month</h2>');
					drawChart(returnedData.noiseDates, sortDates, parseDates, 'date_line');
					$('#charts').append('<h2 id="chart_title">Crime Violations by Time of Day</h2>');
					drawChart(returnedData.noiseTimes, sortTimes, parseTime, 'time_line');

					$('#noise').css('background-color', '#ccc');
					$('#violations').css('background-color', '#eee');
					$('li#crime').css('background-color', '#eee');
					$('li#hotline').css('background-color', '#eee');
					$('li#big_one').css('background-color', '#eee');
					$('li#owner').css('background-color', '#eee');
				});

				$('#noiseJS').hover( function() {
					textTemp = $('#noiseJS').text();
					$('#noiseJS').text(NOISE_RATING);
				}, function(){
    				$('#noiseJS').text(textTemp);
				});
				
				$('#hotline').click( function() {
					$('#charts').remove();
					$('#this_one').append('<div class="col-md-4 well" id="charts">');
					$('#charts').empty();
					$('#main_output').empty();
					$('#main_output').append('<p id="main_title">Displaying all hotline incidents within 250 meters of your address in the last year</p>');
					$('#main_output').append(hotline);
					$('#charts').append('<h2 id="chart_title">Crime Violations by Month</h2>');
					drawChart(returnedData.hotlineDates, sortDates, parseDates, 'date_line');
					$('#charts').append('<h2 id="chart_title">Crime Violations by Time of Day</h2>');
					drawChart(returnedData.hotlineTimes, sortTimes, parseTime, 'time_line');

					$('#hotline').css('background-color', '#ccc');
					$('#violations').css('background-color', '#eee');
					$('li#crime').css('background-color', '#eee');
					$('li#noise').css('background-color', '#eee');
					$('li#big_one').css('background-color', '#eee');
					$('li#owner').css('background-color', '#eee');
				});

				$('#hotlineJS').hover( function() {
					textTemp = $('#hotlineJS').text();
					$('#hotlineJS').text(HOT_RATING);
				}, function(){
    				$('#hotlineJS').text(textTemp);
				});

				$('#big_one').trigger("click");



				//console.log(returnedData);

				document.getElementsByClassName('square')[0].style.height = '0px';
				document.getElementsByClassName('square')[0].style.width = '0px';

				
				var CRIME_10 = [180,234,367,575,706,854,978,1118,1355,8000];
				var crime_rating = score(CRIME_10, CRIME_TOTAL);
				var crime_color = coloring(crime_rating);
				
				document.getElementById("crime_circle").className = "c100 p" + 10*parseInt(crime_rating) + " " + crime_color;

				CRIME_RATING = crime_rating;

				
				var NOISE_10 = [95,127,213,285,356,434,531,644,781,2750];
				var noise_rating = score(NOISE_10, NOISE_TOTAL);
				var noise_color = coloring(noise_rating);

				document.getElementById("noise_circle").className = "c100 p" + 10*parseInt(noise_rating) + " " + noise_color;

				NOISE_RATING = noise_rating;

				
				var HOTLINE_10 = [0,1200,1750,2150,2640,3050,3375,4550,6000,10000];
				var hotline_rating = score(HOTLINE_10, HOTLINE_TOTAL);
				var hotline_color = coloring(hotline_rating);

				document.getElementById("hotline_circle").className = "c100 p" + 10*parseInt(hotline_rating) + " " + hotline_color;

				HOT_RATING = hotline_rating;


				var VIOLATIONS_10 = [100,200,350,450,550,740,975,1410,2225,23475];
				var violation_rating = score(VIOLATIONS_10, VIOLATIONS_TOTAL);
				var violation_color = coloring(violation_rating);

				document.getElementById("viola_circle").className = "c100 p" + 10*parseInt(violation_rating) + " " + violation_color;

				VIOLA_RATING = violation_rating;

				var Total_Weight = parseInt(VIOLA_WEIGHT) + parseInt(CRIME_WEIGHT) + parseInt(NOISE_WEIGHT) + parseInt(HOT_WEIGHT); 
				//+ parseInt(OWNER_WEIGHT);

				//console.log(VIOLA_WEIGHT);

				var Total_Rating = ((parseInt(crime_rating)*parseInt(CRIME_WEIGHT)) + (parseInt(noise_rating)*parseInt(NOISE_WEIGHT)) + 
					(parseInt(hotline_rating)*parseInt(HOT_WEIGHT)) + (parseInt(violation_rating)*parseInt(VIOLA_WEIGHT)))/(parseInt(Total_Weight));

				Total_Rating = Total_Rating.toFixed(1);

				var Total_color = coloring(Total_Rating);

				document.getElementById("total_circle").className = "c100 p" + 10*parseInt(Total_Rating) + " big " + Total_color;

				document.getElementById("totalJS").innerHTML = Total_Rating;

			})
			.fail( function() {
				document.getElementsByClassName('square')[0].style.height = '0px';
				document.getElementsByClassName('square')[0].style.width = '0px';
				alert("Address does not exist in our Boston Database, please try again...");
			});

		



		

		function styleCrime(list, type) {

			list.sort( function(a, b) {
				return b.freq - a.freq;
			});
					
		var string = '<table class="deep">';
		var high = list[0].freq;

			$.each(list, function() {
				string = string + '<tr><td id="label"><p id="listed">' + $(this).attr('cat') + setIcon($(this).attr('cat')) + '</p></td><td id="bars">' +
				 '<div class="bar_wrap"><div id="a_bar" style="width:' + ($(this).attr('freq')/high)*100 + '%">' + 
				 '<strong>(' + $(this).attr('freq') + ')</strong>' + '</div></div></td></tr>';

				if(type === 1) { CRIME_TOTAL += parseInt($(this).attr('rat')); }
				else if(type === 2) { NOISE_TOTAL += parseInt($(this).attr('rat')); }
				else { HOTLINE_TOTAL += parseInt($(this).attr('rat')); }
			}); 

		return string + '</table>';
		}

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

					VIOLATIONS_TOTAL = VIOLATIONS_TOTAL + parseInt($(this).attr('rat'));
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

		function score(VIOLATIONS_10, totalCount) {

			var VIOLA_SCORE = 10;

			if(totalCount <= VIOLATIONS_10[0]) { VIOLA_SCORE = 10; }
            else if(totalCount < VIOLATIONS_10[9]) {
                for(i = 1; i <= 9; i++) {
                    if(totalCount < VIOLATIONS_10[i]) {
                        VIOLA_SCORE = (10-i) + ((VIOLATIONS_10[i]-totalCount)/((VIOLATIONS_10[i]-VIOLATIONS_10[i-1])));
                        break;
                    }
                    
                }
                
            } else {
                VIOLA_SCORE = 0.0;
            }

			return VIOLA_SCORE = VIOLA_SCORE.toFixed(1);
		}

		function coloring(Score_Color) {
			if(Score_Color < 1.667) {
				var temp =  "secondRed";


			} else if (Score_Color < 3.33) {
				var temp = "red";


			} else if (Score_Color < 5) {
				var temp = "orange";


			} else if (Score_Color < 6.667) {
				var temp =  "yellow";


			} else if (Score_Color < 8.33) {
				var temp = "green";


			} else {
				var temp = "secondGreen";


			} 
			return temp;
		}

		function top5(data) {
			data.sort( function(a, b) {
				return b.freq - a.freq;
			});
			result = '';
			data = data.slice(0, 5);

			$.each(data, function() {
				result += '<p id="total_incident">' + $(this).attr('cat') + setIcon($(this).attr('cat')) + $(this).attr('freq') + '</p>';
			});

			return result;
		}

	});
