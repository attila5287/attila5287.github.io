"use strict";
export const utils = {
	elevateFromDistance: function (
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

		if (isInSeg1ConcaveDown) {
			// First segment: quarter circle (0 to π/2) moving upward
			// calculatedY = r - Math.sqrt(r * r - x * x);
			calculatedY = Math.sqrt(r * r - (x - r) * (x - r));
			// console.log(calculatedY);
		} else if (isInSeg3ConcaveUp) {
			// Third segment: quarter circle (π to 3π/2) moving downward
			const xFromEnd = inLoopLength - x;
			calculatedY =
				r - Math.sqrt(r * r - (xFromEnd - r) * (xFromEnd - r));
			calculatedY += inStepHeight * 0.5;
		} else {
			// Second segment: straight line at maximum height (2r)
			calculatedY = inStepHeight * 0.5;
		}
		// Add the base elevation
		return calculatedY + inElevMin;
	},
	distanceFromCoords: function (cors) {
		// console.log( cors )
		const distArr = [];
		distArr.push(0); //first distance
		let sum = 0;
		for (let i = 1; i < cors.length; i++) {
			const seg = turf.distance(cors[i - 1], cors[i], {
				units: "meters",
			});
			sum = sum + seg;
			distArr.push(sum);
		}
		return distArr;
	},
	areObjectsEqual: function (obj1, obj2) {
		return (
			JSON.stringify(Object.entries(obj1).sort()) ===
			JSON.stringify(Object.entries(obj2).sort())
		);
	},
	translateCoords: function (fe) {
		const cor = fe.geometry.coordinates;
		const elev = fe.properties.elevation;
		const newCoords = [];
		
	}
};
