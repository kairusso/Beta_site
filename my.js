	$(document).ready( function() {

		var VIOLATIONS_TOTAL = 0;
		var CRIME_TOTAL = 0;
		var NOISE_TOTAL = 0;
		var HOTLINE_TOTAL = 0;

		$("input#submit").click( function() {
				
			var address = $("input#search").val().trim();
			var addressArray = address.split(" ");
			var num = addressArray[0];
			var name = addressArray[1];
			console.log(num + " " + name);

			if (num === '' ||
				name === '') {
				alert("Please fill all Boxes");

			$('div.header').children().each( function() {
				$(this).val('');
			});
		}
		else {
			$.ajax({
				url: "my.php", 
				type: "POST",
				data: {streetnum : num, streetname : name},
				dataType: "json"
			})
			.done( function( returnedData ) {

				$('#results').css("padding-left", '15px');
				$('#results').css("padding-top", '15px');
				$('#results').css("padding-bottom", '15px');

				$('#results').empty();

				console.log(returnedData);
				styleViol(returnedData.list, returnedData.address);
				
				
				styleCrime(returnedData.crime, 1);
				var CRIME_10 = [180,234,367,575,706,854,978,1118,1355,8000];
				var crime_rating = score(CRIME_10, CRIME_TOTAL);
				
				var crime_color = coloring(crime_rating);
				document.getElementById("BreakdownC").style.backgroundImage = crime_color[0];
				document.getElementById("BreakdownC").style.backgroundImage = crime_color[1];
				document.getElementById("BreakdownC").style.backgroundImage = crime_color[2];
				document.getElementById("BreakdownC").style.borderWidth = "0";
				
				document.getElementById("crimeJS").innerHTML = crime_rating;
				
				styleCrime(returnedData.noise, 2);
				var NOISE_10 = [95,127,213,285,356,434,531,644,781,2750];
				var noise_rating = score(NOISE_10, NOISE_TOTAL);
				var noise_color = coloring(noise_rating);
				
				document.getElementById("BreakdownN").style.backgroundImage = noise_color[0];
				document.getElementById("BreakdownN").style.backgroundImage = noise_color[1];
				document.getElementById("BreakdownN").style.backgroundImage = noise_color[2];
				document.getElementById("BreakdownN").style.borderWidth = "0";
				
				document.getElementById("noiseJS").innerHTML = noise_rating;
				
				styleCrime(returnedData.hotline, 3);
				var HOTLINE_10 = [0,1200,1750,2150,2640,3050,3375,4550,6000,10000];
				var hotline_rating = score(HOTLINE_10, HOTLINE_TOTAL);
				var hotline_color = coloring(hotline_rating);
				
				document.getElementById("BreakdownH").style.backgroundImage = hotline_color[0];
				document.getElementById("BreakdownH").style.backgroundImage = hotline_color[1];
				document.getElementById("BreakdownH").style.backgroundImage = hotline_color[2];
				document.getElementById("BreakdownH").style.borderWidth = "0";
				
				document.getElementById("hotlineJS").innerHTML = hotline_rating;
				
				
				var VIOLATIONS_10 = [100,200,350,450,550,740,975,1410,2225,23475];
				var violation_rating = score(VIOLATIONS_10, VIOLATIONS_TOTAL);
				var violation_color = coloring(violation_rating);
				
				document.getElementById("BreakdownV").style.backgroundImage = violation_color[0];
				document.getElementById("BreakdownV").style.backgroundImage = violation_color[1];
				document.getElementById("BreakdownV").style.backgroundImage = violation_color[2];
				document.getElementById("BreakdownV").style.borderWidth = "0";
				
				document.getElementById("violaJS").innerHTML = violation_rating;
				
				var Total_Rating = (parseInt(crime_rating) + parseInt(noise_rating) + 
				parseInt(hotline_rating) + parseInt(violation_rating))/4;
				
				
				var Total_color = coloring(Total_Rating);
				
				document.getElementById("Total_A").style.backgroundImage = Total_color[0];
				document.getElementById("Total_A").style.backgroundImage = Total_color[1];
				document.getElementById("Total_A").style.backgroundImage = Total_color[2];
				document.getElementById("Total_A").style.borderWidth = "0";
				
				document.getElementById("totalJS").innerHTML = Total_Rating;
			})
			.fail( function() {
				console.log("Error retrieving server query");
			});

		}
	});

		function styleCrime(list, type) {
			$.each(list, function() {
				$('#crime_results').append('<p>' + $(this).attr('cat') + $(this).attr('freq') + '</p>');
				
				if(type === 1) { CRIME_TOTAL += parseInt($(this).attr('rat')); }
				else if(type === 2) { NOISE_TOTAL += parseInt($(this).attr('rat')); }
				else { HOTLINE_TOTAL += parseInt($(this).attr('rat')); }
			});
		}

		function styleViol(list, address) {
			var count = list.length;

			if (count === 0) {
				$('#violation_results').append("No violations found at this adress");
			}
			else {
			$('#violation_results').append("Found <strong>" + total(list) + '</strong> violations at: ' + address);	

			$.each(list, function() {
				$('#violation_results').append('<h2 id="year">' + $(this).attr('name') + '</h2><p>' + pick($(this).attr('loInc')) + '</p>');
			});
			}
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
				result = result + '<p>' + setIcon($(this).attr('cat')) + $(this).attr('desc') + ' (' + $(this).attr('freq') + ')' + '</p>' + '</br>';
				VIOLATIONS_TOTAL = VIOLATIONS_TOTAL + parseInt($(this).attr('rat'));
			});

			return result;
		}

		function setIcon(cat) {
			var src = '';

			if (cat === 'Trash') { src = 'trash.png'}
			else if (cat === 'Overgrown Weeds') { src = 'weeds.png' }
			else if (cat === 'Graffiti') { src = 'graffiti.png' }
			else if (cat === 'Permit/Registration') { src = 'permit.png' }
			else if (cat === 'Repair/Maintenance') { src = 'repair.png' }
			else if (cat === 'Safety/Fire Protection') { src = 'fire.png' }
			else { src = 'other.png' }

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
			
			return VIOLA_SCORE = VIOLA_SCORE.toFixed(2);
		}
		
		function coloring(Score_Color) {
			if(Score_Color < 1) {
				var temp =  ["-moz-radial-gradient(45px 45px 45deg, circle cover, #800000 20%, #993366 100%, #1A0000 45%)",
				"-webkit-radial-gradient(45px 45px, circle cover, #800000, #1A0000)",
				"radial-gradient(45px 45px 45deg, circle cover, #800000 20%, yellow 0%, #800000 45%)"];

				
			} else if (Score_Color < 2) {
				var temp = ["-moz-radial-gradient(45px 45px 45deg, circle cover, #FF5050 20%, #993366 100%, #4C1818 95%)",
				"-webkit-radial-gradient(45px 45px, circle cover, #FF5050, #4C1818)",
				"radial-gradient(45px 45px 45deg, circle cover, #FF5050 20%, yellow 0%, #4C1818 95%)"];

				
			} else if (Score_Color < 3) {
				var temp = ["-moz-radial-gradient(45px 45px 45deg, circle cover, #FF3300 80%, #336600 100%, #800000 95%)",
				"-webkit-radial-gradient(45px 45px, circle cover, #FF3300, #800000)",
				"radial-gradient(45px 45px 45deg, circle cover, #FF3300 100%, yellow 0%, #800000 95%)"];

				
			} else if (Score_Color < 4) {
				var temp = ["-moz-radial-gradient(45px 45px 45deg, circle cover, orange 100%, orange 5%, yellow 5%)",
				"-webkit-radial-gradient(45px 45px, circle cover, red, orange)",
				"radial-gradient(45px 45px 45deg, circle cover, orange 100% , orange 5%, yellow 5%)"];

			
			} else if (Score_Color < 5) {
				var temp = ["-moz-radial-gradient(45px 45px 45deg, circle cover, #FFFF00 80%, #336600 100%, #CC3300 95%)",
				"-webkit-radial-gradient(45px 45px, circle cover, #FFFF00, #CC3300)",
				"radial-gradient(45px 45px 45deg, circle cover, #FFFF00 100%, yellow 0%, #CC3300 95%)"];

			
			} else if (Score_Color < 6) {
				var temp = ["-moz-radial-gradient(45px 45px 45deg, circle cover, #FFFF00 80%, #336600 100%, #FF6600 95%)",
				"-webkit-radial-gradient(45px 45px, circle cover, #FFFF00, #FF6600)",
				"radial-gradient(45px 45px 45deg, circle cover, #FFFF00 100%, yellow 0%, #FF6600 95%)"];

			
			} else if (Score_Color < 7) {
				var temp = ["-moz-radial-gradient(45px 45px 45deg, circle cover, yellow 100%, orange 50%, red 5%)",
				"-webkit-radial-gradient(45px 45px, circle cover, yellow, orange)",
				"radial-gradient(45px 45px 45deg, circle cover, yellow 100%, orange 50%, red 5%)"];

			
			} else if (Score_Color < 8) {
				var temp = ["-moz-radial-gradient(45px 45px 45deg, circle cover, #FFFF00 80%, #336600 100%, #66FF33 95%)",
				"-webkit-radial-gradient(45px 45px, circle cover, #FFFF00, #66FF33)",
				"radial-gradient(45px 45px 45deg, circle cover, #FFFF00 100%, yellow 0%, ##66FF33 95%)"];

			
			} else if (Score_Color < 9) {
			var temp = ["-moz-radial-gradient(45px 45px 45deg, circle cover, #00FF00 0%, #007D00 100%, #004000 95%)",
			"-webkit-radial-gradient(45px 45px, circle cover, #00FF00, #007D00)",
			"radial-gradient(45px 45px 45deg, circle cover, #00FF00 0%, #007D00 100%, #004000 95%)"];

			
			
			} else {
			var temp = ["-moz-radial-gradient(45px 45px 45deg, circle cover, #66FF66 80%, #336600 100%, #142F14 95%)",
			"-webkit-radial-gradient(45px 45px, circle cover, #66FF66, #142F14)",
			"radial-gradient(45px 45px 45deg, circle cover, #66FF66 100%, yellow 0%, #142F14 95%)"];
			}
			return temp;
		}
	});
