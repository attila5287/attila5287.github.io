// 
def_history();
function init_history () {
  $( '#history_box' ).empty();
  const hist = window.localStorage.getItem( "history" ) || JSON.stringify( {} );
  console.log('hist init :>> ', hist);
  window.localStorage.setItem("history", hist);
}
function reset_button () {
  console.log( 'test reset' );
  init_history();
  $( '#history_counter' ).text(0);
  $( '#history_box' ).empty();
}

function def_history () {
  $( '#history_box' ).empty();
  
  window.localStorage.setItem( "history", JSON.stringify( {} ) );

  const def_cities = [ "Pueblo", "Alamosa", "Durango", "Denver" ];
  for (let i = 0; i < def_cities.length; i++) {
    const c = def_cities[i];
    update_history( c );
    
  }
}


function append_button ( city ) {
  let hist_btn = $( "<button>" );

  $( "#history_box" ).append( hist_btn );

  hist_btn
    .attr( "type", "button" )
    .attr( "data-name", city )
    .attr(
      "class",
      "btn btn-outline-secondary btn-sm border-0 rounded-xl locally-stored mx-2"
    );

  hist_btn.text( city );

  $.each( $( ".locally-stored" ), function ( i, v ) {
    // console.log('i :>> ', i);
    $( this ).on( "click", function () {
      const clicked = $( this ).text().trim();
      console.log( "clicked :>> ", clicked );

      $( "#search-value" ).val( clicked );
      forecast_five_days( clicked );
      todays_weather( clicked );
      update_slider( 8, clicked );
    } );
  } );
}
function update_history ( c ) {
  const city = c.trim();
  console.log('city :>> ', city);

  const hist = JSON.parse( window.localStorage.getItem( "history" ) );
  const cities = Object.keys( hist ).map( d => hist[ d ] );
  console.log('cities :>> ', cities);
  const set = new Set( cities ) ;
  console.log('set :>> ', set);

  const already_in_recents = set.has( city ); // bool
  
  console.log( 'already in recents :>> ', already_in_recents );
  
  const count = +$( "#history_counter" ).text();
  if ( already_in_recents) {
    console.log( `${city} in recents` ); 
    // console.log('recents hist :>> ', hist);
    $( "#history_counter" ).text( count );
    window.localStorage.setItem( "history", JSON.stringify( hist ) );
  } else {// add button to hist box
    append_button( city );
    hist[ count ] = city;
    $( "#history_counter" ).text( count + 1 );
    window.localStorage.setItem( "history", JSON.stringify( hist ) );
    console.log( 'hist chk add:>> ', hist );


  }
  
  
}  

