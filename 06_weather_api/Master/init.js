console.log('init test');

const default_city = 'Denver';
forecast_five_days(default_city);
todays_weather( default_city );
<<<<<<< HEAD
// git up
=======
let index = 1;
setInterval( ( ) => {
	update_slider( index, default_city ); 
	if (index == 40) {
		update_slider( 1, default_city ); 
		
	} else {
		index++
		
	}
	
}, 500);
>>>>>>> 4736211808c6a526cc30c01693b292883e8ca035

$("#search-value").on("change",  () => {
	const city_input = $(this).val();
	forecast_five_days(city_input);
	todays_weather( city_input );
} );
