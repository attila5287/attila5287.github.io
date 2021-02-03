// console.log( 'test forecast' );
const city = 'Denver';

const API_key = "42a5a7b661c854194cb0539e5fd1a86f";

const forecast_url =
	"https://api.openweathermap.org/data/2.5/forecast?q=" +
	city +
	"&appid=" +
	API_key;

// console.log('forecast_url :>> ', forecast_url);
$.ajax({
  type: "GET",
  url: forecast_url,
} ).then( ( w ) => {
  console.log( 'w :>> ', w );
  console.table(w);
  console.log( 'test ajax forecast');
});
