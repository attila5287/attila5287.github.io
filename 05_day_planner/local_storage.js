function local_start ( start ) {
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
  $( ".save" ).on( "click", function ( i, v ) {
    
    const start = parseInt($( "#start" ).text());
    console.log('start :>> ', start);
    const k = `${i + start}`;
    stored[k] = 
    console.log(
			"data-ind :>> ",
			$(`#textarea_${i + start}`).attr("data-index")
		);
    console.log("val :>> ", $(`#textarea_${i + start}`).val());
    console.log("sblg :>> ", $(this).siblings("textarea").val());
    
    
    
  });
  
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
