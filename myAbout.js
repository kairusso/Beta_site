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

	
	});
