render( questions );

function render ( data ) {
  $range =  document.querySelector("#range");
  let index =$range.value;
  console.log('index :>> ', index);
  $range.addEventListener( "change", ( event ) => {
    console.log("event.target.id :>> ", $range.value);
    
  });
  const length = data.length;
  const step = Math.floor( 100 / length );
  $progress = document.querySelector( "#progress" );
  $progress.setAttribute( "step", step );
  const perc = step * index;
  const pro_style = "width: " + perc + "%; ";
  $progress.setAttribute( "style", pro_style );
  $progress.setAttribute( "aria-valuenow", perc );
  
  const d = data[ index ];

  console.log( 'question :>> ', d );

  $div = document.querySelector( ".question" );
  const $title = $div.querySelector( ".title" );
  $title.textContent = d.title;
  const choices = d.choices;
  $choices = $div.querySelectorAll( ".choice_text" );

  for ( let i = 0; i < choices.length; i++ ) {
    const c = choices[ i ];
    const $c = $choices[ i ];
    $c.textContent = c;

  }
}
// console.log('choices :>> ', choices);




