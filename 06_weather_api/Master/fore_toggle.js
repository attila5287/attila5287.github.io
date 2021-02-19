// console.log('test fore togle');

$("#fore_toggle").on(
  "click", () => {

    $(".fore_div_f ").addClass('d-none');
    $(".fore_div_c ").removeClass('d-none');
    $("#fore_toggle_mode").text('C' );
    $( "#fore_toggle" ).empty();
    const new_icon = $('<i>').attr('class', 'fas fa-toggle-on'); 
    $( "#fore_toggle" ).append(new_icon);
  }
);
