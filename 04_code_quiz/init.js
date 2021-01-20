welcome_guests();
let $display = document.getElementById("display"); 
let $start_div = document.getElementById( "start_div" ); 
let $start = document.getElementById( "start" ); 

function start_the_fun () {
	document.querySelectorAll( ".before_start" );
	append_input_range(questions);
	append_progress_bar(questions);
	console.log( "start quiz>>" );
	$start.remove();
	const $score = document.createElement( "h4" );
	const $score_icon = document.createElement( "i" );
	const $score_text = document.createElement( "i" );
	$score_icon.className = "fas fa-flag-checkered mr-2";
	$score.className = "text-primary";
	$score.appendChild($score_icon);
	$score_text.textContent = "Score: 0/100";
	$score.appendChild($score_text);

	$start_div.appendChild($score);


}
$start.onclick = start_the_fun;


console.log(questions[0]);
