"use strict";
export const generateRoute3d = {
  geo: ( poly, userInput ) => {
    const {
      inBaseHi = 0,
      inTopHi = 20,
      inStepCount = 4,
      inToleranceWidth = 6,
    } = userInput || {};
    console.log( userInput );

    let stepHeight = ( inTopHi - inBaseHi ) / inStepCount;

    const features = []; // output of the function with geoJSON feats
    function elevateFromDistance(
      XfromStart, // distance From Start: X-bar
      inLoopLength, // length of base ring: totalX
      inStepHeight, // height is 2r
      inElevMin // base height
    ) {
      const r = inStepHeight * 0.5; // radius of the circular segments
      const x = XfromStart;

      // 3 SEGMENTS OF THE LINE
      const isInSeg1ConcaveDown = x < r; // First segment (circular, concave down)
      const isInSeg3ConcaveUp = inLoopLength - x < r; // Third segment (circular, concave up)

      let calculatedY; // result

      if ( isInSeg1ConcaveDown ) {
        // First segment: quarter circle (0 to π/2) moving upward
        // calculatedY = r - Math.sqrt(r * r - x * x);
        calculatedY = Math.sqrt( r * r - ( x - r ) * ( x - r ) );
        // console.log(calculatedY);
      } else if ( isInSeg3ConcaveUp ) {
        // Third segment: quarter circle (π to 3π/2) moving downward
        const xFromEnd = inLoopLength - x;
        calculatedY = r - Math.sqrt( r * r - ( xFromEnd - r ) * ( xFromEnd - r ) );
        calculatedY += inStepHeight * 0.5;
      } else {
        // Second segment: straight line at maximum height (2r)
        calculatedY = inStepHeight * 0.5;
      }
      // Add the base elevation
      return calculatedY + inElevMin;
    }
    // console.log(poly.features[0].geometry.coordinates)
    function smootherPoly( polygon ) {
      // console.log(polygon);
      const buffered = turf.buffer( polygon, inToleranceWidth, {
        units: "meters",
      } );
      const simplified = turf.simplify( buffered, {
        tolerance: 0.000001,
        highQuality: false,
      } );
      return turf.polygonSmooth( simplified, { iterations: 3 } );
    }
    const smoother = smootherPoly( poly );
    const indexOfLastFeat = smoother.features.length - 1;

    for ( let indxLoop = 0; indxLoop < inStepCount; indxLoop++ ) {
      let elevBase = indxLoop * stepHeight + inBaseHi;

      const loopLen2d = turf.length( smoother, { units: "meters" } );
      if ( smoother.features.length > 0 ) {
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
        coords = smoother.features[
          indexOfLastFeat
        ].geometry.coordinates.flatMap( ( d ) => d );
        rev = [...coords].reverse();
        function distanceFromCoords( cors ) {
          // console.log( cors )
          const distArr = [];
          distArr.push( 0 ); //first distance
          let sum = 0;
          for ( let i = 1; i < cors.length; i++ ) {
            const seg = turf.distance( cors[i - 1], cors[i], {
              units: "meters",
            } );
            sum = sum + seg;
            distArr.push( sum );
          }
          return distArr;
        }

        for ( let idxCord = 0; idxCord < coords.length; idxCord++ ) {
          const cord = coords[idxCord];
          feat.geometry.coordinates.push( cord );
        }
        // FIXME only works with [0]th polygon
        feat.properties.distFromStart = distanceFromCoords(
          smoother.features[indexOfLastFeat].geometry.coordinates.flatMap(
            ( d ) => d
          )
        );
        distArray = feat.properties.distFromStart;

        if ( indxLoop % 2 === 0 ) {
          // 1st RING
          feat.properties.elevation = distArray.map( ( distanceFromStart ) =>
            elevateFromDistance(
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
          feat.geometry.coordinates.push( ...rev );
          feat.properties.elevation = feat.properties.distFromStart.map(
            ( distanceFromStart ) =>
              elevateFromDistance(
                distanceFromStart,
                feat.properties.LOOPLENGTH,
                feat.properties.STEPHEIGHT,
                feat.properties.ELEVMIN
              )
          );

          // console.log(feat.properties.elevation);
        }
        features.push( feat );
      } else {
        console.log( "generate lines: no feats in geojson smoother polygon" );
      }
    }
    console.log( features );

    return {
      type: "FeatureCollection",
      features: features,
    };
  },
  area : ( poly, userInput ) => {
    console.log( userInput );
    const { stepCount = 4, angle = 4 } = userInput || {};
    const bbox = turf.bbox( polygon );
    const [minX, minY, maxX, maxY] = bbox;

    // Calculate step distance in degrees
    const bboxHeight = maxY - minY;
    const step = bboxHeight / stepCount;

    // Build horizontal lines
    const lines = [];
    for ( let i = 0; i <= stepCount; i++ ) {
      const y = minY + i * step;
      const line = turf.lineString( [
        [minX - 0.01, y],
        [maxX + 0.01, y],
      ] );
      lines.push( line );
    }

    // Rotate lines around bbox center if needed
    let rotated = turf.featureCollection( lines );
    if ( angle !== 0 ) {
      const center = turf.center( turf.bboxPolygon( bbox ) );
      rotated = turf.transformRotate( rotated, angle, {
        pivot: center.geometry.coordinates,
      } );
    }

    // Clip lines to polygon
    const clippedLines = rotated.features
      .map( ( line ) => turf.lineIntersect( polygon, line ) )
      .filter( ( f ) => f.features.length >= 2 ) // valid intersecting line
      .map( ( f ) => {
        const coords = f.features.map( ( pt ) => pt.geometry.coordinates );
        return turf.lineString( coords );
      } );

    // Zigzag ordering
    const zigzagLines = clippedLines.map( ( line, i ) =>
      i % 2 === 0
        ? line
        : turf.lineString( [...line.geometry.coordinates].reverse() )
    );

    return turf.featureCollection( zigzagLines );
  },
  slope: ( lineSegment, userInput ) => {
    console.log( 'slope' );
    const { stepCount = 4, startHi = 6, finishHi = 24, angle } = userInput || {};
    console.log( userInput );
    console.log( "waypoint" );
    console.log( lineSegment );
    console.log( userInput );
    const features = []; // output of the function with geoJSON feats
    // console.log(line.features)
    // console.log(...line.features)
    return {
      type: "FeatureCollection",
      features: features,
    };
  },
  waypoint: ( multiPoint, userInput ) => {
    console.log( userInput );
    const { inStepCount = 4, inElevation = 16 } = userInput || {};
    console.log( "waypoint" );
    console.log( multiPoint );
    console.log( userInput );
    const features = []; // output of the function with geoJSON feats
    // console.log(poly.features[0].geometry.coordinates)
    return {
      type: "FeatureCollection",
      features: features,
    };
  },
};



