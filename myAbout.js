	$(document).ready( function() {

		

		$("input#search").keyup(function(event){
    		if(event.keyCode == 13){
        		$("input#submit").click();
    		}
		});

		

		$("input#submit").click( function() {

      var sliderHotline = $( "#amountH" ).val();
      var sliderViolations = $( "#amountV" ).val();
      var sliderNoise = $( "#amountN" ).val();
      var sliderCrime = $( "#amountC" ).val();
      var sliderOwner = $( "#amountO" ).val();

			var add = $("input#search").val().trim();
			add = add.replace(',', '');
			add = add.replace('.', '');
			
			var parts = add.split(" ");
			
			console.log(add);

			if (add === '', isNaN(parts[0])) {
				alert("Please fill the box correctly");

			$('div.header').children().each( function() {
				$(this).val('');
			});
		}
		else {


			//var url = "http://localhost:8888/search_final.html?parameter=" + add + "&%&" + sliderOwner + "/" + sliderCrime + "/" + sliderViolations + "/" + sliderHotline + "/" + sliderNoise ;
			var url = "http://localhost:8888/search_final.html?parameter=" + add + "&%&" +  "1/1/1/1/1";

			window.open(url,"_self")

			

			.fail( function() {
				console.log("Error retrieving server query");
			});

		}
		});
	});
