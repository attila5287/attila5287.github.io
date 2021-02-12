function reset_button () {
  console.log( 'test reset' );
  
  window.localStorage.setItem( "history", null );
  $( '#history_counter' ).text(0);
  $( '#history_box' ).empty();
}
$( '#reset_button' ).on( "click", reset_button );

function init_history () {
  [
     "Pueblo",
     "Alamosa",
     "Durango"
  ].forEach(c => update_history(c));
}

function update_history ( city ) {
  $( "#history_counter" ).text( +$( "#history_counter" ).text() + 1 );
  
  const count = +$( "#history_counter" ).text();

  const hist = JSON.parse( window.localStorage.getItem( "history" )
  ) || {};
  console.log('hist :>> ', hist);
  hist[count] = city;
  // console.log( 'exi :>> ', hist );
  window.localStorage.setItem( "history", JSON.stringify( hist ) );
  
  let hist_btn = $( '<button>' );
  
  $( "#history_box" ).append(hist_btn);
  
  hist_btn.attr( "type", "button" )
  .attr("data-name", city)
  .attr(
    "class",
    "btn btn-outline-secondary btn-sm rounded-xl locally-stored mx-2"
    );
    
  hist_btn.text(city);
    
  $.each($('.locally-stored'), function (i, v) { 
  // console.log('i :>> ', i);  
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
