function convert2HHMM_slicer(unix_timestamp) {
	// returns string
	// let unix_timestamp = 1549312452
	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	let date = new Date(unix_timestamp * 1000);
	// Hours part from the timestamp
	let hours = date.getHours();
	// Minutes part from the timestamp
	let minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	let seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	if ( hours > 12 ) {
		hours = hours - 12
		hours = ""+ hours + " PM";
	} else {
		hours = ""+ hours + " AM";
	}
	let formattedTime =
		hours;
	// console.log('formatted time: ', formattedTime );
	return formattedTime;
}
function convert2HHMM(	unix_timestamp) {
	// returns string
	// let unix_timestamp = 1549312452
	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	let date = new Date(unix_timestamp * 1000);
	// Hours part from the timestamp
	let hours = date.getHours();
	// Minutes part from the timestamp
	let minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	let seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	let formattedTime =
		hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

	// console.log('formatted time: ', formattedTime );
	return formattedTime;
}
