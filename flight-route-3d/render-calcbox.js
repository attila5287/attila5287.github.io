export const  renderCalcbox = (area, dist) => {
  const $calcArea = document.querySelector(".calculated-area");
  $calcArea.innerHTML = `<p><strong>${area} m<sup>2</sup></strong></p><p><strong> ${dist} m</strong></p>`;
}