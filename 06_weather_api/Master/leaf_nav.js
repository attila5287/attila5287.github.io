init_leaf_navs('Denver');
const city = $("#leaf_selected_city").text().trim();

$.each($(".leaflet_city"), function (i, v) {
	$(this).on("click", () => {
    $( "#leaf_selected_city" ).text( $( this ).text() );
    $( this )
    .addClass( 'btn-primary' )
    .addClass( 'text-light' )
      ;
    $("#leaf_selected_img")
			.attr(
				"src",
				"../Master/img/maps/" + $(this).text().slice(0, 4).toLowerCase() + ".jpg"
			);
    $( this )
      .siblings()
      .removeClass( 'btn-primary' )
      .removeClass( 'text-light' )
      .addClass( 'btn-outline-primary' )
      ;
	});
});


function init_leaf_navs (city) {
  $.each( $( ".leaflet_city" ), function ( i, v ) {
    const cities = [
			"Denver",
			"Colorado Springs",
			"Pueblo",
			"Alamosa",
			"Monte Vista",
			"Durango"
		];
    const this_city = cities[ i ];
    if (this_city == city) {
      console.log('if if if ');
      $( this )
        .removeClass('btn-outline-primary')
        .addClass('btn-primary')
        .text( this_city );
    } else {
      $( this ).text( this_city );

    }
  } );
}
