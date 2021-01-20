function append_progress_bar(array) {
	const $div = document.getElementById("progress_container");
	const $p = document.createElement("div");
	console.log("array :>> ", array);

	const initial_perc = 100 / array.length;
	console.log("initial_perc :>> ", initial_perc);
	const pro_style = "width: " + initial_perc + "%; ";
	$p.setAttribute("style", pro_style);
	$p.setAttribute("aria-valuenow", initial_perc);

	$p.setAttribute("role", "progress");
	$p.setAttribute("aria-valuemin", 1);
	$p.setAttribute("aria-valuemax", 100);
	$p.setAttribute("id", "progress_bar");
	$p.setAttribute("step", initial_perc);
	$p.className = "progress-bar progress-bar-striped progress-bar-animated";
	const $pro_div = document.getElementById("progress_div");
	const $progress = document.createElement("div");
	$progress.className = "progress";
	$pro_div.appendChild($progress);
	$progress.appendChild($p);
	console.log("progress div and bar added to document");
}

