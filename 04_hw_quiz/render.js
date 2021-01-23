function render ( data) {// by default before user interaction
  let answers = {};
  let index = 0; 
  let length = data.length;
  display_question(data, index);
  update_question_no(length, index);
  test_input(index, data);
  const $seconds = document.getElementById( "seconds" );
  function setTime ( index, length ) {
    let secondsLeft = 10;
		var timerInterval = setInterval(function () {
			update_progress_bar(10, secondsLeft);
			// console.log("secondsLeft :>> ", secondsLeft);

			$seconds.textContent = secondsLeft;

			secondsLeft--;
      if ( secondsLeft == 0 ) {
        if (data[index+1]) {
          console.log(data[index + 1]);
          display_question(data, index + 1);
          update_question_no(length, index + 1);
          test_input(index + 1, data);
          setTime(index + 1, 5);
          
        } else {
          secondsLeft = 0;
          console.log( "interval cleared" );
          
          $more_after = document.querySelectorAll( ".more_after" );
          $more_after.forEach(($el) => {
						$el.classList.add("d-none");
					});
          
          
          clearInterval( timerInterval );
        }
			}
		}, 1000);
	}
  setTime( index, length );
  
  
  function test_input (index, data) {
    $range = document.querySelector( "#range" );
    $range.setAttribute( "value", index );
    $range.setAttribute( "max", data.length - 1 );
    $range.addEventListener( "change", ( event ) => {
      // console.log( "range-input-value :>> ", +$range.value );
      const new_question_index = +$range.value;

      update_question_no( length, new_question_index );
      
      display_question( data, new_question_index );


    } );
  }
}

function display_question(data, idx) {
  const q = data[ idx ];
  if (!q) {
    document.querySelector( ".question" ).classList.add( "d-none" );
  } else {
    // console.log( 'question on display :>> ', d.title );
  
    $div = document.querySelector(".question");
    const $title = $div.querySelector(".title");
    $title.textContent = q.title;
    const choices = q.choices;
    $choices = $div.querySelectorAll(".choice_text");
    $btns = document.querySelectorAll(".choice_btn");
    for (let i = 0; i < choices.length; i++) {
      const text_content = choices[i];
      const $c = $choices[i];
      const $btn = $btns[i];
      $c.textContent = text_content;
      $btn.setAttribute("data-choice_text", text_content);
      $btn.setAttribute("data-solution", `${questions[idx].answer}`);
      $btn.setAttribute("data-no", `${idx}`);
    }
    const answers = data.map( d => d.answer ); 
  
    $btns.forEach( ( el, i ) => {
      el.addEventListener("click", (event) => {
        const key = event.target.getAttribute("data-no");
        const correct_answers = questions.map((d) => d.answer);
        answers[key] = event.target.dataset.choice_text;
        console.log("user answered :>> ", answers[key]);
        console.log("solution manual :>> ", correct_answers[key]);
      });
    });
    
  }
}

function update_question_no(length, no) {
	const $q_no = document.querySelector("#q_no"); // index+1

	$q_no.innerText = no + 1;
	// console.log( 'index by default :>> ', index );
	const $total_count = document.querySelector("#q_count");
	$total_count.innerText = length;
}
function update_progress_bar ( total, comp ) {//index and length
  const step = Math.floor(100 / total);
  $progress = document.querySelector( "#progress" );
  $progress.setAttribute( "step", step );
  const perc = step * comp;
  const style_perc = "width: " + perc + "%; ";
  $progress.setAttribute( "style", style_perc );
  $progress.setAttribute( "aria-valuenow", perc );
}

const $start = document.getElementById( "start" );

function start_stop_quiz () {
  render(questions);
  
  
  
  
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
