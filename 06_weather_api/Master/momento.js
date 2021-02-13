const current_hour = moment().hour();
const s = $("#slider_hour");    
const slider = $( "#slider" ) ;    
const sval = slider.val();    
update_slider_hour(current_hour + 24);
slider.on("input", () =>{ 
  const changed = +slider.val();
  // console.log('changed :>> ', changed);
  
  update_slider_hour( changed );
  
});

function update_slider_hour ( val ) {
  if (+current_hour + ((val * 3) % 24) > 12) {
		s.text(current_hour + ((val * 3) % 12) + " PM");
	} else if (+current_hour + ((val * 3) % 24) < 12) {
		s.text(current_hour + ((val * 3) % 12) + " AM");
	}
}
