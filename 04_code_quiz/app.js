welcome_guests();
let $display = document.getElementById("display"); 
let $start = document.getElementById( "start" ); 
let $re_start = document.getElementById( "re_start" ); 


function start_all_over () {
	console.log('test start all over');
}
$re_start.onclick = start_all_over;
	
function append_progress_bar(array) {
	const $div = document.getElementById("progress_container");
	const $p = document.createElement( "div" );
	console.log( 'array :>> ', array );
	
	const initial_perc = 100 / array.length; ;
	console.log( 'initial_perc :>> ', initial_perc );
	const pro_style = "width: " + initial_perc + "%; ";
	$p.setAttribute(
		"style",
		pro_style
		);
	$p.setAttribute( "aria-valuenow", initial_perc );

	$p.setAttribute("role", "progress");
	$p.setAttribute( "aria-valuemin", 1 );
	$p.setAttribute( "aria-valuemax", 100 );
	$p.setAttribute( "id", "progress_bar" );
	$p.setAttribute("step", initial_perc);
	$p.className = "progress-bar progress-bar-striped progress-bar-animated";

	return $p; // progress bar
}

function append_input_range ( array ) {
	let $index = document.getElementById("question_number"); 
	$index.className = "text-center";
	// console.log("test append input range");

	const div = document.getElementById("range_div");
	const range = document.createElement("input");
	range.setAttribute("id", "index_range");
	range.setAttribute("class", "custom-range px-4 pb-2 pt-3");
	range.setAttribute("type", "range");
	range.setAttribute("value", 0);
	range.setAttribute("min", 1);
	range.setAttribute("max", array.length);
	range.addEventListener( "input", range_listener );
	div.appendChild( range );

	return range;
}

function remove_input_range () {
	const rang3 = document.querySelectorAll( ".custom-range" );
	console.log(rang3);
	const range = document.getElementById( "index_range" );
	console.log( range );
	if (range) {
		range.remove()
		
	} else {
		console.log('no range');
	}
}

function start_the_fun() {
	remove_input_range();
	append_input_range(questions);
	console.log( "start quiz>>" );
	
	$start.className = "btn btn-block btn-secondary disabled";
	$re_start.className = "btn btn-block btn-warning";

	const $prg = append_progress_bar(questions);
	const $pro_div = document.getElementById("progress_div");
	const $progress = document.createElement( "div" );
	$progress.className = "progress";
	$pro_div.appendChild($progress);
	$progress.appendChild( $prg );
	
}

$start.onclick = start_the_fun;


function range_listener() {
	const current_index = document.getElementById("index_range").value;

	const $range = document.getElementById(event.target.id);
	const $index = document.getElementById("question_number");
	const current_value = $range.value;
	
	$index.innerText = `Question ${current_value}`;
	console.log("current_value >> ", current_value);
	
	const question = questions[current_index];
	console.log( question );
	
	const $progress_bar = document.getElementById( "progress_bar" );
	const step = $progress_bar.getAttribute("step");

	const pro_style = "width: " + current_value*step + "%; ";

	$progress_bar.setAttribute( "style", pro_style );

	$progress_bar.setAttribute( "aria-valuenow", current_value );


}
