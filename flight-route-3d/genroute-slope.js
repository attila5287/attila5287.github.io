import { utils } from "./genroute-utils.js";
export const genRouteSlope = (lineSegment, userInput) => {
	// console.log( 'slope' );
	const features = []; // output of the function with geoJSON feats
	const {
		stepCount = 4,
		startHi = 0,
		finishHi = 20,
		angleSlope=26.57,
	} = userInput || {};
	const stepHi = (finishHi - startHi) / stepCount;
	const angleRad = angleSlope * ( Math.PI / 180 );
	const disp = {
		vert: (finishHi - startHi),
		horz: (1 / Math.tan(angleRad)) * (finishHi - startHi),
	};

	// console.log(disp.vert, disp.horz);
	const inputCoords = lineSegment.features[0].geometry.coordinates;
	const inMeters = { units: "meters" };
	const inp = {
		start: {
			x: inputCoords[inputCoords.length - 2][0],
			y: inputCoords[inputCoords.length - 2][1],
		},
		end: {
			x: inputCoords[inputCoords.length - 1][0],
			y: inputCoords[inputCoords.length - 1][1],
		},
	};
	const len = turf.distance(inputCoords[0], inputCoords[1], inMeters);
	const numCoords = 200;

	const offset = turf.lineOffset( turf.lineString( [[inp.start.x, inp.start.y], [inp.end.x, inp.end.y] ]), disp.horz, inMeters );
	// console.log(offset);
	const off = {
		start: {
			x: offset.geometry.coordinates[0][0],
			y: offset.geometry.coordinates[0][1],
		},
		end: {
			x: offset.geometry.coordinates[1][0],
			y: offset.geometry.coordinates[1][1],
		},
	};
	console.log(off);
	
	// step 1: iter thru 200 pos vectors, create a sample coords-elev array
	for ( let indexPass = 0; indexPass < stepCount; indexPass++ ) {
		const distVec = [];
		const elevs = [];
		const coords = [];
		for (let i = 0; i <= numCoords; i++) {
			const posX = inp.start.x + (inp.end.x - inp.start.x) * (i / numCoords);
			const posY = inp.start.y + (inp.end.y - inp.start.y) * (i / numCoords);
			const dist = turf.distance([posX, posY], [inp.start.x, inp.start.y], inMeters);
			// console.log(dist, len);
			const startHiPass = startHi;
			const elev = utils.elevateFromDistance(dist, len, stepHi, 0);
			// console.log( elev );
			elevs.push(elev);
			coords.push([posX, posY]);
			distVec.push(dist);
		}
		const geometry = {
			type: "LineString",
			coordinates: [],
		};
		if ( indexPass % 2 === 0 ) {
			geometry.coordinates = coords;
			const feature = turf.feature(geometry);
			feature.properties.elevation = elevs.map((elv) => elv + indexPass * stepHi );
			features.push(feature);
		} else {
			const geometryReverse = {
				type: "LineString",
				coordinates: [...coords].reverse(),
			};
			const featureRev = turf.feature(geometryReverse);
			featureRev.properties.elevation = elevs.map((d) => d + indexPass * stepHi );
			features.push(featureRev);
		}
	}

	// console.log(features);

	const firstHrz = {
		type: "Feature",
		properties: {
			elevation: [0, 0],
		},
		geometry: {
			type: "LineString",
			coordinates: [
				[-104.98868933367768, 39.739292666320125],
				[-104.9883717991386, 39.739218068040856],
			],
		},
	};
	const firstVrt = {
		type: "Feature",
		properties: {
			elevation: [0, 1, 2, 3, 4],
		},
		geometry: {
			type: "LineString",
			coordinates: [
				[-104.9883717991386, 39.73921],
				[-104.9883717991386, 39.739218068],
				[-104.9883717991386, 39.73921806804],
				[-104.9883717991386, 39.7392180680408],
				[-104.9883717991386, 39.739218068040856],
			],
		},
	};
	const tester = [firstHrz, firstVrt];
	return {
		type: "FeatureCollection",
		features: features,
		// features: tester,
	};
};
