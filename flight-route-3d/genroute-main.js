"use strict";
import { genRouteGeo } from "./genroute-geo.js";
import { genRouteArea } from "./genroute-area.js";
import { genRouteSlope } from "./genroute-slope.js";
import { genRouteWaypoint } from "./genroute-waypoint.js";
export const generateRoute3d = {
    geo: genRouteGeo,
    area: genRouteArea,
    waypoint: genRouteWaypoint,
    slope: genRouteSlope,
};
