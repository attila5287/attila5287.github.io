$send_btn = document.getElementById("send_btn");
$send_btn.onclick = () => {
	console.log("test send your score button");
  $icn = document.getElementById( "iconsent" );
  $icn.setAttribute( "class", "fas fa-check-circle" );
  $send_btn.classList.remove("btn-outline-primary");
  $send_btn.classList.add("btn-outline-secondary");
  
};
window.localStorage.setItem( "test", "test" );
console.log( 'object :>> ', window.localStorage.getItem( "test" ) );

function render ( data ) {// by default before user interaction
  let answers = {};
  let index = 0; 
  let length = data.length;
  let scores = {};
  for (let n = 0; n < data.length; n++) {
    const k = `points_${n}`;
    scores[k] = 0;
  }
  display_question(data, index, scores);
  update_question_no(length, index);
  update_slider( index, data );
  setTime(index, length, data);
}
function display_question(data, idx, scores) {
  const q = data[ idx ]; // question
	if (!q) {
		document.querySelector(".question").classList.add("d-none");
	} else {
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
		const answers = data.map((d) => d.answer);
    $score = document.getElementById( "score" );
    

    const length = data.length;
		$btns.forEach(($btn, i) => {
      $btn.addEventListener( "click", ( event ) => {
				const key = event.target.getAttribute("data-no");
				const solutions = questions.map((d) => d.answer);
        answers[key] = event.target.dataset.choice_text;
        // console.log('question no :>> ', key);
        // console.log('user answered :>> ', answers[key]);
        // console.log( 'correct answer  :>> ', solutions[ key ] );
				
        if ( answers[ key ] == solutions[ key ] && event.target == $btn ) {
          // console.log('scores :>> ', scores);
          const k = `points_${idx}`;
          const points = Math.round( 100 / length );
          scores[ k ] = points;

          // console.log('user scores points :>> ', points);
          
          const total_points = Object.keys( scores )
          .map((k) => scores[k])
          .reduce( ( x, y ) => x + y );
          
					$score.textContent = +total_points;
          
        } else {
          // console.log('no points');
          $score.textContent = +$score.textContent;
				}

        if (data[idx + 1] && event.target.id == $btn.id) {
          display_question( data, idx + 1, scores );
					update_question_no(length, idx + 1);
					update_slider(idx + 1, data);
				} else {
					// secondsLeft = 0;
					console.log("interval cleared");

					$viz_after = document.querySelectorAll(".viz_after");
					$viz_after.forEach(($el) => {
            $el.classList.remove("d-none");
					});
					$hide_after = document.querySelectorAll(".hide_after");
					$hide_after.forEach(($el) => {
						$el.classList.add("d-none");
					});
				}

			});
		});
	}
}

function setTime ( index, length, data ) {
  const $seconds = document.getElementById("seconds");
  let secondsLeft = 60;
  const round_duration = secondsLeft; //static

  var timerInterval = setInterval(function () {
    update_progress_bar(round_duration, secondsLeft);
    // console.log("secondsLeft :>> ", secondsLeft);

    $seconds.textContent = secondsLeft;

    secondsLeft--;
    if ( secondsLeft == 0 ) {
      clearInterval( timerInterval );
    }
  }, 1000);
}

function update_slider (index, data) {
  $range = document.querySelector( "#range" );
  $range.setAttribute( "value", index );
  $range.setAttribute( "max", data.length - 1 );

}


function update_question_no(length, no) {
	const $q_no = document.querySelector("#q_no"); // index+1

	$q_no.innerText = no + 1;
	// console.log( 'index by default :>> ', index );
	const $total_count = document.querySelector("#q_count");
	$total_count.innerText = length;
}

function update_progress_bar ( total, comp ) {//index and length
  const step = 100 / total;
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
    
    document.querySelectorAll( ".after" ).forEach( element => {
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
