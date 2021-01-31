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
  for ( let i = 1; i <= 12; i++ ) {
    res[ i ] = '';
	}
  window.localStorage.setItem( "all_hours", JSON.stringify( res ) );
  const log = JSON.parse(window.localStorage.getItem("all_hours"));
  console.log('loc str blanks :>> ', log);
}
localstore_blanks();
function localstore_saveall () {
  const stored = JSON.parse( window.localStorage.getItem( "all_hours" ) );
  const length = Object.keys(stored).length;
  const forms = $( ".user_input" );
  
  for ( let i = 1; i <= length; i++ ) {
    stored[ i ] = forms[ i ].attr("value") || stored[i];
  };
  
  window.localStorage.setItem( "all_hours", JSON.stringify( res ) );
  const log = JSON.parse(window.localStorage.getItem("all_hours"));
  console.log('loc str blanks :>> ', log);
};

function localstore_save (i, data) {
  let json = JSON.parse(window.localStorage.getItem("all_hours"));
  json[i] = "";
  json[i] = data;
  window.localStorage.setItem( "all_hours", JSON.stringify( res ) );
  const log = JSON.parse(window.localStorage.getItem("all_hours"));
  console.log('loc str blanks :>> ', log);
}
