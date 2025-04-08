"use strict";
import { renderModeButtons } from "./render-btn.js";
import { map, draw } from "./map-config.js";
import { generateCustomLayer } from "./render-layer3d.js";
import { renderCalcbox } from "./render-calcbox.js";
import { testData } from "./test-data.js";
import { fetchFormData } from "./fetch-forms.js";
import { generateRoute3d } from "./gen-route3d.js";

// Data object containing information and methods that have to do with the dataset
const app = {
  modes: ["area", "geo", "slope", "waypoint"],
  mapCenters: [[-104.98887493053121, 39.73899257929499]],
  modelURLs: [
    "https://raw.githubusercontent.com/attila5287/attila5287.github.io/refs/heads/master/helloDrone/uav/scene.gltf",
  ],
  inputDraw: testData,
  inputForm: fetchFormData,
  routeGenerator: generateRoute3d,
  generateRoutes: function () {
    this.modes.forEach((mode) => {
      // console.log( mode );
      // console.log(this.inputDraw);
    });
  },
  init: function () {
    renderModeButtons(this.modes);
    renderCalcbox(0, 0);
  },
};
console.log(app);
app.init();
map.on("draw.create", drawHandler);
map.on("draw.delete", drawHandler);
map.on("draw.update", drawHandler);
map.on("draw.uncombine", drawHandler);
map.on("draw.combine", drawHandler);

map.on("style.load", function () {
  map.addLayer( generateCustomLayer( app.modelURLs[0], app.mapCenters[0] ) );
  
  map.addSource("geo-extrude-src", {
    type: "geojson",
    data: app.inputDraw["geo"], //json data
  });
  console.log(app.inputDraw["geo"]);
  
  // FIXME - this is a hack to get the geo layer to work
  map.addLayer( {
    id: "geo-extrude-layer",
    type: "fill-extrusion",
    source: "geo-extrude-src",
    layout: {
      "fill-extrusion-edge-radius": 0.0,
    },
    paint: {
      "fill-extrusion-height": 20,
      "fill-extrusion-base": 0,
      "fill-extrusion-emissive-strength": 0.9,
      "fill-extrusion-color": "SkyBlue",
      "fill-extrusion-opacity": 0.8,
      "fill-extrusion-antialias": true,
    },
  });
  map.setConfigProperty("basemap", "lightPreset", "dusk");
});

function drawHandler(e) {
  const currentMode = draw.getMode();
  console.log("draw   H A N D L E R" + currentMode);
  const mode = draw.getMode();
  const userDrawn = draw.getAll();
  // console.log(userDrawn);
  
  if (userDrawn.features.length > 0) {
    map.getSource("geo-extrude-src").setData(userDrawn);
    map.triggerRepaint();
    const area = turf.area(userDrawn);
    const distance = turf.length(userDrawn, { units: "meters" });
    // Restrict the area to 2 decimal points.
    
    renderCalcbox(area, distance);
  } else {
    renderCalcbox(0, 0);
    if (e.type !== "draw.delete") {
      alert("Click the map to draw a polygon.");
    }
  }
}
