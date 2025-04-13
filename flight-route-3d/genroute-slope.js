import { utils } from "./genroute-utils.js";
export const genRouteSlope = (lineSegment, userInput) => {
	// console.log( 'slope' );
	const features = []; // output of the function with geoJSON feats
	const {
		stepCount = 10,
		startHi = 0,
		finishHi = 20,
		angleSlope = -26.57,
	} = userInput || {};
	const stepHi = (finishHi - startHi) / stepCount;

	const inputPair = lineSegment.features[0].geometry.coordinates.splice( -2 );
	// console.log( ...inputPair )
	const inMeters = { units: "meters" };
	const start = {
		x: inputPair[0][0],
		y: inputPair[0][1],
	};
	const end = {
		x: inputPair[1][0],
		y: inputPair[1][1],
	};
	const len = turf.distance(inputPair[0], inputPair[1], inMeters);
	// console.log(len);

	const numCoords = 200;
	// step 1: iter thru 200 pos vectors, create a sample coords-elev array
	const distVec = [];
	const elevs = [];
	const coords = [];
	for (let i = 0; i <= numCoords; i++) {
		const posX = start.x + (end.x - start.x) * (i / numCoords);
		const posY = start.y + (end.y - start.y) * (i / numCoords);
		const dist = turf.distance([posX, posY], [start.x, start.y], inMeters);
		// console.log(dist, len);
		const marginExtrusion = 7;
		const startHiPass = startHi+marginExtrusion;
		const elev = utils.elevateFromDistance(dist, len, stepHi, startHiPass);
		// console.log( elev );
		elevs.push(elev);
		coords.push([posX, posY]);
		distVec.push(dist);
	}
	// step 2: create feats, move them vertically 
	for (let indexPass = 0; indexPass < stepCount; indexPass++) {
		const geometry = {
			type: "LineString",
			coordinates: [],
		};
		if (indexPass % 2 === 0) {
			geometry.coordinates = coords;
			const feature = turf.feature(geometry);
			feature.properties.elevation = elevs.map(
				(elv) => elv + indexPass * stepHi
			);
			features.push(feature);
		} else {
			const geometryReverse = {
				type: "LineString",
				coordinates: [...coords].reverse(),
			};
			const featureRev = turf.feature(geometryReverse);
			featureRev.properties.elevation = elevs.map(
				(d) => d + indexPass * stepHi
			);
			features.push(featureRev);
		}
	}

	// step 3: calculate dependant values with angle, height
	// console.log("testing: 1, 2, sqrt(5) triangle ", angleSlope);
	const deltaHeight = finishHi - startHi;
	const angleRadians = (angleSlope * Math.PI) / 180;
	const deltaDepth = (1 / Math.tan(angleRadians)) * deltaHeight;
	// console.log(">>H20?",deltaHeight,">>D40?",turf.round(deltaDepth)); //20-40
	
	const dispStep = deltaDepth / stepCount;
	// console.log('>>disp10?',turf.round(displacement));
	
	const transformedScaledFeats = [];
	// step 4: transform and scale the line features
	const featsTemp = [...features];
	// console.log(featsTemp); 	
	const featsMod = [];
	let coEnterBase = inputPair[0];
	for ( let idxFt = 0; idxFt < featsTemp.length; idxFt++ ) {
		
		const fe = featsTemp[idxFt];
		const props = fe.properties;
		// console.log( fe )
		const lineInput = turf.lineString(fe.geometry.coordinates);
		let displacement = 0;
		if (idxFt % 2 === 0) {
			displacement = dispStep;
		} else {
			displacement = dispStep * -1;
		}
		const lineBase = turf.lineOffset(
			lineInput,
			displacement * idxFt,
			inMeters
		);
		// FIXME:  coordsExit[0] should be equal to ccoordsEnter[1
		// coEnterBase = lineBase.geometry.coordinates[0];
		const idxOfLast = lineBase.geometry.coordinates.length - 1;
		const coExitBase = lineBase.geometry.coordinates[idxOfLast];
		// console.log(coEnterBase, coExitBase, idxFt);
		// console.log(lineBase)
		lineBase.properties = props;
		// featsMod.push(lineBase);
		
		const lineOffset = turf.lineOffset(
			lineInput,
			displacement * (idxFt + 1),
			inMeters
		);
		lineOffset.properties = props;
		// console.log(coEnterBase);
		const coExitOffset = lineOffset.geometry.coordinates[idxOfLast];
		// console.log( coExitOffset );

		const lenMod = turf.distance(coEnterBase, coExitOffset, inMeters);
		// console.log(lenMod);
		const newBasicLine = turf.lineString( [coEnterBase, coExitOffset] );
		// console.log(newBasicLine);
		const popLines = turf.lineChunk(newBasicLine, lenMod/200, inMeters);
		// console.log(popLines);
		const popCoords = popLines.features.flatMap( d => d.geometry.coordinates );
		const popCoordsLine  = turf.lineString(popCoords);
		// console.log(popCoords);
		const cleanCoords = turf.cleanCoords(popCoordsLine);
		// console.log(cleanCoords.geometry.coordinates[0]);
		// console.log(cleanCoords.geometry.coordinates[cleanCoords.geometry.coordinates.length - 1]);
		const diagonalLine = turf.lineString( cleanCoords.geometry.coordinates );
		diagonalLine.properties = props;
		// console.log(diagonalLine);

		featsMod.push(diagonalLine);
		// featsMod.push(lineBase);
		coEnterBase = coExitOffset;




		// const lenBase = turf.distance(coEnterBase, coExitBase, inMeters);
		// const ratio = lenMod / lenBase;
		// const chkLst = [idxFt, lenBase, lenMod, ratio];
		// // console.log( ...chkLst.map( d => turf.round( d, 2 ) ) );

		// const scaled = turf.transformScale(lineBase, ratio);
		// console.log(scaled)
		// featsMod.push(scaled);
		// featsMod.push(lineOffset);
		
		
		
		
		// let angleRot = 0;
		// if (idxFt % 2 === 0) {
		// 	angleRot = turf.angle(coExitBase, coEnterBase, coExitOffset);
		// 	console.log(coExitOffset);
		// 	// featsMod.push(rotated);
		// } else {
		// 	console.log(coEnterBase);
		// 	angleRot = turf.angle(coExitOffset, coEnterBase, coExitBase) * -1;
		// 	// featsMod.push(rotated);
		// }
		// const rotated = turf.transformRotate(scaled, angleRot, {
		// 	pivot: coEnterBase,
		// });
		// console.log( angleRot )
	}	


	const tester = [{
		type: "Feature",
		properties: {
			elevation: [2, 3],
		},
		geometry: {
			type: "LineString",
			coordinates: [
				[-104.98868933367768, 39.739292666320125],
				[-104.9883717991386, 39.739218068040856],
			],
		},
	}];
	//ANCHOR - feat should be turf.lineString() with props
	return {
		type: "FeatureCollection",
		// features: transformedScaledFeats,
		// features: features,
		features: featsMod,
	};
};
