mapboxgl.accessToken = 'pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw';
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/standard',
    zoom: 18.75,
    // center: [-104.985302, 39.740326], // St Services Bldg
    // center: [-104.98863682037847, 39.74349648343346], // rep plaza
    center: [-104.98887493053121, 39.73899257929499], // civic
    pitch: 65,
    antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
});
const draw = new MapboxDraw({
    displayControlsDefault: true,
    // Select which mapbox-gl-draw control buttons to add to the map.
    // controls: {
    //     polygon: true,
    //     trash: true
    // },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    // defaultMode: 'draw_polygon'
});
map.addControl(draw);
map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

function autoGenerateLine(poly) {
    let buffered, simplified, smoother, featureColl;
    buffered = turf.buffer(poly, 0.006, { units: "kilometers" })
    simplified = turf.simplify(buffered, { tolerance: 0.00001, highQuality: true });
    smoother = turf.polygonSmooth(simplified, { iterations: 3 })
    // console.log(poly)
    let coords = [];
    let result = [];
    for (let index = 0; index < 5; index++) {
        coords.push(smoother.features[0].geometry.coordinates.flatMap(d => d) )
    }
    console.log(coords.flatMap(d => d))
    result = coords.flatMap(d => d)
    console.log(result)
    let JSON = {
        "type": "Feature",
        "properties": {
            "elevation": [1, 15]
        },
        "geometry": {
            "coordinates": result,
            "type": "LineString"
        }
    }
;
    return JSON;
}


// #region AUTO-GENERATING -  GREEN EXTRUSION
function autoGenerate(poly) {
    let buffered, simplified, smoother, featureColl;
    buffered = turf.buffer(poly, 0.006, { units: "kilometers" })
    simplified = turf.simplify(buffered, { tolerance: 0.00001, highQuality: true });
    smoother = turf.polygonSmooth(simplified, { iterations: 3 })
    let feats = [];
    let temp ;
    const colors = [
        'green',
        'cyan',
        'pink',
        'purple',
        'yellow',
    ];

    for (let index = 0; index < 5; index++) {
        temp = {};
        temp = JSON.parse(JSON.stringify(smoother)); // Create a deep copy of smoother
        temp.features[0].properties['base'] =index*2;
        temp.features[0].properties['height'] = (index *2) + 0.5;
        temp.features[0].properties['color'] = colors[index];
        // temp.features[0].properties['opacity'] = index*0.2;
        temp.features[0]['id'] = 'green' + index
        feats.push(temp.features[0]);
    };
    // console.log(feats)
    featureColl = {
        "features": feats,
        "type": "FeatureCollection"
    };
    // console.log(featureColl)
    return featureColl;
    // console.log('smoother')
    // console.log(smoother)
    // return smoother;
}
// #endregion

// #region USER-UPDATE-AREA -BLUE EXTRUSION
function updateArea(e) {
    const polygon = draw.getAll();
    const answer = document.getElementById('calculated-area');
    map.getSource('user-drawn-polygon').setData(polygon)
    // map.getSource('auto-generated-polygon').setData(autoGenerate(polygon))
    map.getSource('auto-generated-line').setData(autoGenerateLine(polygon))

    if (polygon.features.length > 0) {
        const area = turf.area(polygon);
        const length = turf.length(polygon, { units: "meters" });
        // Restrict the area to 2 decimal points.
        const roundedArea = Math.round(area * 100) / 100;
        const roundedLength = Math.round(length * 100) / 100;
        answer.innerHTML = `
          <strong>
            ${roundedLength} meters <br>
            ${roundedArea} sq-meters  /
          </strong>
        `;

        map.getSource('user-drawn-polygon').setData(polygon)
        // map.getSource('auto-generated-polygon').setData(autoGenerate(polygon))
        map.getSource('auto-generated-line').setData(autoGenerateLine(polygon))

    } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete')
            alert('Click the map to draw a polygon.');
    }
}
// #endregion

// #region EVENT HANDL3RS in Chkboxes
const handlers = [
    "scrollZoom",
    "boxZoom",
    "dragRotate",
    "dragPan",
    "keyboard",
    "doubleClickZoom",
    "touchZoomRotate",
];

// #region CAM-CONTROLS disable-enable EACH
let $camControls = document.querySelector("#navCamControls");
$camControls
    .addEventListener("change", (e) => {
        const handler = e.target.id;
        console.log(handler)
        console.log(e.target.checked)
        if (e.target.checked) {
            map[handler].enable();
        } else {
            map[handler].disable();
        }
    });
// #endregion

// #region CAM-CONTROLS disable-enable ALL
let $disableCamControls = document.querySelector("#disableCamControls");
let isDisabled = false;
$disableCamControls
    .addEventListener("change", (e) => {
        console.log(`e.target.checked ${e.target.checked}`)
        document.querySelectorAll(".camCheckBox").forEach(h => {
            console.log(`h: ${h.id}`)
            if (h.id != "") {
                if (e.target.checked) {
                    map[h.id].disable()
                    document.getElementById(h.id).removeAttribute("checked")
                    isDisabled = true
                } else {
                    document.getElementById(h.id).setAttribute("checked", "checked")
                    map[h.id].enable()
                    isDisabled = false
                }
            }
        });
    });
