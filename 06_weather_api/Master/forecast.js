function forecast_five_days ( city ) {
  const API_key = "42a5a7b661c854194cb0539e5fd1a86f";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}`;
  
  // console.log('url :>> ', url);
  $.ajax( {
    type: "GET",
    url: url,
  } ).then( ( w ) => {
    // console.log( 'w :>> ', w.list[0].main );
    // console.log( 'w :>> ', w.list[0].main.feels_like );
    $.each( $( ".fore_temp_f" ), function ( i, v ) {
      $( this )
        .attr( "data-temp_unit", 'fahrenheit' )
        .attr( "data-temp_read", Math.round( +w.list[ i * 7 ].main.temp-273 ) )
        ;
      $(this).text(Math.round(w.list[i * 7].main.temp)-273);
      
    });

    $( ".forecast" ).each( function ( i, el ) {
      $(this)
				.addClass("text-capitalize")
				.text(`${w.list[(i + 1) * 8 - 1].weather[0].description}`);
      // console.log('forecast main git upi :>> ', i);
    } );
    $( ".forecast-img" ).each( function ( i, el ) {
      
      // console.log( 'w.list[ i * 7 ] :>> ', w.list[ i * 7 ] );
      console.log( 'w.list[ i * 7 ] :>> ', w.list[ i * 7 ].main );
      
      const icon = w.list[ i * 7 ].weather[ 0 ].icon;
      const day_or_night = icon[ icon.length - 1 ];
      const styles = {
        d:'bg-info',
        n: 'bg-secondary',
      };
      $( this ).attr( "class", ""+styles[day_or_night] );
      
      $( this ).attr(
        "src",
        `https://openweathermap.org/img/wn/${w.list[ i * 7 ].weather[ 0 ].icon}@2x.png`
      );
      // console.log('i forecast img :>> ', i);  
    } );

    // console.log( 'w :>> ', w.list[ 0 ].weather[ 0 ] );
  } );
}
