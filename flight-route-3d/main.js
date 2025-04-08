'use strict';
import { renderModeButtons } from "./render-btn.js";
import { map, draw } from "./map-config.js";
import { renderCustomLayer } from "./render-layer3d.js";
import { renderCalcbox } from "./render-calcbox.js";
import { testData } from "./test-data.js";
import { fetchFormData } from "./fetch-forms.js";
import { generateRoute3d } from "./gen-route3d.js";

// Data object containing information and methods that have to do with the dataset
const data = {
  modes: ["area", "geo", "slope", "waypoint"],
  inputDraw: testData,
  inputForm: fetchFormData,
  prep: generateRoute3d,
  mapCenters: [[-104.98887493053121, 39.73899257929499]],
  modelURLs: [
    "https://raw.githubusercontent.com/attila5287/attila5287.github.io/refs/heads/master/helloDrone/uav/scene.gltf"
  ]
};
console.log( data );
function init(sessionData) {
  renderModeButtons(sessionData.modes);
  renderCustomLayer(sessionData.modelURLs[0], sessionData.mapCenters[0]);
  renderCalcbox(0, 0);
}
init( data );

function drawHandler(e) {
  console.log("D R A W   H A N D L E R");
  const userDrawn = draw.getAll();
  console.log( map.getCenter() );
  console.log( userDrawn );

  // TODO addLayer > setData()
  if (userDrawn.features.length > 0) {
    const area = turf.area(userDrawn);
    const distance = turf.length(userDrawn, { units: "meters" });
    // Restrict the area to 2 decimal points.
    const rounded_area = Math.round(area * 100) / 100;
    renderCalcbox(rounded_area, distance);
  } else {
    renderCalcbox(0, 0);
    if (e.type !== "draw.delete") {
      alert("Click the map to draw a polygon.");
    }
  }
}

map.on("draw.create", drawHandler);
map.on("draw.delete", drawHandler);
map.on("draw.update", drawHandler);
map.on("draw.uncombine", drawHandler);
map.on("draw.combine", drawHandler);
