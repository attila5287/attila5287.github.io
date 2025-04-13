"use strict";
import { loadModeButtons } from "./load-modebtns.js";
import { map, draw } from "./map-config.js";
import { generateCustomLayer } from "./custom-layer.js";
import { renderCalcbox } from "./render-calcbox.js";
import { renderMessage } from "./render-message.js";
import { testData } from "./test-data.js";
import { fetchFormData } from "./fetch-forms.js";
import { generateRoute3d } from "./genroute-main.js";
import { fillExtData, fillExtProps } from "./fillext-data.js";
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
    fillExtProps: fillExtProps,
    fillExtData: fillExtData,
    init: function () {
        // console.log(app.fillExtProps["slope"].height);
        // app.generateRoutes();
        loadModeButtons(app.modes);
        map.setConfigProperty("basemap", "lightPreset", "night");
        map.addLayer(generateCustomLayer(app.modelURLs[0], app.mapCenters[0]));
        //ANCHOR - gen pre-route FIll Extrusion layers
        ["area", "geo", "slope", "waypoint"].forEach((mode) => {
            map.addSource(`${mode}-extrude-src`, {
                type: "geojson",
                data: app.fillExtData(mode),
            } );
            const genFillExt = app.fillExtData( mode );
            
            // console.log(mode + " Fill Ext layer ", genFillExt);

            map.addLayer({
				id: `${mode}-extrude-layer`,
				type: "fill-extrusion",
				source: `${mode}-extrude-src`,
				layout: {
					"fill-extrusion-edge-radius": app.fillExtProps[mode].edgeRadius,
				},
				paint: {
					"fill-extrusion-height": app.fillExtProps[mode].height,
					"fill-extrusion-base": app.fillExtProps[mode].base,
					"fill-extrusion-color": app.fillExtProps[mode].color,
					"fill-extrusion-emissive-strength": 0.9,
					"fill-extrusion-opacity": 0.4,
					"fill-extrusion-cast-shadows": false,
					"fill-extrusion-flood-light-intensity": 0.5,
					"fill-extrusion-flood-light-color": "DarkTurquoise",
					"fill-extrusion-flood-light-ground-radius": 1,
				},
			});
        });
        // ADD  export those functions to a new file
        ["geo", "area", "slope", "waypoint"].forEach((mode) => {
            // console.log("app.inputDraw" + mode, app.inputDraw[mode]);

            const generatedRoute = generateRoute3d[mode](app.inputDraw[mode]);

            // console.log(mode + " gen'd route -Line- layer ", generatedRoute);
            map.addSource(`${mode}-line-src`, {
                type: "geojson",
                data: generatedRoute,
                lineMetrics: true,
            });
            // base config for 2 line layers hrz/vert
            const paintLine = {
                "line-emissive-strength": 1.0,
                "line-blur": 0.25,
                "line-width": 2.75,
                "line-color": "limegreen",
            };
            let layoutLine = {
                // shared layout between two layers
                "line-z-offset": [
                    "at",
                    [
                        "*",
                        ["line-progress"],
                        ["-", ["length", ["get", "elevation"]], 1],
                    ],
                    ["get", "elevation"],
                ],
                "line-elevation-reference": "sea",
                "line-cap": "round",
            };

            layoutLine["line-cross-slope"] = 0;
            map.addLayer({
                id: `${mode}-line-horizontal`,
                type: "line",
                source: `${mode}-line-src`,
                layout: layoutLine,
                paint: paintLine,
            });

            // elevated-line-vert
            layoutLine["line-cross-slope"] = 1;
            map.addLayer({
                id: `${mode}-line-vertical`,
                type: "line",
                source: `${mode}-line-src`,
                layout: layoutLine,
                paint: paintLine,
            });
        });
    },
    updateLayers: function (e) {
        const currentMode = draw.getMode();
        console.log("draw H.A.N.D.L.E.R mode:" + currentMode);
        const drawData = draw.getAll();
        let layerData = drawData?.features?.length > 0 ? drawData : testData;
        console.log(
            "drawData :>> ",
            layerData.features.map((d) => d.geometry.coordinates)
        );
        
        console.log(layerData);
        // map.getSource(currentMode+"-extrude-src").setData(layerData);
        // renderCalcbox(layerData.currentMode);
    },
};
map.on("draw.create", app.updateLayers);
map.on("draw.delete", app.updateLayers);
map.on("draw.update", app.updateLayers);
map.on("draw.uncombine", app.updateLayers);
map.on("draw.combine", app.updateLayers);
map.on("style.load", app.init);
