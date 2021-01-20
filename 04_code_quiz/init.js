welcome_guests();
let $display = document.getElementById("display"); 
let $start = document.getElementById( "start" ); 

function start_the_fun() {
	append_input_range(questions);
	append_progress_bar(questions);
	console.log( "start quiz>>" );
	
	$start.className = "btn btn-block btn-secondary disabled";

	
}
$start.onclick = start_the_fun;


console.log(questions[0]);
