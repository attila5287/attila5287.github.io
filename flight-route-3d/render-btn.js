import { map, draw } from './map-config.js';
import { setCursorStyle } from './draw-modes.js';

export const renderModeButtons = (modes) => {
  const modeIcons = {
    area: ["fa-draw-polygon"],
    geo: ["fa-building"],
    slope: ["fa-solar-panel"],
    waypoint: ["fa-route"],
  };
  // const modes = Object.keys( modeIcons );
  
  const $cont = document.querySelector(".custom-btn-container");
  $cont.style.borderRadius = "10px";
  $cont.style.height = "50px";
  $cont.style.margin = "1px";
  $cont.classList.add( "align-items-center" );
  

  
  modes.forEach((mode) => {
    let buttonEl = document.createElement("a");
    buttonEl.classList.add("btn");
    buttonEl.classList.add("btn-outline-secondary");
    buttonEl.classList.add("overlay");
    
    const btnIcon = document.createElement("i");
    btnIcon.classList.add("fas");
    btnIcon.classList.add(...modeIcons[mode]);
    btnIcon.classList.add("fa-xl");
    btnIcon.classList.add("px-1");
    buttonEl.textContent = mode;
    buttonEl.appendChild(btnIcon);
    buttonEl.style.marginLeft = "4px";
    buttonEl.addEventListener("click", () => {
      draw.changeMode(mode + "_mode");
      setCursorStyle(mode + "_mode", map);
    });

    $cont.appendChild(buttonEl);
  });
}; 