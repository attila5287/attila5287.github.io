// Create custom modes by copying the default modes
export const areaMode = Object.assign({}, window.MapboxDraw.modes.draw_polygon);
export const slopeMode = Object.assign({}, window.MapboxDraw.modes.draw_line_string);
export const waypointMode = Object.assign({}, window.MapboxDraw.modes.draw_point);
export const geoMode = Object.assign({}, window.MapboxDraw.modes.draw_polygon);
export function setCursorStyle(mode, map) {
  switch (mode) {
    case "area_mode":
    case "slope_mode":
    case "geo_mode":
      map.getCanvas().style.cursor = "crosshair";
      break;
    case "waypoint_mode":
      map.getCanvas().style.cursor = "pointer";
      break;
    default:
      map.getCanvas().style.cursor = "";
  }
}

// Area Polygon Mode
areaMode.onSetup = function (opts) {
  const state = MapboxDraw.modes.draw_polygon.onSetup.call(this, opts);
  console.log("Area polygon mode activated!");
  setCursorStyle("area_mode", this.map);
  return state;
};

areaMode.onStop = function (state) {
  console.log("Area polygon mode stopped.");
  setCursorStyle("", this.map);
  MapboxDraw.modes.draw_polygon.onStop.call(this, state);
};

// Perimeter Polygon Mode
geoMode.onSetup = function (opts) {
  const state = MapboxDraw.modes.draw_polygon.onSetup.call(this, opts);
  console.log("Perimeter polygon mode activated!");
  setCursorStyle("geo_mode", this.map);
  return state;
};

geoMode.onStop = function (state) {
  console.log("Perimeter polygon mode stopped.");
  setCursorStyle("", this.map);
  MapboxDraw.modes.draw_polygon.onStop.call(this, state);
};

// Line Mode
slopeMode.onSetup = function (opts) {
  const state = MapboxDraw.modes.draw_line_string.onSetup.call(this, opts);
  console.log("Slope line mode activated!");
  setCursorStyle("slope_mode", this.map);
  return state;
};

slopeMode.onStop = function (state) {
  console.log("Slope line mode stopped.");
  setCursorStyle("", this.map);
  MapboxDraw.modes.draw_line_string.onStop.call(this, state);
};

// Point Mode
waypointMode.onSetup = function (opts) {
  const state = MapboxDraw.modes.draw_point.onSetup.call(this, opts);
  console.log("Waypoint mode activated!");
  setCursorStyle("waypoint_mode", this.map);
  return state;
};

waypointMode.onStop = function (state) {
  console.log("Waypoint mode stopped.");
  setCursorStyle("", this.map);
  MapboxDraw.modes.draw_point.onStop.call(this, state);
}; 