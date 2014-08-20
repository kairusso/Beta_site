

    $(function() {
    $( "#sliderOwner" ).slider({
      value:50,
      min: 0,
      max: 100,
      step: 5,
      slide: function( event, ui ) {
        $( "#amountO" ).val( ui.value );
      }
    });
    $( "#amountO" ).val($( "#sliderOwner" ).slider( "value" ) );
  });

    $(function() {
    $( "#sliderCrime" ).slider({
      value:50,
      min: 0,
      max: 100,
      step: 5,
      slide: function( event, ui ) {
        $( "#amountC" ).val( ui.value );
      }
    });
    $( "#amountC" ).val($( "#sliderCrime" ).slider( "value" ) );
  });

    $(function() {
    $( "#sliderNoise" ).slider({
      value:50,
      min: 0,
      max: 100,
      step: 5,
      slide: function( event, ui ) {
        $( "#amountN" ).val( ui.value );
      }
    });
    $( "#amountN" ).val($( "#sliderNoise" ).slider( "value" ) );
  });

    $(function() {
    $( "#sliderViolations" ).slider({
      value:50,
      min: 0,
      max: 100,
      step: 5,
      slide: function( event, ui ) {
        $( "#amountV" ).val( ui.value );
      }
    });
    $( "#amountV" ).val($( "#sliderViolations" ).slider( "value" ) );
  });

    $(function() {
    $( "#sliderHotline" ).slider({
      value:50,
      min: 0,
      max: 100,
      step: 5,
      slide: function( event, ui ) {
        $( "#amountH" ).val( ui.value );
      }
    });
    $( "#amountH" ).val($( "#sliderHotline" ).slider( "value" ) );
  });

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

      var sliderHotline = $( "#amountH" ).val();
      var sliderViolations = $( "#amountV" ).val();
      var sliderNoise = $( "#amountN" ).val();
      var sliderCrime = $( "#amountC" ).val();
      var sliderOwner = $( "#amountO" ).val();

			var add = $("input#searchA").val().trim();
      var zip = $("input#searchZ").val().trim();
			add = add.replace(',', '');
			add = add.replace('.', '');
      zip = zip.replace(',', '');
      zip = zip.replace('.', '');

			
			var parts = add.split(" ");
			
			console.log(add);

      if (zip === '' || isNaN(zip)) {
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
	});
