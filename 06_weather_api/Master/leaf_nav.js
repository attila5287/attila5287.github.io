init_leaf_navs('Denver');
const city = $("#leaf_selected_city").text().trim();

$.each($(".leaflet_city"), function (i, v) {
  $( this ).on( "click", () => {
    const clicked = $(this).text();
    $( "#leaf_selected_city" ).text( clicked );
    $("#search-value").val(clicked);
    const default_city = "Denver";
		forecast_five_days($(this).text());
		todays_weather($(this).text());
		update_slider(8, $(this).text());
		update_history($(this).text());
    $( this )
    .removeClass( 'btn-primary' )
    .addClass( 'btn-dark' )
    .addClass( 'text-light' )
      ;
    $("#leaf_selected_img").attr(
			"src",
			"https://raw.githubusercontent.com/attila5287/rota-img/main/maps/" +
				$(this).text().slice(0, 4).toLowerCase() +
				".JPG"
		);
    $(this)
			.siblings()
			.removeClass("btn-dark")
			.removeClass("text-light")
			.addClass("selected_leaflet")
			.addClass("btn-primary");
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
      // console.log('if this city  ');
      $(this)
				.removeClass("selected_leaflet")
				.removeClass("btn-primary")
				.addClass("btn-dark")
				.text(this_city);
    } else {
      $( this ).text( this_city );

    }
  } );
}
