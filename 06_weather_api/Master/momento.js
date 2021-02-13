const current_hour = moment().hour();
const s = $("#slider_hour");    
const slider = $( "#slider" ) ;    
const sval = slider.val() ;    
if (current_hour + sval >12) {
  s.text(current_hour + sval*3 % 24 +" PM");
} else {
  s.text(current_hour + sval*3 % 24+ " AM");
}
slider.on("input", () =>{ 
  const changed = slider.val();
  
  console.log('changed :>> ', changed);
  if (current_hour + changed >12) {
    s.text(current_hour + changed * 3 % 24 + " PM");
  } else {
    s.text(current_hour + changed * 3 % 24 + " AM");
  }
  
});
