//  render ( data )
//  ├ display_question(data, index, scores);
//  └ setTime(index, length, data);

const $send_btn = document.getElementById( "send_btn" );
$send_btn.onclick = () => {
  console.log( "test save btn" );
  const $icn = document.getElementById( "iconsent" );
  $icn.setAttribute( "class", "fas fa-check-circle" );
  $send_btn.classList.remove("btn-outline-primary");
  $send_btn.classList.add( "btn-outline-secondary" );
  
  // game is over and total point ic
  const $score = document.getElementById( "score" );

  const $score_final = document.getElementById( "final_score" );
  $score_final.textContent = +$score.textContent || 0;
  console.log( '$score :>> ', $score.textContent );
  const $nm = document.getElementById( "player_name" );
  const new_high = $nm.value || "ANONYMOUS";
  add_high_scorer(new_high, $score.textContent);
};

function store_high_scorers ( ) {
  const names = [
    "selcuk",
    "attila",
    "turkoz",
  ]

  const scores = [
    '80',
    '70',
    '60',
  ]
  let res = [];
  for (let i = 0; i < names.length; i++) {
    let hi = {};
    hi[ 'Ranking' ] =  i ;
    hi[ 'Player' ] = names[ i ];
    hi[ 'Score' ] = scores[ i ];
    res.push(hi)
  }
  localStorage.setItem( "high_scorers", JSON.stringify( res ) );
  const stored = JSON.parse( localStorage.getItem( "high_scorers" ) );
  
  console.log("stored :>> ", stored);
}

function add_high_scorer (new_player, new_score ) {
  const stored = JSON.parse( localStorage.getItem( "high_scorers" ) );
  const new_hi = {
    Ranking: 0,
    Player: new_player,
    Score: new_score,
  };
  
  stored.push( new_hi );
  localStorage.setItem( "high_scorers", JSON.stringify( stored ) );
  render_high_scorers();
}

function render_high_scorers () {
  
  const stored = JSON.parse( localStorage.getItem( "high_scorers" ) ) || [];
  const $thead_tr = document.getElementById( "hi_headers" );
  $thead_tr.innerHTML = "";
  const headers = Object.keys( stored[ 0 ] ) || [];
  headers.forEach( k => {
    const $td = document.createElement( "td" );
    $td.textContent = k;
    $thead_tr.appendChild($td);
  } );

  const $tbody = document.getElementById( "high_scorers" );
   $tbody.innerHTML = "";
  console.log('on display :>> ', stored);
  
  for ( let i = 0; i < stored.length; i++ ) {
    const $tr = document.createElement( "tr" );
    const row_data = stored[ i ];

    Object.keys(row_data).forEach( k => {
      
      const $td = document.createElement( "td" );
      $td.setAttribute("class", "text-uppercase");
      $td.textContent = row_data[ k ];
      $tr.appendChild( $td );  

    } );
    $tbody.appendChild( $tr );
  }


}
store_high_scorers();

// add_high_scorer( "test", 75 );



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
				
        if ( answers[ key ] == solutions[ key ] && event.target == $btn ) {
          
          const k = `points_${idx}`;
          const points = Math.round( 100 / length );
          scores[ k ] = points;
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

					commence_game();
          

				}

			});
		});
	}
}

function commence_game () {
  render_high_scorers();
  $viz_after = document.querySelectorAll( ".viz_after" );
  $viz_after.forEach( ( $el ) => {
    $el.classList.remove( "d-none" );
  } );
  $hide_after = document.querySelectorAll( ".hide_after" );
  $hide_after.forEach( ( $el ) => {
    $el.classList.add( "d-none" );
  } );
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
