function local_start(start_hour) {
	localStorage.setItem("start", start_hour);
	console.log(" locally stored:>> ", localStorage.getItem("start"));
}

function localstore_total(total) {
	window.localStorage.setItem("total", total);
	console.log("local_total :>> ", window.localStorage.getItem("total"));
}
