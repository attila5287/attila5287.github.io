const len = $( ".leaflet_city" ).length; // count
let vert_index = +$( "#vert_index" ).text();
$("#vert_length").text(+len);

// console.log('len :>> ', len);

$('.route_btns').each(function (index, element) {
$(this).on("click", function () {
  const inc = +$( this ).attr( "data-increment" );
  // console.log( 'increment :>> ', inc );
  
  let fin_idx = vert_index + inc; // final index
  // console.log( 'final index :>> ', fin_idx );
  // console.log('len :>> ', len);
  if (fin_idx < len && fin_idx >= 0) {
		$(".leaflet_city")[fin_idx].click();
    $( "#route_progress" ).attr( "style", "width: " + fin_idx / ( len - 1 ) * 100 + "%" );
    
    $( "#vert_index" ).text( fin_idx + 1 );
    
    vert_index = fin_idx;
    
	} else {
    console.log("route btn else");
	}
  
});
  
});
