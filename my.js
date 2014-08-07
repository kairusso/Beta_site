	google.load('visualization', '1.0', {'packages':['corechart']});

	

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
             isStacked: true,
             backgroundColor: "rgb(235, 235, 235)",
         };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('charts'));
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

      function drawChartOther(myData) {

        // Create the data table.
        var data = new google.visualization.DataTable();

        data.addColumn('string', 'Crime Type');
        data.addColumn('number', '# of violations');

        $.each(myData, function() {
        	data.addRows([
        	  [$(this).attr('cat'), getFreqs($(this))]
        	]);
        });

        // Set chart options
        var options = {
        	title: 'Violations',
            width:500,
            height:400,
             orientation:'horizontal',
             legend:'none',
             backgroundColor: "rgb(235, 235, 235)",
         };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('charts'));
        chart.draw(data, options);
      }

      function getFreqs(data) {
        	  	var count = 0;
        	  	$.each(data, function() {
        	  		count = count + $(this).attr('freq');
        	  	});	
        	  	return count;
      }

	$(document).ready( function() {

		$('#big_one').css('background-color', 'rgb(235, 235, 235)');

		$("input#search").keyup(function(event){
    		if(event.keyCode == 13){
        		$("input#submit").click();
    		}
		});

		var VIOLATIONS_TOTAL = 0;
		var CRIME_TOTAL = 0;
		var NOISE_TOTAL = 0;
		var HOTLINE_TOTAL = 0;

		$("input#submit").click( function() {

			var add = $("input#search").val().trim();
			add = add.replace(',', '');
			add = add.replace('.', '');
			
			var parts = add.split(" ");
			
			console.log(add);

			if (add === '', isNaN(parts[0])) {
				alert("Please fill all Boxes");

			$('div.header').children().each( function() {
				$(this).val('');
			});
		}
		else {

			document.getElementsByClassName('square')[0].style.height = '12px';
			document.getElementsByClassName('square')[0].style.width = '12px';

			$.ajax({
				url: "my.php", 
				type: "POST",
				data: {address: add},
				dataType: "json"
			})
			.done( function( returnedData ) {
			
				var violations = styleViol(returnedData.list, returnedData.address);
				var crime = styleCrime(returnedData.crime, 1);
				var noise = styleCrime(returnedData.noise, 2);
				var hotline = styleCrime(returnedData.hotline, 3);

				$('#text_output').append(violations);
				
				$('#violations').click( function() {
					$('#charts').empty();
					$('#text_output').empty();
					$('#text_output').append(violations);
					drawChartV(returnedData.list);

					$('#violations').css('background-color', 'rgb(235, 235, 235)');
					$('li#big_one').css('background-color', 'white');
					$('li#crime').css('background-color', 'white');
					$('li#noise').css('background-color', 'white');
					$('li#hotline').css('background-color', 'white');
				});
				
				$('#crime').click( function() {
					$('#charts').empty();
					$('#text_output').empty();
					$('#text_output').append(crime);
					drawChartOther(returnedData.crime);

					$('#crime').css('background-color', 'rgb(235, 235, 235)');
					$('li#big_one').css('background-color', 'white');
					$('#violations').css('background-color', 'white');
					$('li#noise').css('background-color', 'white');
				});
				
				$('#noise').click( function() {
					$('#charts').empty();
					$('#text_output').empty();
					$('#text_output').append(noise);
					drawChartOther(returnedData.noise);

					$('#noise').css('background-color', 'rgb(235, 235, 235)');
					$('#violations').css('background-color', 'white');
					$('li#crime').css('background-color', 'white');
					$('li#hotline').css('background-color', 'white');
					$('li#big_one').css('background-color', 'white');
				});
				
				$('#hotline').click( function() {
					$('#charts').empty();
					$('#text_output').empty();
					$('#text_output').append(hotline);
					drawChartOther(returnedData.hotline);

					$('#hotline').css('background-color', 'rgb(235, 235, 235)');
					$('#violations').css('background-color', 'white');
					$('li#crime').css('background-color', 'white');
					$('li#noise').css('background-color', 'white');
					$('li#big_one').css('background-color', 'white');
				});

				console.log(returnedData);

				document.getElementsByClassName('square')[0].style.height = '0px';
				document.getElementsByClassName('square')[0].style.width = '0px';

				
				var CRIME_10 = [180,234,367,575,706,854,978,1118,1355,8000];
				var crime_rating = score(CRIME_10, CRIME_TOTAL);
				var crime_color = coloring(crime_rating);
				
				document.getElementById("crime_circle").className = "c100 p" + 10*parseInt(crime_rating) + " " + crime_color;

				document.getElementById("crimeJS").innerHTML = crime_rating;

				
				var NOISE_10 = [95,127,213,285,356,434,531,644,781,2750];
				var noise_rating = score(NOISE_10, NOISE_TOTAL);
				var noise_color = coloring(noise_rating);

				document.getElementById("noise_circle").className = "c100 p" + 10*parseInt(noise_rating) + " " + noise_color;

				document.getElementById("noiseJS").innerHTML = noise_rating;

				
				var HOTLINE_10 = [0,1200,1750,2150,2640,3050,3375,4550,6000,10000];
				var hotline_rating = score(HOTLINE_10, HOTLINE_TOTAL);
				var hotline_color = coloring(hotline_rating);

				document.getElementById("hotline_circle").className = "c100 p" + 10*parseInt(hotline_rating) + " " + hotline_color;

				document.getElementById("hotlineJS").innerHTML = hotline_rating;


				var VIOLATIONS_10 = [100,200,350,450,550,740,975,1410,2225,23475];
				var violation_rating = score(VIOLATIONS_10, VIOLATIONS_TOTAL);
				var violation_color = coloring(violation_rating);

				document.getElementById("viola_circle").className = "c100 p" + 10*parseInt(violation_rating) + " " + violation_color;

				document.getElementById("violaJS").innerHTML = violation_rating;

				var Total_Rating = (parseInt(crime_rating) + parseInt(noise_rating) + parseInt(hotline_rating) + parseInt(violation_rating))/4;
				var Total_color = coloring(Total_Rating);

				document.getElementById("total_circle").className = "c100 p" + 10*parseInt(Total_Rating) + " big " + Total_color;

				document.getElementById("totalJS").innerHTML = Total_Rating;

			})
			.fail( function() {
				console.log("Error retrieving server query");
			});

		}
	});



		

		function styleCrime(list, type) {
		
		var string = '';
		
			$.each(list, function() {
				string = string + '<p id="listed">' + setIcon($(this).attr('cat')) + $(this).attr('cat') + ' (' + $(this).attr('freq') + ')</p>';

				if(type === 1) { CRIME_TOTAL += parseInt($(this).attr('rat')); }
				else if(type === 2) { NOISE_TOTAL += parseInt($(this).attr('rat')); }
				else { HOTLINE_TOTAL += parseInt($(this).attr('rat')); }
			}); 
			
			return string;
		}

		function styleViol(list, address) {
			var count = list.length;
			var string = '';

			$('.address').empty();
			$('.address').append(address);

			if (count === 0) {
				return "No violations found at this adress";
			}
			else {	
				
			string = string + "<p>Found <strong>" + total(list) + '</strong> violations'+ '</p>';	

			$.each(list, function() {
			string = string + '<h2 id="year">' + $(this).attr('name') + '</h2>' + pick($(this).attr('loInc'));
			});
			}
			
			return string;
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

		function pick(list) {
			var result = '';

			$.each(list, function() {
				result = result + '<p id="listed">' + setIcon($(this).attr('cat')) + $(this).attr('desc') + ' (' + $(this).attr('freq') + ')' + '</p>';
				VIOLATIONS_TOTAL = VIOLATIONS_TOTAL + parseInt($(this).attr('rat'));
			});

			return result;
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
			else if (cat === 'Prostitution') { src = 'CRIME/PROSTITION.png' }
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
                        VIOLA_SCORE = (10-i) + ((totalCount-VIOLATIONS_10[i-1])/((VIOLATIONS_10[i]-VIOLATIONS_10[i-1])));
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
	});
