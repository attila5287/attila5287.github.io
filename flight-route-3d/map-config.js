import { areaMode, slopeMode, waypointMode, geoMode } from "./draw-modes.js";

const coordsDenver = [-104.98887493053121, 39.73899257929499]; // civic
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard",
  zoom: 18.00,
  center: coordsDenver, // civic
  pitch: 40,
  bearing: 0,
  antialias: true,
});

// D R A W     C O N T R O L S
const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    trash: true,
    combine_features: true,
    uncombine_features: true,
  },
  modes: {
    ...MapboxDraw.modes, // Include default modes
    area_mode: areaMode,
    geo_mode: geoMode,
    slope_mode: slopeMode,
    waypoint_mode: waypointMode,
  },
});

map.addControl(draw);

export { map, draw };
