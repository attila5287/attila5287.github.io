function local_start(start) {
	localStorage.setItem("start", start);
	console.log(" locally stored:>> ", localStorage.getItem("start"));
}

function localstore_total(total) {
	window.localStorage.setItem("total", total);
	console.log("local_total :>> ", window.localStorage.getItem("total"));
}
function localstore_blanks () {
  let res = {};
  for ( let i = 0; i <= 24; i++ ) {
    res[ i ] = '';
  }
  window.localStorage.setItem( "all_hours", JSON.stringify( res ) );
  const log = JSON.parse(window.localStorage.getItem("all_hours"));
  console.log('loc str blanks :>> ', log);
}

function localstore_saveall () {
  const stored = JSON.parse( window.localStorage.getItem( "all_hours" ) );
  const forms = $( ".user_input" );
  console.log( 'forms :>> ', forms.length );
  $(".user_input").each(() => {
    console.log('test');
  });$( ".user_input" );
  
  window.localStorage.setItem( "all_hours", JSON.stringify( stored ) );
  const log = JSON.parse(window.localStorage.getItem("all_hours"));
  console.log('loc save all :>> ', log);
};

function localstore_save (i, data) {
  let json = JSON.parse(window.localStorage.getItem("all_hours"));
  json[i] = "";
  json[i] = data;
  window.localStorage.setItem( "all_hours", JSON.stringify( res ) );
  const log = JSON.parse(window.localStorage.getItem("all_hours"));
  console.log('loc str blanks :>> ', log);
}
