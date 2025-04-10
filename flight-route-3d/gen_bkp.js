import { utils } from "./genroute-utils.js";
export const genRouteSlope = (lineSegment, userInput) => {
	// console.log( 'slope' );

	const features = []; // output of the function with geoJSON feats
	const {
		stepCount = 4,
		startHi = 0,
		finishHi = 20,
		angleSlope,
	} = userInput || {};
	const stepHi = (finishHi - startHi) / stepCount;

	const inputCoords = lineSegment.features[0].geometry.coordinates;
	const inMeters = { units: "meters" };
	const start = {
		x: inputCoords[0][0],
		y: inputCoords[0][1],
	};
	const end = {
		x: inputCoords[1][0],
		y: inputCoords[1][1],
	};
	const len = turf.distance(inputCoords[0], inputCoords[1], inMeters);
	// console.log(len);

	const numCoords = 200;
	// step 1: iter thru 200 pos vectors, create a sample coords-elev array
	const distVec = [];
	const elevs = [];
	const coords = [];
	const pos = {
		x: 0,
		y: 0,
		z: 0,
	};

	for (let i = 0; i <= numCoords; i++) {
		pos.x = start.x + (end.x - start.x) * (i / numCoords);
		pos.y = start.y + (end.y - start.y) * (i / numCoords);
		const dist = turf.distance([pos.x, pos.y], [start.x, start.y], inMeters);
		// console.log(dist, len);
		const startHiPass = startHi;
		pos.z = utils.elevateFromDistance(dist, len, stepHi, 0);
		
		
		elevs.push( pos.z );
		coords.push([pos.x, pos.y]);
		distVec.push(dist);
	}

	for ( let indexPass = 0; indexPass < stepCount; indexPass++ ) {
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
	const tester = [firstHrz];
	return {
		type: "FeatureCollection",
		features: features,
		// features: tester,
	};
};
