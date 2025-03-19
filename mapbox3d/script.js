let userExtrusionHeight = 16;
let userStepCount = 4;
mapboxgl.accessToken = 'pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw';
let baseConfig = {
    basemap: {
        lightPreset: 'day'
    }
};
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    config: baseConfig,
    zoom: 18.75,
    center: [-104.98887493053121, 39.73899257929499], // civic
    pitch: 65,
    antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
});

let $duskMode = document.querySelector("#duskModeCkbox");
let isDusk = false;
$duskMode.addEventListener('change', (e) => {
    if (!isDusk) {
        map.setConfigProperty('basemap', 'lightPreset', 'dusk');
        isDusk = true;
        $duskMode.setAttribute("checked", "checked")
    } else {
        map.setConfigProperty('basemap', 'lightPreset', 'day');
        isDusk = false;
        $duskMode.removeAttribute("checked")
    }
});

// #region auto generate lines around the blue extrusion
function autoGenerateLine(poly) {
    let buffered, simplified, smoother, featureColl;
    buffered = turf.buffer(poly, 0.006, { units: "kilometers" })
    simplified = turf.simplify(buffered, { tolerance: 0.00001, highQuality: true });
    smoother = turf.polygonSmooth(simplified, { iterations: 3 })
    // console.log(poly)
    const featureCollection = {
        'type': 'FeatureCollection',
        'features': []
    };
    let elevMin, elevMax;
    let calculatedStepHeight = userExtrusionHeight / userStepCount;
    for (let index = 0; index < userStepCount; index++) {
        if (smoother.features.length > 0) {
            const feat = { // feat for Line layer
                "type": "Feature",
                "properties": {
                    "id": 'feat-line-id-' + index,
                    "level": 'level-index-' + index,
                    "elevMin": elevMin,
                    "elevMax": elevMax,
                    "elevation": [
                        index * calculatedStepHeight,
                        (index * calculatedStepHeight) + calculatedStepHeight,
                    ]
                },
                "geometry": {
                    "coordinates": [],
                    "type": "LineString"
                }
            };
            let c = smoother.features[0].geometry.coordinates;
            console.log(c)
            if (index % 2 === 0) { // Check if the index is even
                feat.geometry.coordinates.push(
                    ...c.reverse().flatMap(d => d)
                )
            } else {
                feat.geometry.coordinates.push(
                    ...c.flatMap(d => d)
                )

            }
            console.log(index)
            console.log(feat)
            featureCollection.features.push(feat);


        } else {
            console.log('generate lines: no feats in geojson smoother polygon')
        }

    }
    // console.log(featureCollection)
    return featureCollection;
}
// #endregion
// #region mapbox-gl-DRAW controls
const draw = new MapboxDraw({
    displayControlsDefault: true,
    // defaultMode: 'draw_polygon'
});
map.addControl(draw);
map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);
// #endregion
// #region helper functions: round
function roundByN(floatNum, numDecimals) {
    const tenExp = 10 ^ numDecimals;
    const res = Math.round(floatNum * tenExp) / tenExp;
    // console.log(`${res}: ${floatNum} rnd by ${numDecimals}`)
    return res;
}
// #endregion
// #region ** updateArea()-*** -blue extrusion - main function
function updateArea(e) {
    const polygon = draw.getAll();
    const answer = document.getElementById('calculated-area');
    map.getSource('user-poly-src').setData(polygon)
    map.getSource('line-src').setData(autoGenerateLine(polygon))

    if (polygon.features.length > 0) {
        const area = turf.area(polygon);
        const length = turf.length(polygon, { units: "meters" });
        answer.innerHTML = `${roundByN(length, 2)} mt <br>${roundByN(area, 2)} sq-mt`;

        map.getSource('user-poly-src').setData(polygon)
        map.getSource('line-src').setData(autoGenerateLine(polygon))

    } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete')
            alert('Click the map to draw a polygon.');
    }
}
// #endregion
// #region map camera control events: map[handl3r]-dis4ble() 
const handlers = [
    "scrollZoom",
    "boxZoom",
    "dragRotate",
    "dragPan",
    "keyboard",
    "doubleClickZoom", // can not be disabled per draw controls
    "touchZoomRotate",
];
// #endregion
// #region disable-enable each map camera control
let $camControls = document.querySelector("#navCamControls");
$camControls
    .addEventListener("change", (e) => {
        const handler = e.target.id;
        // console.log('handler')
        // console.log(handler)
        // console.log(e.target.checked)
        if (e.target.checked) {
            map[handler].enable();
        } else {
            map[handler].disable();
        }
    });
// #endregion
// #region cam-controls-checkbox disable-enable ALL
let $disableCamControls = document.querySelector("#disableCamControls");
let isDisabledAll = false;
$disableCamControls.removeAttribute('checked');
$disableCamControls
    .addEventListener("change", (e) => {
        // console.log(`e.target.checked ${e.target.checked}`)
        document.querySelectorAll(".camCheckBox").forEach(h => {
            // console.log(`h: ${h.id}`)
            if (h.id != "") {
                if (e.target.checked) {
                    map[h.id].disable()
                    document.getElementById(h.id).removeAttribute("checked")
                    isDisabledAll = true
                } else {
                    document.getElementById(h.id).setAttribute("checked", "checked")
                    map[h.id].enable()
                    isDisabledAll = false
                }
            }
        });
    });
