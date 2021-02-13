init_leaf_navs();
const city = $("#leaf_selected_city").text().trim();

$.each($(".leaflet_city"), function (i, v) {
	$(this).on("click", () => {
    $( "#leaf_selected_city" ).text( $( this ).text() );
    $( this )
    .addClass( 'btn-primary' )
    .addClass( 'text-light' )
    ;
    
    $( this )
      .siblings()
      .removeClass( 'btn-primary' )
      .removeClass( 'text-light' )
      .addClass( 'btn-outline-primary' )
      ;
	});
});


function init_leaf_navs () {
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
    $( this ).text( this_city );
  } );
}
