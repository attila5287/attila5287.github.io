function range_listener () {
	function animate_progress(range_index) {
		const $progress_bar = document.getElementById("progress_bar");
		const step = $progress_bar.getAttribute("step"); // scale of a ratio 0-1 to percentage five question each step is 20percent
	
		const pro_style = "width: " + range_index * step + "%; ";
	
		$progress_bar.setAttribute("style", pro_style);
	
		$progress_bar.setAttribute("aria-valuenow", range_index * step);
	}
	const current_index = document.getElementById("index_range").value;

	const $range = document.getElementById(event.target.id);
	const $index = document.getElementById("question_number");
	const current_value = $range.value;

	$index.innerText = `Question ${current_value}`;
	// console.log("current_value >> ", current_value);

	const question = questions[current_index];
	// console.log( question );

	animate_progress(current_value);
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