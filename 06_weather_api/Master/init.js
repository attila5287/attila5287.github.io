const default_city = 'Denver';
forecast_five_days(default_city);
todays_weather( default_city );
update_slider( 8, default_city ); 
update_history(default_city);
// git up

$("#search-value").on("change", function () {
	const city_input = $(this).val();
	forecast_five_days(city_input);
	todays_weather( city_input );
	update_slider( 8, city_input ); 
	update_history( city_input );
	

} );
$("#reset_button").on("click", reset_button);
$("#def_btn").on("click", def_history);
