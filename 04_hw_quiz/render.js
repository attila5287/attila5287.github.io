render( questions );
// ├ update_question_no(index)   +
// ├ update_slider(index)        +
// ├ update_progress_bar(index)  +
// ├ display_question(index)     +
// ├ start_timer()               -
// └ choice_listener()
 

function render ( data ) {// by default before user interaction
  const index = 0; 
  $range = document.querySelector( "#range" );
  $range.setAttribute( "value", index );
  const length = data.length;

  $choice_btns = document.querySelectorAll( ".choice_btn" );
  let answers = {};

  update_choice_btns( index, answers );
  
  
  $range.setAttribute("max", data.length-1);
  $range.addEventListener( "change", ( event ) => {
    const new_question_index = +$range.value;
    
    console.log("range-input-value :>> ", $range.value);
    console.log( "range-input-value :>> ", +$range.value );
    
    
    update_choice_btns(new_question_index, answers);
    
    update_question_no( +$range.value
      , length );
    update_progress_bar(length, new_question_index+1);
    display_question( data, new_question_index );
    
	});
  
  update_question_no( index, length );
  update_progress_bar( length, index );
  display_question( data, index );
  // console.log('number of questions in quiz :>> ', length);
}

function update_choice_btns ( index, answers ) {
  $choice_btns.forEach( el => {
    el.setAttribute( "data-question", `q${index}` );

    el.addEventListener( "click", ( event ) => {
      const key = event.target.getAttribute( "data-question" );
      answers[ key ] = event.target.id; // id's are preset
      console.log( 'answers :>> ', answers );
    } );


  } );
}

function update_question_no ( index, length ) {
  const $q_no = document.querySelector( "#q_no" ); // index+1
  
  $q_no.innerText = index+1;
  // console.log( 'index by default :>> ', index );
  const $total_count = document.querySelector( "#q_count" );
  $total_count.innerText = length;
}

function display_question ( data, index ) {
  const d = data[ index ];
  console.log( 'question on display :>> ', d.title );

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

const $start = document.getElementById( "start" );

function start_stop_quiz () {
  const $iconstart = document.getElementById("iconstart");
  const mode = $start.getAttribute("data-mode");
  console.log( "mode :>> ", mode );
  if (mode == "start") {
    start_quiz();  
    
  } else {
    stop_quiz();
  }
  function stop_quiz () {
    $iconstart.className = "far fa-play-circle text-dark";
		$start.className =
			"btn btn-lg btn-primary btn-block rounded-xl text-center";
    $start.setAttribute( "data-mode", "start" );
    console.log('test stop quiz');
    
    document.getElementById( "mode" ).innerText = "Re-start Quiz";
    
    document.querySelectorAll( ".after" )
      .forEach( element => {
          element.classList.add("d-none");
      } );
    
    
    document.querySelectorAll( ".before" )
      .forEach( $el => {
      // console.log('after');
      $el.classList.remove("d-none");
      } );
    
  }
  function start_quiz () {
    $iconstart.className = "far fa-stop-circle";
    $start.className =
      "btn btn-lg btn-outline-primary btn-block rounded-xl text-center";
  $start.setAttribute("data-mode", "stop");
    document.getElementById("mode").innerText = "Stop Quiz:";
    document.querySelectorAll( ".before" )
      .forEach( element => {

        element.classList.add( "d-none" );
        
      } );
    
    document.querySelectorAll( ".after" )
      .forEach( element => {
      // console.log('after');
      element.classList.remove('d-none');
      } );
    
  } 

};
$start.onclick = start_stop_quiz;