// #endregion
// #region cam-control-checkboxes disable/enable EACH
let $showCam = document.querySelector("#showCamControls");
$showCam.setAttribute('checked', 'checked');
$showCam
    .addEventListener("change", (e) => {
        // console.log(`ShowCamControls: ${e.target.checked}`)
        if (!e.target.checked) {
            $camControls.classList.toggle("animate__slideInDown");
            $camControls.style.display = "none"; // removes layout
            // console.log('camControls display: NONE')

        } else {
            $camControls.classList.toggle("animate__slideInDown");
            $camControls.style.display = "block";
            // console.log('camControls display: BLOCK')
        }
    });
// #endregion
// #region info box with 'lng and lat' vs 'x and y'
let $info = document.getElementById('info');
map.on('mousemove', (e) => {
    $info.setAttribute('positionX', e.point.x)
    $info.setAttribute('positionY', e.point.y)
    $info.setAttribute('lng', e.lngLat.lng)
    $info.setAttribute('lat', e.lngLat.lat)
    // TODO lets make this a table with rounded numbers so it wouldn't take so much space
    // console.log(e.lngLat.lng + " " + e.lngLat.lat)
    $info.innerHTML = `${JSON.stringify(e.point)}<br/> ${JSON.stringify(e.lngLat.wrap())}`;
});
// #endregion
// #region MODEL TRANSFORMATION: from documentation
// parameters to ensure the model is georeferenced correctly on the map
const modelOrigin = [-104.98887493053121, 39.73899257929499]; // Denver Civic Center
const modelAltitude = 10;
const modelRotate = [Math.PI / 2, 0, 0];
const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
);
// transformation parameters to position, rotate and scale the 3D model onto the map
const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    /* Since the 3D model is in real world meters, a scale transform needs to be
     * applied since the CustomLayerInterface expects units in MercatorCoordinates.
     */
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
};
// #endregion
// #region Custom layer for 3D model: from documentation
const THREE = window.THREE;
const customLayer = {
    id: 'threeJS',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        // create two three.js lights to illuminate the model
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);
        const directionalLight3 = new THREE.DirectionalLight(0xffffff);
        directionalLight3.position.set(10, 50, 0).normalize();
        this.scene.add(directionalLight3);

        // use the three.js GLTF loader to add the 3D model to the three.js scene
        // const modelGroup = new THREE.Group();
        const loader = new THREE.GLTFLoader();
        loader.load(
            'uav/scene.gltf',
            (gltf) => {
                this.scene.add(gltf.scene);
                // console.log(`this.id: ${this.id}`)
            }
        );
        this.map = map;

        // use the Mapbox GL JS map canvas for three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });

        this.renderer.autoClear = false;
    },

    // #region RENDER
    render: function (gl, matrix) {
        const rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX
        );
        const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY
        );
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ
        );

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
            .makeTranslation(
                modelTransform.translateX,
                modelTransform.translateY,
                modelTransform.translateZ
            )
            .scale(
                new THREE.Vector3(
                    modelTransform.scale,
                    -modelTransform.scale,
                    modelTransform.scale
                )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);
        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.resetState();
        this.scene.rotation.z += (Math.random() - 0.5) * 0.005
        this.scene.position.y += (Math.random() - 0.5) * 0.2
        this.renderer.render(this.scene, this.camera);
        gl.flush()
        this.map.triggerRepaint();
        // console.log(this)
    }
    // #endregion

};
// #endregion
// #region blank geoJSON data to load when there is no polygon
const polyData = {
    "type": "FeatureCollection",
    "features": []
};
// #endregion
const lineData = {
    type: "Feature",
    properties: {
        elevation: [],
    },
    geometry: {
        coordinates: [],
        type: "LineString",
    },
};
map.on('style.load', () => {
    map.addLayer(customLayer);
    map.addSource("line-src", {
        type: "geojson",
        lineMetrics: true,
        data: lineData,
    });
    map.addSource('user-poly-src', {
        'type': 'geojson',
        'data': polyData,
    });
    map.addLayer({
        'id': 'user-extrude-layer',
        'type': 'fill-extrusion',
        'source': 'user-poly-src',
        'paint': {
            'fill-extrusion-color': 'blue',
            'fill-extrusion-height': 15,
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.3
        }
    });

    const paintLine = {
        "line-emissive-strength": 1.0,
        "line-blur": 2,
        "line-width": 5,
        "line-color": "green",
        "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0.0,
            "cyan",
            0.5,
            "lime",
            0.7,
            "yellow",
            1,
            "cyan",
        ],
        // 'line-trim-color':'red',
        // 'line-trim-offset' : [0.00, 0.002],
        // 'line-gap-width': 1,
    };
    let layoutLine = {
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

    layoutLine['line-cross-slope'] = 0
    map.addLayer({
        id: "elevated-line-horizontal",
        type: "line",
        source: "line-src",
        layout:
            layoutLine,
        paint: paintLine,
    });

    layoutLine['line-cross-slope'] = 1
    map.addLayer({
        id: "elevated-line-vertical",
        type: "line",
        source: "line-src",
        layout: layoutLine,
        paint: paintLine,
    });
});
