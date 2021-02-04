weatherStateUp("Colorado");
function weatherStateUp( stateName ) { //display weather of two largest cities 
  let dictOfTwoCities = {};
  const city01 = "Denver";
  const city02 = "Pueblo";
  // const api_key = "68a35fb157e72d53da67507cc3b136e8";
  const api_key = "42a5a7b661c854194cb0539e5fd1a86f";
  
  // base url that will be used during the iteration by adding city at the end
  const queryURL =
		"https://api.openweathermap.org/data/2.5/weather?units=Imperial&APPID=" +
		api_key +
		"&q=" +
		city01;
function fetch_weather( w ) { // openWeatherMap
    // console.log('w :>> ', w);
    const d = {
			// display those
			city: w.name,
			temperature: `Temperature:  ${w.main.temp}F / ${Math.round(
				((w.main.temp - 32) / 180) * 100
			)}C`,
			humidity: `Humidity is ${w.main.humidity}%`,
			description: w.weather[0].description,
			iconSrc: `http://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`,
			TempFeelsLike: `${w.main.feels_like}`,
			WindDegree: w.wind.deg,
			WindSpeed: w.wind.speed,
			SunRise: convert2HHMM( w.sys.sunrise ),
			SunSet: convert2HHMM( w.sys.sunset ),
		};
    // console.log( 'display :>> ', d );

    $('#weather-city').text(d.city);
    $('#weather-description').text(d.description);
    $('#weather-temperature').text(d.temperature);
    $('#weather-humidity').text(d.humidity);
    $('#weather-img').attr('src',d.iconSrc);
    
    
  }
  $.ajax({
          url: queryURL,
          method: "GET"
  } ).then( fetch_weather );
  
  
}
