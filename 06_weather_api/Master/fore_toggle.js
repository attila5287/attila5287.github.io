// console.log('test fore togle');
let mode_c; // true false switch

mode_c = false;// def temp vals Fahrenheit

$("#fore_toggle").on(
	"click", () => {
		if ( mode_c == false ) {
			$("#slider_hr_c").removeClass("d-none");
			$("#slider_hr_f").addClass("d-none");
			$(this).attr("data_tempunit", "C");
			$(".fore_div_f ").addClass("d-none");
			$(".fore_div_c ").removeClass("d-none");
			$("#fore_toggle_mode").text("C");
			$("#fore_toggle").empty();
			
			const new_icon = $("<h2>").attr("class", "fas fa-toggle-on");
			
			$( "#fore_toggle" ).append( new_icon );
			console.log('mode f to c');
			mode_c = true;
			console.log('mode_c :>> ', mode_c);
		} else if ( mode_c == true ) {
			$("#slider_hr_c").addClass("d-none");
			$("#slider_hr_f").removeClass("d-none");
			mode_c = false;
			$(this).attr("data_tempunit", "F");
			$(".fore_div_f ").removeClass("d-none");
			$(".fore_div_c ").addClass("d-none");
			$("#fore_toggle_mode").text("F");
			$("#fore_toggle").empty();
			const new_icon = $("<h2>").attr("class", "fas fa-toggle-off");
			$("#fore_toggle").append(new_icon);
			console.log('mode c to f');
			console.log('mode_c :>> ', mode_c);
		}
  }
	);
	