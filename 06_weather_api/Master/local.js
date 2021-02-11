function update_history ( city ) {
  
  // window.localStorage.setItem( "test", "" );
  // window.localStorage.getItem("test");
  
  let hist_btn = $( '<button>' );
  $( "#history_box" ).append(hist_btn);
  
  hist_btn.attr( "type", "button" )
  .attr("data-name", city)
  .attr(
    "class",
    "btn btn-outline-secondary btn-sm rounded-xl locally-stored"
    );
    
  hist_btn.text(city);
    
  
  $.each($('.locally-stored'), function (i, v) { 
  console.log('i :>> ', i);  
    $( this ).on( "click", function () {
      const clicked = $( this ).text().trim();;
      console.log('clicked :>> ', clicked);
  
  
      $( '#search-value' ).val( clicked );
      forecast_five_days(clicked);
      todays_weather(clicked);
      update_slider(8, clicked); 
      
  
    });
    
  });

}  
