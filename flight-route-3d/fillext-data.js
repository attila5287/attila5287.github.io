const fillExtProps = {
	geo: {
		height: 20,
		base: 0,
		emissivestrength: 0.9,
		color: "SkyBlue",
		opacity: 0.8,
		edgeRadius: 0,
	},
	area: {
		height: 1,
		base: 0,
		emissivestrength: 0.9,
		color: "RoyalBlue",
		opacity: 0.8,
		edgeRadius: 0,
	},
	slope: {
		userHeight: 20,
		userBase: 0,
		height: ["get", "height"],
		base: ["get", "base"],
		angle: 26.57,
		emissivestrength: 0.1,
		// color: "MediumAquamarine",
		color: "Navy",
		opacity: 0.1,
		edgeRadius: 0.0,
	},
	waypoint: {
		height: 9,
		base: 0,
		emissivestrength: 0.9,
		color: "SlateBlue",
		opacity: 0.8,
		edgeRadius: 0,
	},
};
const fillExtData = function (mode) {
	switch (mode) {
		case "geo":
			return this.inputDraw.geo;
		case "area":
			return this.inputDraw.area;
		case "waypoint": {
			const inputCoords = this.inputDraw.waypoint.features.map(
				(f) => f.geometry.coordinates
			);
			// console.log( 'input coords :>> ', ...inputCoords );
			// console.log('coords.length :>> ', inputCoords.length);

			const offsetCoords = turf.lineOffset(
				turf.lineString(inputCoords),
				0.26,
				{ units: "meters" }
			);
			let tempArr = [];
			tempArr = offsetCoords.geometry.coordinates;
			tempArr.reverse();
			const reversedOffsetCoords = tempArr;
			// console.log( "offsetCoords :>> ", ...offsetCoords.geometry.coordinates );

			const polCoords = [...inputCoords, ...reversedOffsetCoords];
			// we need a ring so we push the first point again
			polCoords.push(inputCoords[0]);
			// console.log('polCoords :>> ', ...polCoords);

			return turf.lineToPolygon(turf.lineString(polCoords));
			// return this.inputDraw.geo;
		}
		case "slope": {
			const angle = fillExtProps.slope.angle;
			// console.log('angle :>> ', angle);
			const indexOfLastPos =
				this.inputDraw.slope.features[0].geometry.coordinates.length -
				1;
			// console.log(indexOfLastPos);
			const coordsInput = [
				this.inputDraw.slope.features[0].geometry.coordinates[
					indexOfLastPos - 1
				],
				this.inputDraw.slope.features[0].geometry.coordinates[
					indexOfLastPos
				],
			];
			// console.log( 'coordsInput :>> ', ...coordsInput );
			const tan = 1 / Math.tan( ( angle * Math.PI ) / 180 );
			// step dynamic height
			// console.log( 'tan :>> ', tan );
			// const depth = this.fillExtProps.slope.height * tan;
			const extrHeight = fillExtProps.slope.userHeight-fillExtProps.slope.userBase;
			const depth = extrHeight * tan;
			// console.log("depth :>> ", depth);
      const line2pols = [];
			let line2pol;
			const iterCount = 200;
			const deltaDepth = depth / iterCount*-1;
			// console.log("deltaDepth :>> ", deltaDepth);


      const deltaHeight = extrHeight / iterCount;
      let coordsBase = coordsInput;
			// TODO create iterCount polygons to extrude diff height-base
			for ( let idxSegment = 0; idxSegment < iterCount; idxSegment++ ) {
			//   console.log(...coordsBase);
        const lineBase = turf.lineString(coordsBase);
				const coordsOffset = turf.lineOffset(
					lineBase,
					deltaDepth,
					{ units: "meters" }
				).geometry.coordinates;
				// console.log( 'coordsOffset :>> ', ...coordsOffset );

				const polCoords = [...coordsBase, ...coordsOffset];
				// we need a ring so we push the first point again
				polCoords.push(coordsBase[0]);
				// console.log('pol :>> ', ...pol);
				// we need to change the order of positions [x,y]s

				line2pol = turf.lineToPolygon(
					turf.lineString([
						polCoords[0],
						polCoords[1],
						polCoords[3],
						polCoords[2],
						polCoords[4],
					])
				);
				const segmentBase = (extrHeight/iterCount * idxSegment)+fillExtProps.slope.userBase;
				const segmentHeight =
					segmentBase + deltaHeight;
				// console.log(segmentHeight-segmentBase)
				// console.log(segmentHeight, segmentBase);
				line2pol.properties = {
					height: segmentHeight,
					base: segmentBase,
        };
        // console.log(idxSegment);
        // console.log("[line2pol] :>> ", line2pol);
        line2pols.push(line2pol);
				coordsBase = coordsOffset;
				
      }
			return turf.featureCollection(line2pols);
			// return this.inputDraw.geo;
		}
	}
};
export { fillExtProps, fillExtData };
