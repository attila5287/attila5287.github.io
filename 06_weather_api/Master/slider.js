function update_slider(v, city) {
	const API_key = "42a5a7b661c854194cb0539e5fd1a86f";
	const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}`;
	// console.log('url :>> ', url);
	

	$.ajax({
		type: "GET",
		url: url
	} ).then( ( w ) => {
		// console.log( 'w :>> ', w );

		$("#slider_datetxt").text(w.list[v].dt_txt);

		$( "#slider_humid" ).text( w.list[ v ].main.humidity );
		$("#slider_temp").attr("data_tempunit", 'F');
		$("#slider_temp").attr(
			"data_tempval",
			Math.round(+w.list[v].main.temp - 273)
		);
		$( "#slider_temp_c" ).text(
			Math.round( +w.list[ v ].main.temp - 273 ) +
			" C " );
		$("#slider_temp_f").text(
			+Math.round((+w.list[v].main.temp - 273 + 32) / 1.8) + " F "
		);
			
    $( "#slider_description" )
      .text( w.list[ v ].weather[ 0 ].description );
		$("#slider_icon").attr(
			"src",
      "https://openweathermap.org/img/wn/" +
      w.list[ v ].weather[ 0 ].icon +
      "@2x.png"
      
    );
    const icono = w.list[ v ].weather[ 0 ].icon;
    day_or_night = {
      'd' : 'day',
      'n' : 'night',
    }
    if ( day_or_night[ icono.slice( -1 ) ] == 'night' ) {
			$( "#slider_bg" )
				.removeClass('bg-info')
				.removeClass( 'bg-transparent' )
				.addClass( 'bg-secondary' );
			}
			if ( day_or_night[ icono.slice( -1 ) ] == 'day' ) {
			$( "#slider_bg" )
				.removeClass('bg-secondary')
				.removeClass( 'bg-transparent' )
				.addClass( 'bg-info' );
		}
		

    // $("#slider_icon").attr("src", w[v]);
    
		const s = $("#slider");

		s.on("change", function () {
			const changed = +$("#slider").val();
			$("#slider").val(changed);
			// console.log('changed :>> ', changed);
			$("#slider_index").text(`${city}: ${changed * 3} hours later`);

			$("#slider_description").text(w.list[changed - 1].weather[0].description);

			$("#slider_icon").attr(
				"src",
				"https://openweathermap.org/img/wn/" +
					w.list[changed - 1].weather[0].icon +
					"@2x.png"
			);
		});
	});
  
  $( "#slider" ).val( v );
  $( "#slider_index" ).text( `${city}: ${v * 3} hours later` );
  
}

// update_slider(8, "Denver"); 
