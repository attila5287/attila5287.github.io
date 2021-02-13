$(".slider_buttons").each(function (i, el) {
$(this).on("click", function () {
  const current_city = $( '#weather-city' ).text( );
  const increment = +$( this ).attr( "data-increment" );
  const current_value = +$( '#slider' ).val();
  update_slider(current_value + increment, current_city); 
});
});
