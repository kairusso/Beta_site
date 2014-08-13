  	$(function() {
    	$( "#sliderOwner" ).slider({
      		range: "min",
      		value: 1,
      		min: 1,
      		max: 100,
      		slide: function( event, ui ) {
        		$( "#amountO" ).val( ui.value );
      		}
    	});
    	$( "#amountO" ).val($( "#sliderOwner" ).slider( "value" ) );
  	});

  	$(function() {
    	$( "#sliderCrime" ).slider({
      		range: "min",
      		value: 1,
      		min: 1,
      		max: 100,
      		slide: function( event, ui ) {
        		$( "#amountC" ).val( ui.value );
      		}
    	});
    	$( "#amountC" ).val($( "#sliderCrime" ).slider( "value" ) );
  	});

  	$(function() {
    	$( "#sliderNoise" ).slider({
      		range: "min",
      		value: 1,
      		min: 1,
      		max: 100,
      		slide: function( event, ui ) {
        		$( "#amountN" ).val( ui.value );
      		}
    	});
    	$( "#amountN" ).val($( "#sliderNoise" ).slider( "value" ) );
  	});

  	$(function() {
    	$( "#sliderViolations" ).slider({
      		range: "min",
      		value: 1,
      		min: 1,
      		max: 100,
      		slide: function( event, ui ) {
        		$( "#amountV" ).val( ui.value );
      		}
    	});
    	$( "#amountV" ).val($( "#sliderViolations" ).slider( "value" ) );
  	});

  	$(function() {
    	$( "#sliderHotline" ).slider({
      		range: "min",
      		value: 1,
      		min: 1,
      		max: 100,
      		slide: function( event, ui ) {
        		$( "#amountH" ).val( ui.value );
      		}
    	});
    	$( "#amountH" ).val($( "#sliderHotline" ).slider( "value" ) );
  	});

	$(document).ready( function() {

		

		$("input#search").keyup(function(event){
    		if(event.keyCode == 13){
        		$("input#submit").click();
    		}
		});

		

		$("input#submit").click( function() {

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


			var url = "http://localhost:8888/search_final.html?parameter=" + add;
			

			window.open(url,"_self")

			

			.fail( function() {
				console.log("Error retrieving server query");
			});

		}
		});
	});
