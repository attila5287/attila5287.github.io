const current_hour = moment().hour();
const s = $("#slider_hour");    
update_slider_hour(8);
update_slider_date(8);

const slider = $( "#slider" ) ;    
slider.on( "input", () => { 
  const changed = +slider.val();
  // console.log('changed :>> ', changed);

  update_slider_hour( changed );
  update_slider_date( changed );
});

function update_slider_hour ( val ) {
  // console.log('val :>> ', val);
  val = +val
  const test = current_hour + ( ( val * 3 ) % 12 ) + " PM";
  // console.log( 'test :>> ', test );
  
  if (+current_hour + ((val * 3) % 24) > 12) {
    s.text(current_hour + ((val * 3) % 12) + " PM");
  } else if (+current_hour + ((val * 3) % 24) < 12) {
    s.text(current_hour + ((val * 3) % 12) + " AM");
  }
}

function update_slider_date ( val ) {
  val= +val
	const hours_from_now = val * 3;
  const day = Math.floor( hours_from_now / 24 );
  
  if (day<1) {
    const date = moment().format('LL');
    $("#slider_date").text(date);
    
  } else {
    const date = moment().add(day, "days").calendar();
    const on_print = date.slice(0, date.length - 11);
    $( "#slider_date" ).text( on_print );


  }

}



