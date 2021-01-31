// render: all action waiting the doc loaded
//   ├init: function append html elements
//   └update: function updates classes of existing
$(document).ready(render);
function render () {
	let start_hour = moment().hour();
	let current_hour = moment().hour();
	let total = 3;
	let settings_collapsed = false;

	init( current_hour, start_hour + total );
	update_all(current_hour);
	$( "#start" ).text( start_hour ); // write start on screen
	$( "#total" ).text( total ); // total
	
	$( "#plus_start" )
		.on( "click", () => {
		if ( start_hour >= 12 ) {
			start_hour = start_hour - 12;
			start_hour = start_hour + 1;
			$("#start").text(start_hour);
		}
		else {
			start_hour = start_hour + 1;
			$("#start").text(start_hour);
		}	
		localStorage.setItem("start", start_hour);
		console.log(' locally stored:>> ', localStorage.getItem("start"));
	} );
	
	$( "#minus_start" )
		.on( "click", () => {
		if (start_hour <= 1) {
			start_hour = start_hour + 12;
			start_hour = start_hour - 1;
			$("#start").text(start_hour);
			local_start(start_hour);
		} else {
			start_hour = start_hour - 1;
			$("#start").text(start_hour);
			local_start( start_hour );
		}
	} );
	
	$( '#demo_button' )
		.on( "click", () => {
			$("#demo_icon").removeClass("far fa-play-circle");
			$("#demo_icon").addClass("far fa-check-circle");
			$("#demo_button").addClass("disabled");
		let i = start_hour;
		setInterval( () => {
			if (i == start_hour + total) {
				$("#slider").val(start_hour);
				update_all(current_hour);
			} else {
				i++;
				$("#slider").val(i);
				update_all(i);
			}
		
			
				
		}, 750 );
			
		
	} );
	$( '#settings_button' )
		.on( "click", () => {
			if ( !settings_collapsed ) {
				settings_collapsed = true;
				$( "#settings_collapse" ).removeClass("d-none");
				$("#settings_icon").removeClass("fa-cogs");
				$("#settings_icon").addClass("fa-chevron-down");
				$("#settings_button").addClass("border-0");
			}
			else {
				$("#settings_collapse").toggleClass("d-none");
				$("#settings_icon").toggleClass("fa-cogs");
				$("#settings_icon").toggleClass("fa-chevron-down");
				$("#settings_button").removeClass("border-0");
				
			}

	} );
			

	$( "#minus_total" )
		.on( "click", () => {
		if ( total < 1 ) {
			$( "#total" ).text( total );
			localstore_total( total );
		} else {
			total--;
			$( "#total" ).text( total );
			localstore_total( total );
		}
	} );

	$( "#plus_total" )
		.on( "click", () => {
		if ( total > 11 ) {
			$( "#total" ).text( total );
			localstore_total( total );
			
		} else {
			total++;
			$( "#total" ).text( total );
			localstore_total( total );
		}
	} );

	$( "#start_a_session" )
		.on( "click", () => {
				settings_collapsed = true;
				$("#settings_collapse").addClass("d-none");
				$("#settings_icon").addClass("fa-cogs");
				$("#settings_icon").removeClass("fa-chevron-down");
				$("#settings_button").removeClass("border-0");
				init( start_hour, start_hour + total );
				update_all(start_hour);
	} );
	
		
  
	
	function update_progress ( current ) {
		const each_step = 100 / total;
		const current_progress = each_step * ( current - start_hour );
		$( "#progress_bar" )
			.attr( "aria-valuenow", current_progress )
			.attr( "style", "width: " + current_progress + "%;" );
	}

	function init ( start, finish ) {
		$('#main').html("");
		for ( let index = start; index < finish; index++ ) {
			$( "#slider" ).attr( "min", start );
			$( "#slider" ).attr("max", finish );
			let row = $("<div>");
			$("#main").append(row);
			row.attr("class", "row slot mt-2");

			let prepend_div = $("<div>"); // left hand side of form
			row.append(prepend_div);
			prepend_div.attr("class", "h-100 col-2 text-center");

			let icon_pre = $("<h4>");
      icon_pre
				.attr("class", "far fa-clock mt-3 icon_pre")
				.attr("data-index", index);
			prepend_div.append(icon_pre);
			icon_pre.text(" " + index);
			//change_text
			icon_pre.addClass("text-success");

			let textarea = $("<textarea>");
			row.append(textarea);
			textarea
				.attr("rows", 2)
				.attr("data-index", index)
				.attr("class", "col-7 form-control form-control-dark user_input");
        
      
			let append_div = $("<div>");
			append_div.attr("class", "col-3");
			row.append(append_div);
			let btn_save = $("<button>");
			btn_save
				.attr("data-index", index)
				.attr("class", "h-100 btn btn-block btn-outline-success save");

			let icon_append = $("<h2>");
			icon_append
				.attr("class", "fas fa-hourglass-start text-success icon_app")
				.attr("data-index", index);
			append_div.append(btn_save);
			btn_save.append(icon_append);
      
		}
	}
	function update_all(hr) {
		console.log( "up all", hr );
		update_progress(hr);
		update_icons_pre(hr);
		update_icons_app(hr);
		update_forms(hr);
		update_btns(hr);
		function update_forms(hour) {
			// console.log('hour :>> ', hour);
			$.each($(".user_input"), function (i, el) {
				const scheduled = $(this).attr("data-index");
				// console.log("data-attr",$(this).attr("data-index"));
				if (scheduled == hour) {
					$(this).removeClass("border-0");
					$(this).addClass("border-warning");
				} else  {
					$(this).removeClass("border-warning");
					$(this).addClass("border-0");
				}
			});
		}
		function update_btns(hour) {
			$.each($(".save"), function (i, el) {
				const scheduled = +$(this).attr("data-index");
				if (scheduled == hour) {
					// console.log("scheduled hour styling :>> ", scheduled);
					$(this).removeClass("btn-outline-success");
					$(this).removeClass("btn-outline-secondary");
					$(this).addClass("btn-outline-warning");
				} else if (scheduled < hour) {
					$(this).removeClass("btn-outline-success");
					$(this).removeClass("btn-outline-warning");
					$(this).addClass("btn-outline-secondary");
				} else if (scheduled > hour) {
					$(this).removeClass("btn-outline-warning");
					$(this).removeClass("btn-outline-secondary");
					$(this).addClass("btn-outline-success");
				}
			});
		}
		function update_icons_app(hour) {
			$.each($(".icon_app"), function (i, el) {
				const scheduled = +$(this).attr("data-index");
				if (scheduled == hour) {
					// console.log("style sch hr append part  :>> ", scheduled);
					$(this).removeClass("fas fa-hourglass-start");
					$( this ).addClass( "fas fa-hourglass-half" );
					
					$(this).removeClass("text-secondary");
					$(this).removeClass("text-success");
					$( this ).addClass( "text-warning" );
					
				} else if (scheduled < hour) {
					$(this).removeClass("fas fa-hourglass-start");
					$(this).removeClass("fas fa-hourglass-half");
					$( this ).addClass( "fas fa-hourglass-end" );
					
					$(this).removeClass("text-success");
					$(this).removeClass("text-warning");
					$(this).addClass("text-secondary");
				} else if (scheduled > hour) {
					$(this).removeClass("fas fa-hourglass-half");
					$(this).removeClass("fas fa-hourglass-end");
					$(this).addClass("fas fa-hourglass-start");
					
					$( this ).removeClass( "text-warning" );
					$(this).removeClass("text-secondary");
					$(this).addClass("text-success");
				}
			});
		}
		function update_icons_pre(hour) {
			$.each($(".icon_pre"), function (i, el) {
				const scheduled = +$(this).attr("data-index");
				if (scheduled == hour) {
					// console.log("icons left hand :>> ", scheduled);
					$(this).removeClass("far fa-history");
					$(this).removeClass("far fa-clock");
					$(this).addClass("fas fa-clock");
					$(this).addClass("text-xl");
					
					$(this).removeClass("text-secondary");
					$(this).removeClass("text-success");
					$(this).addClass("text-warning");
				} else if (scheduled < hour) {
					$(this).removeClass("text-xl");
					$(this).removeClass("text-warning");
					$(this).removeClass("text-secondary");
					$(this).addClass("far fa-history");
					$(this).addClass("text-secondary");
				} else if (scheduled > hour) {
					$(this).removeClass("text-xl");
					$(this).removeClass("fas fa-clock");
					$(this).removeClass("far fa-history");
					$(this).addClass("far fa-clock");

					$(this).removeClass("text-warning");
					$(this).removeClass("text-secondary");
					$(this).addClass("text-success");
				}
			});
		}

	}

}



