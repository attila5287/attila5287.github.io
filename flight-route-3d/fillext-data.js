const fillExtProps = {
	geo: {
		height: 20,
		base: 0,
		emissivestrength: 0.9,
		color: "SkyBlue",
		opacity: 0.8,
	},
	area: {
		height: 1,
		base: 0,
		emissivestrength: 0.9,
		color: "RoyalBlue",
		opacity: 0.8,
	},
	slope: {
		height: 20,
		base: 0,
		emissivestrength: 0.9,
		// color: "MediumAquamarine",
		color: "Black",
		opacity: 0.8,
	},
	waypoint: {
		height: 20,
		base: 0,
		emissivestrength: 0.9,
		color: "SlateBlue",
		opacity: 0.8,
	},
};
const fillExtData = function (mode) {
    switch (mode) {
        case "geo":
            return this.inputDraw.geo;
        case "area":
            return this.inputDraw.area;
        case "slope": {
            const angle = 3;
            // console.log('angle :>> ', angle);
            const indexOfLastPos =
                this.inputDraw.slope.features[0].geometry.coordinates.length - 1;
            // console.log(indexOfLastPos);
            const coordsInput = [
				this.inputDraw.slope.features[0].geometry.coordinates[
					indexOfLastPos-1
				],
				this.inputDraw.slope.features[0].geometry.coordinates[
					indexOfLastPos
				],
            ];
            // const coords1nput = this.inputDraw.slope.features[0].geometry.coordinates.splice( -2 );
            
            const lineString = turf.lineString(coordsInput);
            // console.log( 'coordsInput :>> ', ...coordsInput );
            const tan = Math.tan((angle * Math.PI) / 180);
            // console.log( 'tan :>> ', tan );
            const depth = fillExtProps.slope.height * tan;
            // console.log( 'depth :>> ', depth );

            const coordsOffset = turf.lineOffset(lineString, depth*-1, {
                units: "meters",
            }).geometry.coordinates;
            // console.log( 'coordsOffset :>> ', ...coordsOffset );

            const polCoords = [...coordsInput, ...coordsOffset];
            // we need a ring so we push the first point again
            polCoords.push(coordsInput[0]);
            // console.log('pol :>> ', ...pol);
            // we need to change the order of positions [x,y]s
            const line2pol = turf.lineToPolygon(
                turf.lineString([
                    polCoords[0],
                    polCoords[1],
                    polCoords[3],
                    polCoords[2],
                    polCoords[4],
                ])
            );
            // console.log('[line2pol] :>> ', line2pol);
            return line2pol;
            // return this.inputDraw.geo;
        }
        case "waypoint": {
            const inputCoords = this.inputDraw.waypoint.features.map(
                (f) => f.geometry.coordinates
            );
            // console.log( 'input coords :>> ', ...inputCoords );
            // console.log('coords.length :>> ', inputCoords.length);

            const offsetCoords = turf.lineOffset(
                turf.lineString(inputCoords),
                1,
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
    }
};
export { fillExtProps, fillExtData };
