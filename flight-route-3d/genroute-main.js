"use strict";
import { genRouteGeo } from "./genroute-geo.js";
import { genRouteArea } from "./genroute-area.js";
import { genRouteSlope } from "./genroute-slope.js";
export const generateRoute3d = {
    geo: genRouteGeo,
    area: genRouteArea,
    waypoint: (multiPoint, userInput) => {
        const { inStepCount = 4, inElevation = 16 } = userInput || {};
        const features = []; // output 
        console.log("waypoint");
        console.log(multiPoint);
        return {
            type: "FeatureCollection",
            features: features,
        };
    },
    slope: genRouteSlope,
};
