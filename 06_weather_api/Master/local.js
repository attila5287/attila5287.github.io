init_history();

function init_history () {
  const d = {
    0: "Denver",
    1: "Pueblo",
    2: "Alamosa",
    3: "Durango"
  };
  const logged_first = window.localStorage.getItem( "history" ) || d;
  window.localStorage.setItem( "history", JSON.stringify( d ) );
  
  console.log( "logged_f :>> ", JSON.parse( logged_first ) ); 
  Object.keys( d ).map( k => d[ k ] ).forEach(c => update_history(c));
}

function update_history ( city ) {

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
