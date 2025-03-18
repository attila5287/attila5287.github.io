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
// map.on('style.load', updateArea);

// #region UPDATE-AREA -main function-
function updateArea(e) {
    const data = draw.getAll();
    const answer = document.getElementById('calculated-area');
    if (data.features.length > 0) {
        const area = turf.area(data);
        const length = turf.length(data, { units: "meters" });
        // Restrict the area to 2 decimal points.
        const roundedArea = Math.round(area * 100) / 100;
        const roundedLength = Math.round(length * 100) / 100;
        answer.innerHTML = `
          <strong>
            ${roundedLength} meters <br>
            ${roundedArea} sq-meters  /
          </strong>
        `;
        console.log(data)
        console.log(data.features[0].geometry.coordinates)
        map.getSource('base-polygon').setData(data)
    } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete')
            alert('Click the map to draw a polygon.');
    }
}
// #endregion
// #region EVENT HANDLERS in Chkboxes
const handlers = [
    "scrollZoom",
    "boxZoom",
    "dragRotate",
    "dragPan",
    "keyboard",
    "doubleClickZoom",
    "touchZoomRotate",
];

// #region CAM-CONTROLS
let $camControls = document.querySelector("#listing-group");
$camControls
    .addEventListener("change", (e) => {
        const handler = e.target.id;
        if (e.target.checked) {
            map[handler].enable();
        } else {
            map[handler].disable();
        }
    });
// #endregion
let $disableCamControls = document.querySelector("#disableCamControls");
let isDisabled = false;
let tempElement;
$disableCamControls
    .addEventListener("change", (e) => {
        console.log(`e.target.checked ${e.target.checked}`)
        document.querySelectorAll(".camCheckBox").forEach(h => {
            // console.log(`h: ${h.id}`)
            tempElement = document.getElementById(h.id)
            if (e.target.checked) {
                map[h.id].disable()
                document.getElementById(h.id).removeAttribute("checked")
                isDisabled = true
            } else {
                document.getElementById(h.id).setAttribute("checked", "checked")
                map[h.id].enable()
                isDisabled = false
            }
        });
    });
// #endregion
// #region CHECKBOX- SHOW/HIDE CAM CONTROLS
let $showCam = document.querySelector("#showCamControls");
$showCam
    .addEventListener("change", (e) => {
        // console.log(`ShowCamControls: ${e.target.checked}`)
        if (!e.target.checked) {
            $camControls.classList.toggle("hidden");
            $camControls.classList.toggle("animate__slideInDown");
            // $camControls.style.display = "none"; // removes layout
            // $camControls.style.visibility = "hidden"; // keeps layout
            console.log('camControls display: NONE')
            
        } else {
            $camControls.classList.toggle("hidden");
            $camControls.classList.toggle("animate__slideInDown");
            $camControls.style.display = "block";
            // $camControls.style.visibility = "visible";
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
        // const directionalLight3 = new THREE.DirectionalLight(0xffffff);
        // directionalLight3.position.set(10, 50, 0).normalize();
        // this.scene.add(directionalLight3);

        // use the three.js GLTF loader to add the 3D model to the three.js scene
        const modelGroup = new THREE.Group();
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

        // #region DOUBLE CLICK EVENT ON THE MAP
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
        };        

        // document.addEventListener('dblclick', e => {
        //     posX = $info.getAttribute("positionX")
        //     posY = $info.getAttribute("positionY")
        //     lngPoint = $info.getAttribute("lng")
        //     latPoint = $info.getAttribute("lat")
        //     coordsPoint = merCoords(lngPoint, latPoint)
        //     // console.log(coordsPoint)

        // }, false);



        // document.addEventListener('dblclick', e => {
        //     const lngLat = map.unproject([e.clientX, e.clientY]);
        //     const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(lngLat);
        //     console.log(mercatorCoordinate)
        //     this.scene.position.set(mercatorCoordinate.x, mercatorCoordinate.y, this.scene.position.z);
        //     this.scene.position.set(10,0,0)
        //     console.log('New scene position:', JSON.stringify(this.scene.position));
        // }, false);

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

let blankJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "id": "tO49V48UD09ynJcFJyH20aXWtaFqJ5Km",
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [[]],
                "type": "Polygon"
            }
        }
    ]
};
map.on('style.load', () => {
    map.addLayer(customLayer);

    map.addSource('base-polygon', {
        'type': 'geojson',
        'data': blankJSON,
    });

    map.addLayer({
        'id': 'extrude-layer',
        'type': 'fill-extrusion',
        'source': 'base-polygon',
        'paint': {
            // Get the `fill-extrusion-color` from the source `color` property.
            'fill-extrusion-color': 'blue',

            // Get `fill-extrusion-height` from the source `height` property.
            'fill-extrusion-height': 10,

            // Get `fill-extrusion-base` from the source `base_height` property.
            'fill-extrusion-base': 0,

            // Make extrusions slightly opaque to see through indoor walls.
            'fill-extrusion-opacity': 0.5
        }
    });
});
