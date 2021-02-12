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
  city = city.trim();

  const hist = JSON.parse( window.localStorage.getItem( "history" )
  ) || {};
  // console.log( 'loc stored cities :>> ', Object.keys( hist ).map( d => hist[ d ] ) );
  const set = new Set( Object.keys( hist ).map( d => hist[ d ] ) );
  // console.log('set :>> ', set);



  const already_in_recents = set.has(city);
  if ( already_in_recents) {
    
  console.log('city in recents'); 
  } else {

    const count = +$( "#history_counter" ).text();
    hist[ count ] = city;
    $( "#history_counter" ).text( count + 1 );
    window.localStorage.setItem( "history", JSON.stringify( hist ) );

    console.log( 'hist :>> ', hist );
    append_button( city );
  }
  
  
}  

function append_button ( city ) {
  let hist_btn = $( '<button>' );

  $( "#history_box" ).append( hist_btn );

  hist_btn.attr( "type", "button" )
    .attr( "data-name", city )
    .attr(
      "class",
      "btn btn-outline-secondary btn-sm rounded-xl locally-stored mx-2"
    );

  hist_btn.text( city );

  $.each( $( '.locally-stored' ), function ( i, v ) {
    // console.log('i :>> ', i);  
    $( this ).on( "click", function () {
      const clicked = $( this ).text().trim();;
      console.log( 'clicked :>> ', clicked );

      $( '#search-value' ).val( clicked );
      forecast_five_days( clicked );
      todays_weather( clicked );
      update_slider( 8, clicked );
    } );
  } );
}

