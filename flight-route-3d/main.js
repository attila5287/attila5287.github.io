"use strict";
import { loadModeButtons } from "./load-modebtns.js";
import { map, draw } from "./map-config.js";
import { generateCustomLayer } from "./render-layer3d.js";
import { renderCalcbox } from "./render-calcbox.js";
import { renderMessage } from "./render-message.js";
import { testData } from "./test-data.js";
import { fetchFormData } from "./fetch-forms.js";
import { generateRoute3d } from "./gen-route3d.js";

// Data object containing information and methods that have to do with the dataset
const app = {
    modes: ["area", "geo", "slope", "waypoint"],
    mapCenters: [[-104.98887493053121, 39.73899257929499]],
    modelURLs: [
        "https://raw.githubusercontent.com/attila5287/attila5287.github.io/refs/heads/master/helloDrone/uav/scene.gltf",
    ],
    inputDraw: testData,
    inputForm: fetchFormData,
    routeGenerator: generateRoute3d,
    generateRoutes: function () {
        this.modes.forEach((mode) => {
            console.log("generateRoutes " + mode);
        });
    },
    fillExtProps: {
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
            color: "MediumAquamarine",
            opacity: 0.8,
        },
    },
    prepInputDraw: function (mode) {
        switch (mode) {
            case "geo":
                return this.inputDraw.geo;
            case "area":
                return this.inputDraw.area;
			case "slope": {
				const angle = 0;
				// console.log('angle :>> ', angle);
				const coordsInput = this.inputDraw.slope.features[0].geometry.coordinates;
				const lineString = turf.lineString(coordsInput);
				// console.log( 'coordsInput :>> ', ...coordsInput );
				const tan = Math.tan(angle*Math.PI/180);
				// console.log( 'tan :>> ', tan );
				const depth = app.fillExtProps.slope.height*tan;
				// console.log( 'depth :>> ', depth );

				const coordsOffset = turf.lineOffset(
					lineString,
					depth,
					{
						units: "meters",
				} ).geometry.coordinates;
				// console.log( 'coordsOffset :>> ', ...coordsOffset );
				
				const pol = [
					...coordsInput,
					...coordsOffset,
				];
				pol.push(coordsInput[0]);
				// console.log('pol :>> ', ...pol);

				const line2pol = turf.lineToPolygon(
					turf.lineString([
						pol[0],
						pol[1],
						pol[3],
						pol[2],
						pol[4],
					])
                );
				// console.log('[line2pol] :>> ', line2pol);
                return line2pol;
                // return this.inputDraw.geo;
            }
        }
    },
    init: function () {
        // app.generateRoutes();
        loadModeButtons(app.modes);
        map.setConfigProperty("basemap", "lightPreset", "dusk");
        map.addLayer(generateCustomLayer(app.modelURLs[0], app.mapCenters[0]));

        ["slope", "area", "geo"].forEach((mode) => {
            map.addSource(`${mode}-extrude-src`, {
                type: "geojson",
                data: app.prepInputDraw(mode),
            });

            map.addLayer({
                id: `${mode}-extrude-layer`,
                type: "fill-extrusion",
                source: `${mode}-extrude-src`,
                layout: {
                    "fill-extrusion-edge-radius": 0.0,
                },
                paint: {
                    "fill-extrusion-height": app.fillExtProps[mode].height,
                    "fill-extrusion-base": app.fillExtProps[mode].base,
                    "fill-extrusion-emissive-strength": 0.9,
                    "fill-extrusion-color": app.fillExtProps[mode].color,
                    "fill-extrusion-opacity": 0.8,
                    "fill-extrusion-antialias": true,
                },
            });
        });
    },

    updateLayers: function (e) {
        const currentMode = draw.getMode();
        console.log("draw H.A.N.D.L.E.R mode:" + currentMode);
        const drawData = draw.getAll();
        let layerData = drawData?.features?.length > 0 ? drawData : testData;

        console.log(layerData);
        map.getSource(currentMode+"-extrude-src").setData(layerData);
        renderCalcbox(layerData.currentMode);
    },
};
map.on("draw.create", app.updateLayers);
map.on("draw.delete", app.updateLayers);
map.on("draw.update", app.updateLayers);
map.on("draw.uncombine", app.updateLayers);
map.on("draw.combine", app.updateLayers);
map.on("style.load", app.init);
