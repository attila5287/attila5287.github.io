export const renderCalcbox = ( area, dist ) => {
  const rounded_area = Math.round(area * 100) / 100;
  const rounded_dist = Math.round(dist * 100) / 100;
  const $calcArea = document.querySelector(".calculated-area");
  $calcArea.innerHTML = `<p><strong>${rounded_area} m<sup>2</sup></strong></p><p><strong> ${rounded_dist} m</strong></p>`;
}