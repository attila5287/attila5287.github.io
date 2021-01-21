var statusSpan = document.querySelector( "#status" );
var statusToggle = document.querySelector("#status-toggle");

var playButton = document.querySelector( "#play" );
var pauseButton = document.querySelector("#pause");
var stopButton = document.querySelector("#stop");

var minutesDisplay = document.querySelector( "#minutes" );
var secondsDisplay = document.querySelector("#seconds");

var workMinutesInput = document.querySelector( "#work-minutes" );
var restMinutesInput = document.querySelector("#rest-minutes");

var totalSeconds = 0;
var secondsElapsed = 0;
var interval;

function storeLocally () {
	console.log('user input for', event.target.id);
	localStorage.setItem("rest_minutes", restMinutesInput.value.trim());
	localStorage.setItem( "work_minutes", workMinutesInput.value.trim() );
	log_locally_stored();
	function log_locally_stored () {
		let rm = localStorage.getItem( "rest_minutes" );
		let wm = localStorage.getItem( "work_minutes" );
		
		console.log(`work for ${wm} then rest for ${rm} minutes`);
	}
};

workMinutesInput.addEventListener( "input", storeLocally );
restMinutesInput.addEventListener( "input", storeLocally );

function adjust_single_digit(element) {
	// read minutes double-decimal
	if (element.textContent < 10) {
		element.textContent = `0${element.textContent}`;
	}
}

function toggleHandler () {
	// conditional
	const working = statusSpan.textContent == "Work";

	if ( working ) {// if work then change it to rest
		
		statusSpan.textContent = "Rest";

		minutesDisplay.textContent = restMinutesInput.value;
		
		adjust_single_digit( minutesDisplay );
		
		console.log( "hey champ now go:>> ", statusSpan.textContent );
		
	} else {
		statusSpan.textContent = "Work";
		minutesDisplay.textContent = workMinutesInput.value;

		console.log( "get back to:>> ", statusSpan.textContent );
		
	}

	// console.log("test event listener");
}
statusToggle.addEventListener("click", toggleHandler);

function startTimer() {
	// Write code to start the timer here
	
	var timerInterval = setInterval( down_in_sixty_secs(), 1000 );
	function down_in_sixty_secs () {
		const test_min = 3; // test min for 3 seconds
		
		const actualtest_min = 3; // test min for 3 seconds
		
		var secondsLeft = 60;
		return () => {
			secondsLeft--;
			secondsDisplay.textContent = secondsLeft;
			if ( secondsDisplay.textContent < 10 ) {
				secondsDisplay.textContent = `0${secondsDisplay.textContent}`;
			}     
			if ( secondsLeft == 0 ) {// ex-08 Timer

				clearInterval( timerInterval );

				let mins = minutesDisplay.textContent;
				
				console.log( 'mins :>> ', mins );
				
				let secondsLeft = 60;


				if ( mins == 0 ) {
					console.log('<<: **POMODOR0 TUTTO BENE** :>> ');
				} else {
					minutesDisplay.textContent--;
					setInterval( down_in_sixty_secs(), 1000 )
				}
				
			}
		};
	}
}
playButton.addEventListener("click", startTimer);

function pauseTimer () {
	const working = statusSpan.textContent == "Work";

	if (working) {
		clearInterval(interval);
		
	} else {
		console.log('pass ---BY--- ');
	}
	
}
pauseButton.addEventListener("click", pauseTimer);
