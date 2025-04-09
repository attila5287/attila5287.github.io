// Create custom modes by copying the default modes
import { renderMessage } from "./render-message.js";
export const areaMode = Object.assign( {}, window.MapboxDraw.modes.draw_polygon );
export const slopeMode = Object.assign({}, window.MapboxDraw.modes.draw_line_string);
export const waypointMode = Object.assign({}, window.MapboxDraw.modes.draw_point);
export const geoMode = Object.assign({}, window.MapboxDraw.modes.draw_polygon);

// Area Polygon Mode
areaMode.onSetup = function ( opts, map) {
  const state = MapboxDraw.modes.draw_polygon.onSetup.call(this, opts);
  console.log("Area polygon mode activated!");
  this.map.getCanvas().style.cursor = "crosshair";
  return state;
};

areaMode.onStop = function ( state, map) {
  console.log("Area polygon mode stopped.");
  this.map.getCanvas().style.cursor = "";
  MapboxDraw.modes.draw_polygon.onStop.call( this, state );
};

// Perimeter Polygon Mode
geoMode.onSetup = function ( opts, map) {
  const state = MapboxDraw.modes.draw_polygon.onSetup.call(this, opts);
  console.log("Perimeter polygon mode activated!");
  this.map.getCanvas().style.cursor = "crosshair";
  return state;
};

geoMode.onStop = function ( state, map) {
  console.log("Perimeter polygon mode stopped.");
  this.map.getCanvas().style.cursor = "";
  MapboxDraw.modes.draw_polygon.onStop.call(this, state);
};

// Line Mode
slopeMode.onSetup = function ( opts, map) {
  const state = MapboxDraw.modes.draw_line_string.onSetup.call(this, opts);
  console.log("Slope line mode activated!");
  this.map.getCanvas().style.cursor = "crosshair";
  return state;
};

slopeMode.onStop = function ( state, map) {
  console.log("Slope line mode stopped.");
  this.map.getCanvas().style.cursor = "";
  MapboxDraw.modes.draw_line_string.onStop.call(this, state);
};

// Point Mode
waypointMode.onSetup = function ( opts, map) {
  const state = MapboxDraw.modes.draw_point.onSetup.call(this, opts);
  console.log("Waypoint mode activated!");
  this.map.getCanvas().style.cursor = "crosshair";
  return state;
};

waypointMode.onStop = function ( state, map) {
  console.log("Waypoint mode stopped.");
  this.map.getCanvas().style.cursor = "";
  MapboxDraw.modes.draw_point.onStop.call(this, state);
}; 