"use strict";
export const genRouteWaypoint = ( featColl, userInput ) => {
  const { inElevation = 11 } = userInput || {};
  const coords = featColl.features.map(f => f.geometry.coordinates);
    const lineString  = turf.lineString( coords );
    const bezier = turf.bezier( lineString );
    bezier.properties.elevation = [inElevation];

  return {
    type: "FeatureCollection",
    features: [bezier],
  };
};
