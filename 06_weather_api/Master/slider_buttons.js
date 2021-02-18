$(".slider_btn").each(function (i, el) {
$(this).on("click", function () {
  const current_city = $( '#weather-city' ).text( );
  const increment = +$( this ).attr( "data-increment" );
  const current_value = +$( '#slider' ).val();
  const changed = current_value + increment; 
  update_slider( current_value + increment, current_city ); 
});
});
