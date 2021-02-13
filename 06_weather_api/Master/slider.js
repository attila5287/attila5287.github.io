function update_slider(v, city) {
	const API_key = "42a5a7b661c854194cb0539e5fd1a86f";
	const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}`;
	// console.log('url :>> ', url);

	$.ajax({
		type: "GET",
		url: url
	}).then((w) => {
		// console.log("w :>> ", w.list[v]);
		// console.log("w :>> ", w.list[v].weather[0]);
		// console.log("w :>> ", w.list[v].weather[0].main);
    // console.log( "w :>> ", w.list[ v ].weather[ 0 ].description );
    
    $("#slider_description").text(w.list[v].weather[0].description);
    $("#slider_icon").attr(
			"src",
			"https://openweathermap.org/img/wn/" +
				w.list[v].weather[0].icon +
				"@2x.png"
		);
    const s = $("#slider");
    s.on("change", function () {
      const changed = +$( "#slider" ).val();
      $("#slider").val(changed);
      // console.log('changed :>> ', changed);
      $("#slider_index").text(`${city}: ${changed * 3} hours later`);
      
      $("#slider_description").text(w.list[changed-1].weather[0].description);
      $("#slider_icon").attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          w.list[changed-1].weather[0].icon +
          "@2x.png"
      );
    });
    // $("#slider_icon").attr("src", w[v]);
	});
  
  $( "#slider" ).val( v );
  $( "#slider_index" ).text( `${city}: ${v * 3} hours later` );
  
}

// update_slider(8, "Denver"); 
