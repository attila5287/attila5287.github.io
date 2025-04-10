import { utils } from './genroute-utils.js';
export const genRouteGeo = ( poly, userInput ) => {
  const {
    inBaseHi = 0,
    inTopHi = 20,
    inStepCount = 4,
    inToleranceWidth = 6,
  } = userInput || {};
  // console.log( userInput );

  let stepHeight = (inTopHi - inBaseHi) / inStepCount;

  const features = []; // output of the function with geoJSON feats
  
  // console.log(poly.features[0].geometry.coordinates)
  function smootherPoly(polygon) {
    // console.log(polygon);
    const buffered = turf.buffer(polygon, inToleranceWidth, {
      units: "meters",
    });
    const simplified = turf.simplify(buffered, {
      tolerance: 0.000001,
      highQuality: true,
    });
    return turf.polygonSmooth(simplified, { iterations: 3 });
  }
  const smoother = smootherPoly(poly);
  const indexOfLastFeat = smoother.features.length - 1;

  for (let indxLoop = 0; indxLoop < inStepCount; indxLoop++) {
    let elevBase = indxLoop * stepHeight + inBaseHi;

    const loopLen2d = turf.length(smoother, { units: "meters" });
    if (smoother.features.length > 0) {
      // console.log(smoother.features[0].geometry.coordinates);
      const feat = {
        // feat for Line - flight Path
        type: "Feature",
        properties: {
          id: indxLoop,
          LOOPLENGTH: loopLen2d,
          STEPHEIGHT: stepHeight,
          ELEVMIN: elevBase,
          ELEVMAX: elevBase + stepHeight,
          distFromStart: [],
          elevation: [],
          coordsRev: [],
        },
        geometry: {
          coordinates: [],
          type: "LineString",
        },
      };
      let rev = [];
      let coords = [];
      let distArray = [];
      coords = smoother.features[indexOfLastFeat].geometry.coordinates.flatMap(
        (d) => d
      );
      rev = [...coords].reverse();
      

      for (let idxCord = 0; idxCord < coords.length; idxCord++) {
        const cord = coords[idxCord];
        feat.geometry.coordinates.push(cord);
      }
      // FIXME only works with [0]th polygon
      feat.properties.distFromStart = utils.distanceFromCoords(
        smoother.features[indexOfLastFeat].geometry.coordinates.flatMap(
          (d) => d
        )
      );
      distArray = feat.properties.distFromStart;

      if (indxLoop % 2 === 0) {
        // 1st RING
        feat.properties.elevation = distArray.map((distanceFromStart) =>
          utils.elevateFromDistance(
            distanceFromStart,
            feat.properties.LOOPLENGTH,
            feat.properties.STEPHEIGHT,
            feat.properties.ELEVMIN
          )
        );
        // console.log( feat.properties.elevation );
      } else {
        // 2nd RING
        feat.geometry.coordinates = [];
        feat.geometry.coordinates.push(...rev);
        feat.properties.elevation = feat.properties.distFromStart.map(
          (distanceFromStart) =>
            utils.elevateFromDistance(
              distanceFromStart,
              feat.properties.LOOPLENGTH,
              feat.properties.STEPHEIGHT,
              feat.properties.ELEVMIN
            )
        );

        // console.log(feat.properties.elevation);
      }
      features.push(feat);
    } else {
      // console.log( "generate lines: no feats in geojson smoother polygon" );
    }
  }
  
  // console.log(features[0].geometry.coordinates.length);
  return {
    type: "FeatureCollection",
    features: features,
  };
};
