export const renderCalcbox = (geoJSON) => {
  
  console.log(geoJSON);
  
  const $calcArea = document.querySelector( ".calculated-area" );

  if ( !geoJSON ) {
    return;
  } else if ( geoJSON?.features?.length === 0 ) {
    return;
  } else {
      
    const area = turf.area(geoJSON);
    const dist = turf.length(geoJSON, { units: "meters" });
    const rounded_area = Math.round(area * 100) / 100;
    const rounded_dist = Math.round(dist * 100) / 100;
    $calcArea.innerHTML = `<p><strong>${rounded_area} m<sup>2</sup></strong></p><p><strong> ${rounded_dist} m</strong></p>`;
  }
};