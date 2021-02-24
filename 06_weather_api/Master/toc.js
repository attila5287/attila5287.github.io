// console.log('test tox');
$(document).ready(function () {
  const sections = [ "search",
  "currently",
  "slider",
  "forecast",
  "route",
  ];
  const icons = [
    'fas fa-search',
    'fas fa-clock',
    'fas fa-sliders-h',
    'fas fa-chart-line',
    'fas fa-route',
  ]
	// console.log('sections :>> ', sections);
	append_sections(sections);

  function append_sections ( arr ) {
    
    $("#table_of_contents").empty();
		Object.keys(arr).forEach((i) => {
			let li = $("<li>");
			li.attr("data-index", i);
			li.attr("data-name", arr[i]);
      li.attr( "id", "nav_" + arr[ i ] );
			li.attr("class", "sec_name nav-item text-capitalize pr-3");
      
      let a = $( '<a>' );
      a.attr( 'class', 'nav-link' );

      let a_icon = $( '<i>' );
      a_icon.attr( 'class', icons[ i ] + ' text-xl mr-2' );
      
      let a_text = $( '<span>' );
      a_text.attr( 'class', 'text-bold' );
      a_text.text( arr[ i ] );
      
      
      a.append( a_icon );
      a.append( a_text );
			li.append(a);
      $( "#table_of_contents" ).append( li );
      
		});
	}

	$(".sec_name").on("click", jump_to_section);

	$.each($(".sec_name"), function (i, v) {});

	$.each($(".section_div"), function (i, v) {
		// console.log("i :>> ", Math.round($(this).offset().top) - 20);
		$(this).attr("data-coord-top", Math.round($(this).offset().top));
		$(this).attr(
			"data-coord-bottom",
			Math.round($(this).offset().top + $(this).height())
		);
		$(this).attr("data-index", i);
		$(this).attr("id", 'sec_'+sections[i]);
		$(this).attr("data-name", sections[i]);
	});

	function jump_to_section() {// click handler
		const nm = $(this).attr("data-name");
    const section = $( "#sec_" + nm );
    const coord = section.attr( "data-coord-top" );
    
    console.log('coord :>> ', coord);
		$(window).scrollTop(coord);
	}
  function highlight_active_section() {//listener scroll
    // console.log( "scroll handler" );
    $.each( $( ".section_div" ), function ( i, v ) {
      const curr_t = Math.round( +$( window ).scrollTop()+204 );
      console.log( 'curr_t :>> ', curr_t );
      const t = +$( this ).attr( 'data-coord-top' );
      const b = +$( this ).attr( 'data-coord-bottom' );
      
      let nav = $( "#nav_" + sections[ i ] );
      if ( t < curr_t && curr_t < b ) {
        console.log( 't :>> ', t );
        console.log( 'b :>> ', b );
        console.log(nav.attr("id"));
        nav.addClass("text-lg");
        nav.addClass("text-uppercase");
        nav.removeClass( "text-capitalize" );
      } else {
        nav.removeClass( "text-lg" );
        nav.removeClass("text-uppercase");
        nav.addClass("text-capitalize");
      }
    } );
  
  };
  $( window ).scroll( highlight_active_section );
});
