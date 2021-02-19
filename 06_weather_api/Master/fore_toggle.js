// console.log('test fore togle');

$("#fore_toggle").on(
  "click", () => {

    $("#fore_toggle_mode").text('C' );
    $( "#fore_toggle" ).empty();
    const new_icon = $('<i>').attr('class', 'fas fa-toggle-on'); 
    $( "#fore_toggle" ).append(new_icon);
  }
);
