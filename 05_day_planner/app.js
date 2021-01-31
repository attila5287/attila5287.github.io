$( document ).ready( function () {
		let start_hour = 9;
		let finish_hour = 17; 
	$("#start").text(start_hour);
	$("#total_hours").text(finish_hour - start_hour);
	$( ".start_btns" ).on( "click", () => {
		console.log('object :>> ', $(this).attr('data-increment'));
	});


  
	function init ( start, finish ) {
		  function update_forms(hour) {
				// console.log('hour :>> ', hour);

				$.each($(".user_input"), function (i, el) {
					const scheduled = $(this).attr("data-index");
					// console.log("data-attr",$(this).attr("data-index"));
					if (scheduled == hour) {
						$(this).addClass("border-warning");
					} else if (scheduled < hour) {
						$(this).removeClass("border-warning");
					}
				});
			}
			function update_btns(hour) {
				$.each($(".save"), function (i, el) {
					const scheduled = +$(this).attr("data-index");
					if (scheduled == hour) {
						console.log("scheduled :>> ", scheduled);
						$(this).removeClass("btn-outline-success");
						$(this).addClass("btn-outline-warning");
					} else if (scheduled < hour) {
						$(this).removeClass("btn-outline-success");
						$(this).removeClass("btn-outline-warning");
						$(this).addClass("btn-outline-secondary");
					}
				});
			}
			function update_icons_app(hour) {
				$.each($(".icon_app"), function (i, el) {
					const scheduled = +$(this).attr("data-index");
					if (scheduled == hour) {
						console.log("scheduled :>> ", scheduled);
						$(this).removeClass("fas fa-hourglass-start");
						$(this).addClass("fas fa-hourglass-half");
						$(this).removeClass("text-success");
						$(this).removeClass("text-secondary");
						$(this).addClass("text-warning");
					} else if (scheduled < hour) {
						$(this).removeClass("fas fa-hourglass-start");
						$(this).removeClass("fas fa-hourglass-half");
						$(this).addClass("fas fa-hourglass-end");
						$(this).removeClass("text-success");
						$(this).removeClass("text-warning");
						$(this).addClass("text-light");
					}
				});
			}
			function update_icons_pre(hour) {
				$.each($(".icon_pre"), function (i, el) {
					const scheduled = +$(this).attr("data-index");
					if (scheduled == hour) {
						console.log("scheduled :>> ", scheduled);
						$(this).removeClass("far fa-clock");
						$(this).addClass("fas fa-clock text-xl");
						$(this).removeClass("text-success");
						$(this).removeClass("text-secondary");
						$(this).addClass("text-warning");
					} else if (scheduled < hour) {
						$(this).removeClass("far fa-clock");
						$(this).removeClass("fas fa-clock");
						$(this).addClass("fas fa-history");
						$(this).removeClass("text-success");
						$(this).removeClass("text-warning");
						$(this).addClass("text-light");
					}
				});
			}
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
		$( '#demo_button' ).on( "click", () => {
			
			test_interval(
				start_hour,
				finish_hour,
				update_icons_pre,
				update_icons_app,
				update_forms,
				update_btns
			);
			
			function test_interval ( start_hour, finish_hour,  update_icons_pre, update_icons_app, update_forms, update_btns ) {
				let current = start_hour-1;
				setInterval( () => {
					current++;
					update_icons_pre( current );
					update_icons_app( current );
					update_forms( current );
					update_btns( current );
					$( "#slider" ).val( current );
			
					const each_step = 100 / ( finish_hour - start_hour );
					const current_progress = each_step* (current-start_hour);
					$("#progress_bar")
						.attr("aria-valuenow", current_progress)
						.attr("style", "width: " + current_progress + "%;");
					
					
				}, 750 );
				
			}
			
		} )
		
	}
  init(start_hour, finish_hour);

} );

