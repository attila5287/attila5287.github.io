const default_city = 'Denver';
render(default_city);
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
function render (c) {
	forecast_five_days( c );
	todays_weather( c );
	update_slider( 8, c );
	update_history( c );
}

