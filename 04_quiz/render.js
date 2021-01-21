render( questions );
// ├update_stats(index)   
// ├update_slider(index)  
// ├update_progress_bar(index)
// ├display_question(index)
// └start_timer() 
 

function render ( data ) {// by default before user interaction
  const index = 0; 
  $index = document.querySelector( "#index" );
  $index.innerText = index;
  // console.log( 'index by default :>> ', index );
  
  const length = data.length;
  // console.log('number of questions in quiz :>> ', length);
  
  update_progress_bar( length, index );
  display_question( data, index );
  $total_count = document.querySelector( "#q_count" )
    ;
  $total_count.innerText = length;

  $range = document.querySelector( "#range" );
  range.setAttribute("max", data.length);
	$range.addEventListener("change", (event) => {
		console.log("event.target.id :>> ", $range.value);
	});
}

function display_question ( data, index ) {
  const d = data[ index ];
  console.log( 'question being displayed :>> ', d );

  $div = document.querySelector( ".question" );
  const $title = $div.querySelector( ".title" );
  $title.textContent = d.title;
  const choices = d.choices;
  $choices = $div.querySelectorAll( ".choice_text" );

  for ( let i = 0; i < choices.length; i++ ) {
    const c = choices[ i ];
    const $c = $choices[ i ];
    $c.textContent = c;

  }
}

function update_progress_bar ( length, index ) {
  const step = Math.floor( 100 / length );
  $progress = document.querySelector( "#progress" );
  $progress.setAttribute( "step", step );
  const perc = step * index;
  const pro_style = "width: " + perc + "%; ";
  $progress.setAttribute( "style", pro_style );
  $progress.setAttribute( "aria-valuenow", perc );
}
// console.log('choices :>> ', choices);




