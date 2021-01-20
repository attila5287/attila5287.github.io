function range_listener () {
	function animate_progress(range_index) {
		const $progress_bar = document.getElementById("progress_bar");
		const step = $progress_bar.getAttribute("step"); // scale of a ratio 0-1 to percentage five question each step is 20percent
	
		const pro_style = "width: " + range_index * step + "%; ";
	
		$progress_bar.setAttribute("style", pro_style);
	
		$progress_bar.setAttribute("aria-valuenow", range_index * step);
	}
	const current_index = document.getElementById("index_range").value;
	const $index = document.getElementById("question_number");
	
	$index.innerText = `Question ${current_index}`;
	
	display_question( current_index );

	animate_progress(current_index);
}
function display_question ( current_index ) {
	const question = questions[ current_index - 1 ];

	const $q = document.createElement( 'h4' );
	$q.textContent = question.title;
	$q.setAttribute("id", `question_${current_index}`);

	const $div = document.getElementById( "question_div" );
	$div.appendChild( $q );

	question.choices.forEach(
		c => {
			const $btn = document.createElement( 'button' );
			$btn.className = "btn btn-lg btn-outline-primary";
			$btn.textContent = c;
			$div.appendChild($btn);
		}
	);
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
	range.addEventListener("input", range_listener);
	div.appendChild(range);

	return range;
}
