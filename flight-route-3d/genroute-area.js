"use strict";
export const genRouteArea = ( polygon, userInput ) => {
  const { stepCount = 8, angleCourse = (90 * Math.PI) / 180 } = userInput || {};
  // console.log( userInput );

  const bbox = turf.bbox(polygon);
  const [minX, minY, maxX, maxY] = bbox;

  // Calculate step distance in degrees
  const bboxHeight = maxY - minY;
  const step = bboxHeight / stepCount;

  // Build horizontal lines
  const lines = [];
  for (let i = 0; i <= stepCount; i++) {
    const y = minY + i * step;
    const line = turf.lineString([
      [minX, y],
      [maxX, y],
    ]);
    lines.push(line);
  }

  // Rotate lines around bbox center if needed
  let rotated = turf.featureCollection(lines);
  if (angleCourse !== 0) {
    const center = turf.center(turf.bboxPolygon(bbox));
    rotated = turf.transformRotate(rotated, angleCourse, {
      pivot: center.geometry.coordinates,
    });
  }

  // Clip lines to polygon
  const clippedLines = rotated.features
    .map((line) => turf.lineIntersect(polygon, line))
    .filter((f) => f.features.length >= 2) // valid intersecting line
    .map((f) => {
      const coords = f.features.map((pt) => pt.geometry.coordinates);
      return turf.lineString(coords);
    });
  const zigzagLines = [];
  for (let i = 0; i < clippedLines.length; i++) {
    const current = clippedLines[i].geometry.coordinates;
    const reversed = [...current].reverse();
    const coords = i % 2 === 0 ? current : reversed;

    zigzagLines.push(turf.lineString(coords));

    // Add connecting leg (except after the last line)
    if (i < clippedLines.length - 1) {
      const next = clippedLines[i + 1].geometry.coordinates;
      const nextStart = i % 2 === 0 ? next[next.length - 1] : next[0];
      const currentEnd = coords[coords.length - 1];

      // Connect current end to next start
      zigzagLines.push(turf.lineString([currentEnd, nextStart]));
    }
  }
  zigzagLines.forEach((line) => {
    line.properties.elevation = [4];
  });
  // console.log( zigzagLines );
  return turf.featureCollection(zigzagLines);
};
