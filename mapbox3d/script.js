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
    controls: {
        polygon: true,
        trash: true
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    defaultMode: 'draw_polygon'
});
map.addControl(draw);

map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

function updateArea(e) {
    const data = draw.getAll();
    const answer = document.getElementById('calculated-area');
    if (data.features.length > 0) {
        const area = turf.area(data);
        const length = turf.length(data, { units: "meters" });
        // Restrict the area to 2 decimal points.
        const roundedArea = Math.round(area * 100) / 100;
        const roundedLength = Math.round(length * 100) / 100;
        // turf.length(line, { units: "miles" });
        answer.innerHTML = `
          <strong>
            ${roundedLength} meters <br>
            ${roundedArea} sq-meters  
          </strong>
        `;
    } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete')
            alert('Click the map to draw a polygon.');
    }
}
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
map["doubleClickZoom"].disable() // let's use double'click for 

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
            console.log(`h: ${h.id}`)
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


// #region CHECKBOX- SHOW/HIDE CAM CONTROLS
let $showCam = document.querySelector("#showCamControls");
$showCam
    .addEventListener("change", (e) => {
        console.log(`ShowCamControls: ${e.target.checked}`)
        if (!e.target.checked) {
            $camControls.classList.toggle("hidden");
            // $camControls.style.display = "none"; // removes layout
            // $camControls.style.visibility = "hidden"; // keeps layout
            console.log('camControls display: NONE')
        } else {
            $camControls.classList.toggle("hidden");
            $camControls.style.display = "block";
            // $camControls.style.visibility = "visible";
            console.log('camControls display: BLOCK')
        }
    });
// #endregion
let $info = document.getElementById('info');
// #region SHOW COORDINATES OF MOUSE
map.on('mousemove', (e) => {
    $info.setAttribute('positionX', e.point.x)
    $info.setAttribute('positionY', e.point.y)
    $info.setAttribute('lng', e.lngLat.lng)
    $info.setAttribute('lat', e.lngLat.lat)

    // console.log(e.lngLat.lng + " " + e.lngLat.lat)
    $info.innerHTML = `${JSON.stringify(e.point)}<br />${JSON.stringify(e.lngLat.wrap())}`;
});
// #endregion


// parameters to ensure the model is georeferenced correctly on the map
const modelOrigin =
    // [-104.98863682037847, 39.74349648343346]  // rep plaza
    [-104.98887493053121, 39.73899257929499]  // Sheraton Denver
    ;
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

const THREE = window.THREE;

// configuration of the custom layer for a 3D model per the CustomLayerInterface
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

        function merCoords(ln, lt) {
            let tempJSON = {
                lng: ln,
                lat: lt
            };
            console.log('tempJSON')
            console.log(tempJSON)
            let res = mapboxgl.MercatorCoordinate.fromLngLat(tempJSON);
            console.log('res merc')
            console.log(res)
            return res;
        }
        let posX, posY;
        let lngPoint, latPoint, coordsPoint;
        // #region DOUBLE CLICK EVENT ON THE MAP
        document.addEventListener('dblclick', e => {
            const rect = map.getCanvas().getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const lngLat = map.unproject([x, y]);
            const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(lngLat);

            this.scene.position.set(mercatorCoordinate.x, mercatorCoordinate.y, this.scene.position.z);
            console.log('New scene position:', this.scene.position);
        }, false);        




        // document.addEventListener('dblclick', e => {
        //     posX = $info.getAttribute("positionX")
        //     posY = $info.getAttribute("positionY")
        //     lngPoint = $info.getAttribute("lng")
        //     latPoint = $info.getAttribute("lat")
        //     coordsPoint = merCoords(lngPoint, latPoint)
        //     // console.log(coordsPoint)

        // }, false);

        // #endregion


        // document.addEventListener('dblclick', e => {
        //     const lngLat = map.unproject([e.clientX, e.clientY]);
        //     const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(lngLat);
        //     console.log(mercatorCoordinate)
        //     this.scene.position.set(mercatorCoordinate.x, mercatorCoordinate.y, this.scene.position.z);
        //     this.scene.position.set(10,0,0)
        //     console.log('New scene position:', JSON.stringify(this.scene.position));
        // }, false);



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

map.on('style.load', () => {
    map.addLayer(customLayer);
});
