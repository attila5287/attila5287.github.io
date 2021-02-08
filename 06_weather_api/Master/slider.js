
function update_slider (v) {
  $( '#slider' ).val( v );
  $( "#slider_index" ).text( v );
  const s = $('#slider');
  
  s.on( "change", function () {
    const changed = $("#slider").val();
    
    $( '#slider' ).val( changed );
    $("#slider_index").text(changed);
    
  });
}

update_slider(1); 
