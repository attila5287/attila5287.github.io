render( questions );
// ├update_question_no(index)   
// ├update_slider(index)  
// ├update_progress_bar(index)
// ├display_question(index)
// └start_timer() 
 

function render ( data ) {// by default before user interaction
  const index = 0; 
  $range = document.querySelector( "#range" );
  
  $range.setAttribute( "value", index );
  
  const length = data.length;
  $range.setAttribute("max", data.length-1);
  $range.addEventListener( "change", ( event ) => {
    const new_question_index = +$range.value;

		console.log("range-input-value :>> ", $range.value);
    update_question_no( +$range.value
      , length );
    update_progress_bar(length, new_question_index+1);
    display_question(data, new_question_index);
	});
  
  update_question_no( index, length );
  update_progress_bar( length, index );
  display_question( data, index );
  // console.log('number of questions in quiz :>> ', length);
}

function update_question_no ( index, length ) {
  $q_no = document.querySelector( "#q_no" ); // index+1
  
  $q_no.innerText = index+1;
  // console.log( 'index by default :>> ', index );
  $total_count = document.querySelector( "#q_count" );
  $total_count.innerText = length;
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

function update_progress_bar ( length, i ) {
  const step = Math.floor( 100 / length );
  $progress = document.querySelector( "#progress" );
  $progress.setAttribute( "step", step );
  const perc = step * i;
  const pro_style = "width: " + perc + "%; ";
  $progress.setAttribute( "style", pro_style );
  $progress.setAttribute( "aria-valuenow", perc );
}
// console.log('choices :>> ', choices);




