// toggle_slider

function auto_detext_ () {
  const current_mode_f = $("#slider_toggle_mode").text() == "F";
  const current_mode_c = $("#slider_toggle_mode").text() == "C";
  $( "#slider_toggle_mode" ).text( 'F' );
  
  let new_icon;
  if ( current_mode_f ) {
    
    $("#slider_temp_c").removeClass("d-none");
    $("#slider_temp_f").addClass("d-none");
    $(".slider_li").removeClass("active");
    $( "#slider_toggle" ).removeClass( 'active' );
    $( "#slider_toggle_mode" ).text( 'C' );
    $( "#slider_toggle_iconium" ).empty();
    $( "#slider_toggle_iconium" ).append( new_icon );
    new_icon = $( "<span>" ).addClass( "fas fa-toggle-on" );
  }
  if ( current_mode_c ) {
    $("#slider_temp_f").removeClass("d-none");
    $("#slider_temp_c").addClass("d-none");
    console.log('			Math.round((+$("#slider_temp").attr("data_tempval") - 32) / 1.8) :>> ', 			Math.round((+$("#slider_temp").attr("data_tempval") - 32) / 1.8));
    $(".slider_li").addClass("active");
    $("#slider_toggle").addClass("active");
    $( "#slider_toggle_mode" ).text( 'F' );
    $( "#slider_toggle_iconium" ).empty();
    new_icon = $('<span>').addClass("fas fa-toggle-off")
  }
  

  $("#slider_toggle_iconium").append(new_icon);
  // $("#slider_toggle_icon").attr("class", "fas fa-toggle-off");
  
  
}


$( "#slider_toggle" ).on( "click", () => {
  $( this ).empty();
  auto_detext_();
} );

auto_detext_();