// #endregion
// #region CHECKBOX- SHOW/HIDE CAM CONTROLS
let $showCam = document.querySelector("#showCamControls");
$showCam
    .addEventListener("change", (e) => {
        console.log(`ShowCamControls: ${e.target.checked}`)
        if (!e.target.checked) {
            $camControls.classList.toggle("animate__slideInDown");
            $camControls.style.display = "none"; // removes layout
            console.log('camControls display: NONE')

        } else {
            $camControls.classList.toggle("animate__slideInDown");
            $camControls.style.display = "block";
            console.log('camControls display: BLOCK')
        }
    });
// #endregion
// #region SHOW COORDINATES OF MOUSE
let $info = document.getElementById('info');
map.on('mousemove', (e) => {
    $info.setAttribute('positionX', e.point.x)
    $info.setAttribute('positionY', e.point.y)
    $info.setAttribute('lng', e.lngLat.lng)
    $info.setAttribute('lat', e.lngLat.lat)

    // console.log(e.lngLat.lng + " " + e.lngLat.lat)
    $info.innerHTML = `${JSON.stringify(e.point)}<br />${JSON.stringify(e.lngLat.wrap())}`;
});
// #endregion
// #region MODEL TRANSFORMATION
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
// #region  configuration of the custom layer for a 3D model per the CustomLayerInterface
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

        // #region DOUBLE CLICK EVENT = not used
        let posX, posY;
        let lngPoint, latPoint, coordsPoint;
        function merCoords(ln, lt) {
            let tempJSON = {
                lng: ln,
                lat: lt
            };
            console.log('merCoords: tempJSON')
            console.log(tempJSON)
            let res = mapboxgl.MercatorCoordinate.fromLngLat(tempJSON);
            console.log('merCoords: res merc')
            console.log(res)
            return res;
        }
        function dblClkHandlerMoveScene(e) {
            const rect = map.getCanvas().getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const lngLat = map.unproject([x, y]);
            const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(lngLat);

            console.log('New scene position1:', this.scene.position);
            this.scene.position.set(mercatorCoordinate.x, mercatorCoordinate.y, this.scene.position.z);
            console.log('New scene position2:', this.scene.position);
            //     posX = $info.getAttribute("positionX")
            //     posY = $info.getAttribute("positionY")
            //     lngPoint = $info.getAttribute("lng")
            //     latPoint = $info.getAttribute("lat")
            //     coordsPoint = merCoords(lngPoint, latPoint)
            //     const lngLat = map.unproject([e.clientX, e.clientY]);
            //     const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(lngLat);
            //     this.scene.position.set(mercatorCoordinate.x, mercatorCoordinate.y, this.scene.position.z);
            //     this.scene.position.set(10,0,0)
        };





        // #endregion

        this.renderer.autoClear = false;
    },
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
};
// #endregion

// #region blank JSON to load when there is no polygon
let blankJSON = {
    "type": "FeatureCollection",
    "features": []
};

// #endregion
map.on('style.load', () => {
    map.addSource('auto-generated-polygon', {
        'type': 'geojson',
        'data': blankJSON,
    });
    map.addSource('user-drawn-polygon', {
        'type': 'geojson',
        'data': blankJSON,
    });
    map.addSource("auto-generated-line", {
        type: "geojson",
        lineMetrics: true,
        data: {
            type: "Feature",
            properties: {
                elevation: [1, 15],
            },
            geometry: {
                coordinates: [],
                type: "LineString",
            },
        },
    });
    map.addLayer(customLayer);

    // map.addLayer({
    //     'id': 'generated-layer',
    //     'type': 'fill-extrusion',
    //     'source': 'auto-generated-polygon',
    //     'paint': {
    //         'fill-extrusion-color': ['get', 'color'],
    //         'fill-extrusion-height': ['get', 'height'],
    //         'fill-extrusion-base':   ['get', 'base'],
    //         'fill-extrusion-opacity': 0.1
    //     }
    // });
    map.addLayer({
        'id': 'user-extrude-layer',
        'type': 'fill-extrusion',
        'source': 'user-drawn-polygon',
        'paint': {
            'fill-extrusion-color': 'blue',
            'fill-extrusion-height': 15,
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.3
        }
    });
    map.addLayer({
        id: "elevated-line",
        type: "line",
        source: "auto-generated-line",
        layout: {
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
            "line-join": "round",
        },
        paint: {
            "line-emissive-strength": 2.0,
            "line-width": 4,
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
                "pink",
            ],
            // 'line-trim-offset' : [0.2, 0.8],
            'line-gap-width' :3,
        },
    });
});
