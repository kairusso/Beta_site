	google.load('visualization', '1.0', {'packages':['corechart']});

	function chartJSLine(data) {
		console.log(data);

		data.sort(function(a, b) {
			var ayear  = a.time.substring(0, 4);
			var amonth = a.time.substring(5,7).replace(/^0+/, '');
			var byear  = b.time.substring(0, 4);
			var bmonth = b.time.substring(5,7).replace(/^0+/, '');

			if (ayear === byear) {
				return amonth - bmonth;
			}
			else return ayear - byear;
		});

		if (data.length < 2) {
			$('#charts').append('<h2 id="graph_fail_alert">Not enough data to draw a graph!</h2>');
			return false;
		}

		var labelList = [];
		var rows = [];

		var current = new Date().getMonth();

		$.each(data, function () {

			while($(this).attr('time').substring(5,7).replace(/^0+/, '')-1 != current) {
				rows.push(0);
				labelList.push(numToMonth(current));
				current = (current + 1) % 12;
				console.log(current);
			}

			labelList.push(numToMonth($(this).attr('time').substring(5,7).replace(/^0+/, '')-1));
			rows.push($(this).attr('freq'));
			current = (current + 1) % 12;
			console.log(current);
		});

		var lineChartData = {
			labels : labelList,

			datasets : [{ data : rows,
						  fillColor: "rgba(95, 166, 255,0.3)"
						  }]
		}

		$('#charts').append('<canvas id="line"></canvas>');

		var ctx = document.getElementById("line").getContext("2d");
		ctx.canvas.width = 800;
		ctx.canvas.height = 400;

		var myChart = new Chart(ctx).Line(lineChartData, {
			bezierCurve : false,
			scaleFontFamily: "'Lato', sans-serif",
		});
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

	function drawChartV(myData) {

        // Create the data table.
        var data = new google.visualization.DataTable();

        data.addColumn('string', 'Year');
        data.addColumn('number', 'Cleanliness');
        data.addColumn('number', 'Fire/Safety');
        data.addColumn('number', 'Graffiti');
        data.addColumn('number', 'Other');
        data.addColumn('number', 'Permits/Regulations');
        data.addColumn('number', 'Repair');
        data.addColumn('number', 'Trash');
        data.addColumn('number', 'Weeds');

        $.each(myData, function() {
        	data.addRows([makeRow($(this))]);
        });

        // Set chart options
        var options = {
        	title: 'Violations',
            width:500,
            height:400,
            fontName: 'Lato',
             isStacked: true,
             backgroundColor: "#ccc",
         };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('bar'));
        chart.draw(data, options);
      }

      function makeRow(data) {
      	var year = data.attr('name');
      	var clean;
      	var fire;
      	var graf;
      	var other;
      	var permit;
      	var repair;
      	var trash;
      	var weeds;

      	$.each(data.attr('loInc'), function() {
      		if ($(this).attr('cat') === "Permit/Registration") {
      			permit = $(this).attr('freq');
      		}
      		else if ($(this).attr('cat') === "Trash") {
      			trash = $(this).attr('freq');
      		}
      		else if ($(this).attr('cat') === "Overgrown Weeds") {
      			weeds = $(this).attr('freq');
      		}
      		else if ($(this).attr('cat') === "Graffiti") {
      			graf = $(this).attr('freq');
      		}
      		else if ($(this).attr('cat') === "Safety/Fire Protection") {
      			fire = $(this).attr('freq');
      		}
      		else if ($(this).attr('cat') === "Repair/Maintenance") {
      			repair = $(this).attr('freq');
      		}
      		else if ($(this).attr('cat') === "Cleanliness") {
      			clean = $(this).attr('freq');
      		}
      		else if ($(this).attr('cat') === "Other") {
      			other = $(this).attr('freq');
      		}
      	});

      	return [year, clean, fire, graf, other, permit, repair, trash, weeds];
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

		$("input#search").keyup(function(event){
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

      		if (zip === '', isNaN(zip)) {
        alert("Please fill the ZipCode Box correctly");
            
      } else {
			   if (add === '', isNaN(parts[0])) {
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
					$('#main_output').empty();
					$('#bar').empty();
					$('#line').empty();
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

					$('#violations').css('background-color', '#eee');
					$('li#big_one').css('background-color', '#ccc');
					$('li#crime').css('background-color', '#eee');
					$('li#noise').css('background-color', '#eee');
					$('li#hotline').css('background-color', '#eee');

				});
				
				$('#violations').click( function() {
					$('#charts').empty();
					$('#line').remove();
					$('#main_output').empty();
					$('#main_output').append(violations);
					//$('#bar').append('<p>Code Violations by Month</p>');
					//chartJSLine(returnedData.crimeDates);

					$('#violations').css('background-color', '#ccc');
					$('li#big_one').css('background-color', '#eee');
					$('li#crime').css('background-color', '#eee');
					$('li#noise').css('background-color', '#eee');
					$('li#hotline').css('background-color', '#eee');
				});

				$('#violaJS').hover( function() {
					textTemp = $('#violaJS').text();
					$('#violaJS').text(VIOLA_RATING);
				}, function(){
    				$('#violaJS').text(textTemp);
				});
				
				$('#crime').click( function() {
					$('#charts').empty();
					$('#line').remove();
					$('#main_output').empty();
					$('#main_output').append('<p>Displaying all crime incidents within 250 meters of your address in the last year</p>');
					$('#main_output').append(crime);
					$('#charts').append('<h2 id="chart_title">Crime Violations by Month</h2>');
					chartJSLine(returnedData.crimeDates);

					$('#crime').css('background-color', '#ccc');
					$('li#big_one').css('background-color', '#eee');
					$('#violations').css('background-color', '#eee');
					$('li#noise').css('background-color', '#eee');
					$('li#hotline').css('background-color', '#eee');
				});

				$('#crimeJS').hover( function() {
					textTemp = $('#crimeJS').text();
					$('#crimeJS').text(CRIME_RATING);
				}, function(){
    				$('#crimeJS').text(textTemp);
				});
				
				$('#noise').click( function() {
					$('#charts').empty();
					$('#line').remove();
					$('#main_output').empty();
					$('#main_output').append('<p>Displaying all noise incidents within 250 meters of your address in the last year</p>');
					$('#main_output').append(noise);
					$('#charts').append('<h2 id="chart_title">Noise Violations by Month</h2>');
					chartJSLine(returnedData.noiseDates);

					$('#noise').css('background-color', '#ccc');
					$('#violations').css('background-color', '#eee');
					$('li#crime').css('background-color', '#eee');
					$('li#hotline').css('background-color', '#eee');
					$('li#big_one').css('background-color', '#eee');
				});

				$('#noiseJS').hover( function() {
					textTemp = $('#noiseJS').text();
					$('#noiseJS').text(NOISE_RATING);
				}, function(){
    				$('#noiseJS').text(textTemp);
				});
				
				$('#hotline').click( function() {
					$('#charts').empty();
					$('#line').remove();
					$('#main_output').empty();
					$('#main_output').append('<p>Displaying all hotline incidents within 250 meters of your address in the last year</p>');
					$('#main_output').append(hotline);
					$('#charts').append('<h2 id="chart_title">Hotline Incidents by Month</h2>');
					chartJSLine(returnedData.hotlineDates);

					$('#hotline').css('background-color', '#ccc');
					$('#violations').css('background-color', '#eee');
					$('li#crime').css('background-color', '#eee');
					$('li#noise').css('background-color', '#eee');
					$('li#big_one').css('background-color', '#eee');
				});

				$('#hotlineJS').hover( function() {
					textTemp = $('#hotlineJS').text();
					$('#hotlineJS').text(HOT_RATING);
				}, function(){
    				$('#hotlineJS').text(textTemp);
				});

				$('#totalJS').hover( function() {
					textTemp = $('#totalJS').text();
					$('#totalJS').text('Total');
				}, function(){
    				$('#totalJS').text(textTemp);
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
				console.log("Error retrieving server query");
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
				
			string = string + "<p>Found <strong>" + total(list) + '</strong> violations for the past 10 years'+ '</p>';	

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
