"use strict";
export const genRouteWaypoint = ( featColl, userInput ) => {
  const { inElevation = 20 } = userInput || {};
  console.log("waypoint");
  const coords = featColl.features.map(f => f.geometry.coordinates);
  console.log( coords );
    const lineString  = turf.lineString( coords );
    const bezier = turf.bezier( lineString );
    console.log( bezier );
    bezier.properties.elevation = [inElevation];

  return {
    type: "FeatureCollection",
    features: [bezier],
  };
};
