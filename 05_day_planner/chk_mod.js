function check_modules() {
	if (moment()) {
		console.log("moment lib requirement: Check");
	} else {
		console.log("moment lib n/a, check download link");
	}
}

check_modules();
$("#currentDay").text(moment().format("MM/DD/YYYY"));


setInterval(() => {
	$( "#currentTime" ).text( moment().format( "HH:mm:ss" ) );
	
}, 1000 );

