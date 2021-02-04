// console.log( 'test forecast' );
const city = 'Denver';

const API_key = "42a5a7b661c854194cb0539e5fd1a86f";

const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}`;

// console.log('url :>> ', url);
$.ajax({
  type: "GET",
  url: url,
} ).then( ( w ) => {
  // console.log( 'test ajax forecast');
  console.log( 'w :>> ', w.city );
  $("#weather-sunrise").text("sunrise " + convert2HHMM(w.city.sunrise));
	$("#weather-sunset").text("sunset " + convert2HHMM(w.city.sunset));
  $(".forecast").each(function (i, el) {
    $( this ).text( w.list[ i * 8 ].weather[ 0 ].main );
    console.log('i :>> ', i);
	});
  $(".forecast-img").each(function (i, el) {
    $( this ).attr("src", w.list[ i * 8 ].weather[ 0 ].icon );
    console.log('i :>> ', i);
	});
  
  // console.log( 'w :>> ', w.list[ 0 ].weather[ 0 ] );
  // console.log( 'w :>> ', w.list[ 0 ].weather[ 0 ] );

});
