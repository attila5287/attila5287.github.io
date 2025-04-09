import { map, draw } from './map-config.js';
import { renderMessage } from './render-message.js';
export const loadModeButtons = function (modes) {
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
    
    buttonEl.addEventListener( "click", () => {
      renderMessage( mode + " mode ON" );
      draw.changeMode(mode + "_mode");
      // map.getCanvas().style.cursor = "crosshair";
    });

    $cont.appendChild(buttonEl);
  });
}; 