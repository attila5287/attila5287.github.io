$(document).ready(function () {
  
  function init() {
  	const working_hours = (start_hr, finish_hr) => {
			let res = [];
			for (let index = start_hr; index <= finish_hr; index++) {
				const hour = index;
				res.push();
			}
			return res;
		};

		let start = 9;
		
		let finish = 18;
		for (let index = start; index < finish; index++) {
			let row = $("<div>");
			$("#main").append(row);
			row.attr("class", "row slot mt-2");

			let prepend_div = $("<div>"); // left hand side of form
			row.append(prepend_div);
			prepend_div.attr("class", "h-100 col-2 text-center");

			let icon_pre = $("<h4>");
      icon_pre
				.attr("class", "far fa-clock mt-3 icon")
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
				.attr("class", "far fa-save text-success icon")
				.attr("data-index", index);
			append_div.append(btn_save);
			btn_save.append(icon_append);
      
		}
  }
  init();

  function update_forms ( hour ) {
    // console.log('hour :>> ', hour);

     $.each(
				$(".user_input"),
       function ( i, el ) {
         const scheduled = $( this ).attr( "data-index" );
        // console.log("data-attr",$(this).attr("data-index"));
         if ( scheduled == hour ) {

           $(this).addClass("border-warning");
          }
        }
			);
    
  }
  function update_btns(hour) {
		$.each($(".save"), function (i, el) {
			const scheduled = +$(this).attr("data-index");
      if ( scheduled == hour ) {
        console.log( 'scheduled :>> ', scheduled );
				$(this).removeClass("btn-outline-success");
        $( this ).addClass( "btn-outline-warning" );
        
			} else if (scheduled < hour) {
				$(this).removeClass("btn-outline-success");
				$(this).removeClass("btn-outline-warning");
        $( this ).addClass( "btn-outline-secondary" );
			}
		});
  }
  function update_icons(hour) {
		$.each($(".icon"), function (i, el) {
			const scheduled = +$(this).attr("data-index");
      if ( scheduled == hour ) {
        console.log( 'scheduled :>> ', scheduled );
				$(this).removeClass("text-success");
				$(this).removeClass("text-secondary");
        $(this).addClass("text-warning");
        
			} else if (scheduled < hour) {
				$(this).removeClass("text-success");
				$(this).removeClass("text-warning");
        $(this).addClass("text-light");
			}
		});
  }
  // let current_hour = moment().hour();
  // update_forms(current_hour);
  let current = 15;
  update_icons(current);
  update_forms(current);
  update_btns(current);
});
