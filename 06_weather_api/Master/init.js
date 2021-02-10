console.log('init test');


const default_city = 'Denver';
forecast_five_days(default_city);
todays_weather( default_city );


$("#search-value").on("change", function () {
	const city_input = $(this).val();
	forecast_five_days(city_input);
	todays_weather( city_input );
	update_slider(8, city_input); 
} );
