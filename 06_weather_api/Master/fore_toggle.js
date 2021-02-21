// console.log('test fore togle');

$("#fore_toggle").on(
  "click", () => {
    if ($("#fore_toggle").attr("data-tempunit") == "f") {
			$(".fore_div_f ").addClass("d-none");
			$(".fore_div_c ").removeClass("d-none");
			$("#fore_toggle_mode").text("C");
			$("#fore_toggle").empty();
			const new_icon = $("<h2>").attr("class", "fas fa-toggle-on");
			$("#fore_toggle").append(new_icon);
		}
    if ($("#fore_toggle").attr("data-tempunit") == "c") {
			$(".fore_div_c ").addClass("d-none");
			$(".fore_div_f ").removeClass("d-none");
			$("#fore_toggle_mode").text("F");
			$("#fore_toggle").empty();
			const new_icon = $("<i>").attr("class", "fas fa-toggle-on");
			$("#fore_toggle").append(new_icon);
		}
  }
);
