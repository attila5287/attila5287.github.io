function todays_weather(city) {
	// const api_key = "68a35fb157e72d53da67507cc3b136e8";
	const api_key = "42a5a7b661c854194cb0539e5fd1a86f";
	const queryURL = `https://api.openweathermap.org/data/2.5/weather?units=Imperial&APPID=${api_key}&q=${city}`;

	// console.log("queryURL :>> ", queryURL);

	function fetch_weather(w) {
		// openWeatherMap
		// console.log('w :>> ', w);
		const d = {
			// display those
			city: w.name,
			temperature: `Temperature:  ${w.main.temp} F / ${Math.round(
				((w.main.temp - 32) / 180) * 100
			)} C`,
			TempFeelsLike: `Feels Like:  ${w.main.feels_like} F / ${Math.round(
				((w.main.feels_like - 32) / 180) * 100
			)} C`,
			humidity: `Humidity is ${w.main.humidity}%`,
			description: w.weather[0].description,
			iconSrc: `https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`,
			WindDegree: w.wind.deg,
			WindSpeed: w.wind.speed,
			SunRise: convert2HHMM(w.sys.sunrise),
			SunSet: convert2HHMM(w.sys.sunset)
		};
		// console.log("display :>> ", d);
    $("#weather-sunrise").text("sunrise " + d.SunRise + " AM");

		$("#weather-sunset").text("sunset " + d.SunSet + " PM");
		$("#weather-city").text(d.city);
		$("#weather-description").text(d.description);
		$("#weather-feelslike").text(d.TempFeelsLike);
		$("#weather-temperature").text(d.temperature);
		$("#weather-humidity").text(d.humidity);
		$( "#weather-img" ).attr( "src", d.iconSrc );
		
		if (w.weather[0].icon.slice(-1) == "n") {
			$("#weather-img").removeClass("bg-info").addClass("bg-secondary p-4");
		}

		if ( w.weather[0].icon.slice( -1 ) == 'd' ) {
			$("#weather-img").removeClass("bg-secondary").addClass("bg-info p-4");
		}

	}
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(fetch_weather);
}
