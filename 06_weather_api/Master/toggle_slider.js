// toggle_slider

function auto_detext_ () {
  const current_mode_f = $("#slider_toggle_mode").text() == "F";
  const current_mode_c = $("#slider_toggle_mode").text() == "C";
  $( "#slider_toggle_mode" ).text( 'F' );
  
  let new_icon;
  if ( current_mode_f ) {
    $("#slider_note_c").remove("d-none");
    $("#slider_note_f").addClass("d-none");
    $("#slider_note_c").removeClass("d-none");
    $("#slider_note_f").addClass("d-none");
    $("#slider_feels_f").addClass("d-none");
    $( "#slider_feels_c" ).removeClass( "d-none" );
    
    $("#slider_temp_c").removeClass("d-none");
    $( "#slider_temp_f" ).addClass( "d-none" );
    
    $( ".slider_li" ).removeClass( "text-dark" );
    $( "#slider_toggle_mode" ).text( 'C' );
    $( "#slider_toggle_iconium" ).empty();
    $( "#slider_toggle_iconium" ).append( new_icon );
    new_icon = $( "<span>" ).addClass( "fas fa-toggle-on text-dark" );

  }
  if ( current_mode_c ) {
    $("#slider_note_c").addClass("d-none");
		$("#slider_note_f").removeClass("d-none");
    $("#slider_temp_f").removeClass("d-none");
    $("#slider_feels_f").removeClass("d-none");
    $("#slider_feels_c").addClass("d-none");
    $("#slider_temp_c").addClass("d-none");
    $(".slider_li").addClass("text-dark");
    $( "#slider_toggle_mode" ).text( 'F' );
    $( "#slider_toggle_iconium" ).empty();
    new_icon = $('<span>').addClass("fas fa-toggle-off text-dark")
  }
  

  $("#slider_toggle_iconium").append(new_icon);
  // $("#slider_toggle_icon").attr("class", "fas fa-toggle-off");
  
  
}


$( "#slider_toggle" ).on( "click", () => {
  $( this ).empty();
  auto_detext_();
} );

auto_detext_();
