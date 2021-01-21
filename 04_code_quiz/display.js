function display_question(current_index) {
	const question = questions[current_index - 1];

	const $q = document.createElement("h4");
	$q.textContent = question.title;
	$q.setAttribute("id", `question_${current_index}`);

	const $div = document.getElementById("question_div");
	$div.appendChild($q);

	question.choices.forEach((c) => {
		const $btn = document.createElement("button");
		$btn.className = "btn btn-lg btn-outline-primary";
		$btn.textContent = c;
		$div.appendChild($btn);
	});
}
