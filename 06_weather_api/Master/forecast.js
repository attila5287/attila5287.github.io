// console.log( 'test forecast' );
// forecast_five_days( 'Denver' );
const todays_date =  moment().format( "MMM Do YY" ) ;


function forecast_five_days ( city ) {
  const API_key = "42a5a7b661c854194cb0539e5fd1a86f";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}`;
  
  // console.log('url :>> ', url);
  $.ajax( {
    type: "GET",
    url: url,
  } ).then( ( w ) => {
    // console.log( 'test ajax forecast');
    // console.log( 'w :>> ', w.city );
    $( "#weather-sunrise" ).text( "sunrise " + convert2HHMM( w.city.sunrise ) );
    $( "#weather-sunset" ).text( "sunset " + convert2HHMM( w.city.sunset ) );
    $( ".forecast" ).each( function ( i, el ) {
      $(this)
				.addClass("text-capitalize")
				.text(`${i + 1}. ${w.list[(i + 1) * 8 - 1].weather[0].description}`);
      // console.log('forecast main i :>> ', i);
    } );
    $( ".forecast-img" ).each( function ( i, el ) {
      $( this ).attr(
        "src",
        `http://openweathermap.org/img/wn/${w.list[ i * 7 ].weather[ 0 ].icon}@2x.png`
      );
      // console.log('i forecast img :>> ', i);  
    } );

    // console.log( 'w :>> ', w.list[ 0 ].weather[ 0 ] );
  } );
}