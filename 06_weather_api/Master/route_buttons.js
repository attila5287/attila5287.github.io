console.log( 'route test' );
$("#vert_length").text(+$(".leaflet_city").length);

$('.route_btns').each(function (index, element) {
$(this).on("click", function () {
  const inc = +$(this).attr("data-increment");
  const vert_index = +$( "#vert_index" ).text();
  $( "#vert_index" ).text( +vert_index + inc );
  
  console.log( inc );
  console.log('object :>> ', vert_index);
  
  const el = $( '.leaflet_city' )[ vert_index + inc ] || $( '.leaflet_city' )[ -1 ];
    el.click()
  
});
  
});
