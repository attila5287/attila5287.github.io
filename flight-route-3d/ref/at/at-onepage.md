```js
import { geometricRoute } from "./geometricRoute.js";
import { testpoly } from "./testdata.js";
const $duskMode = document.querySelector("#duskModeCkbox");
const $camControls = document.querySelector("#navCamControls");
const $disableCamControls = document.querySelector("#disableCamControls");
const $info = document.querySelector("#info");
const $area = document.querySelector("#calculated-area");
const $distance = document.querySelector("#calculated-distance");
const $switchSatellite = document.querySelector("#enableSatellite");
const $showPanelGeo = document.querySelector("#show-panel-geo");
const $geoButtons = document.querySelectorAll( ".geo-btn" );
const $camCheckBoxes = document.querySelectorAll(".camCheckBox");
const $showPanelCam = document.querySelector("#show-panel-cam");
const $geoInputs = document.querySelectorAll( ".geo-input-el" );
const $showPanelCoords = document.querySelector("#show-panel-coords");
const $buttonCoords = document.querySelector("#map-coords-button");
const $instructionsText = document.querySelector("#instructions-text");
const $instructionsIcon = document.querySelector("#instructions-icon");
const $messageText = document.querySelector("#message-text");
const $messageBox = document.querySelector("#message-box");
const $messageButton = document.querySelector(".message-button");
const $navIcons = document.querySelectorAll(".nav-icon");


const positionMap = {
  lng: "-104.9889",
  lat: "39.7394"
}; // denver civics 
// console.log(positionMap)
setTimeMessagebox();
$messageButton.addEventListener( 'click', ( e ) => {
  console.log("$messageButton clicked");
  $messageBox.classList.remove("d-none");
  setTimeMessagebox();
});
function setTimeMessagebox() {
  let currentIndex = 0;
  let secondsLeft = 2;
  const intros = [];
  // Populate the intros array with data-intro values
  $navIcons.forEach((el) => intros.push(el.dataset.intro));

  let lapCount = 0;

  const timerInterval = setInterval(function () {
    // Decrement the countdown timer
    if (secondsLeft === 0) {
      // Remove 'text-info' and animation classes from all elements
      $navIcons.forEach((el) => {
        el.classList.remove("text-info");
        el.classList.remove("animate__animated");
        el.classList.remove("animate__tada");
      });

      // Move to the next item
      currentIndex++;

      // If the currentIndex exceeds the array length, reset it
      if (currentIndex >= intros.length) {
        lapCount++;
        if (lapCount === 1) {
          console.log( "clearing interval at lap count: " + lapCount );
          $messageText.textContent = '';
          $messageBox.classList.remove( 'animate__delay-3s' );
          $messageBox.classList.add( 'd-none' );
          
          clearInterval( timerInterval );

          return; // Exit the function to avoid further execution
        }
        currentIndex = 0; // Restart from the first element
      }

      // Add 'text-info' and animation classes to the current element
      $navIcons[currentIndex].classList.add("text-info");
      $navIcons[currentIndex].classList.add("animate__animated");
      $navIcons[currentIndex].classList.add("animate__tada");

      // Update the message text
      $messageText.textContent = intros[currentIndex];

      console.log($navIcons[currentIndex].dataset.intro);

      // Reset the countdown timer for the next item
      secondsLeft = 2;
    } else {
      secondsLeft--;
    }
  }, 1000);

  // Initialize the first text and highlight the first element
  $navIcons.forEach((el) => el.classList.remove("text-info")); // Ensure no element is highlighted initially
  $navIcons[currentIndex].classList.add("text-info");
  $messageText.textContent = intros[currentIndex];
}
function setTimeInstructions() {
  const $seconds = document.getElementById("seconds");
  const $secondsIcon = document.getElementById("secondsIcon");

  const instructionsIcons = [
    `<i class="fas fa-fw fa-vector-square"></i>`,
    `<i class="fas fa-fw fa-trash-alt"></i>`,
    `<i class="far fa-fw fa-object-ungroup"></i>`,
    `<i class="fas fa-fw fa-draw-polygon"></i>`,
  ];
  const instructionsText = [
    "*Start by clicking the polygon icon*",
    "Select base(s) to move,del,(un)combine",
    "Combine bases only if overlapping",
    "Dbl clk to edit user-drawn base",
  ];
  let currentIndex = 0;
  let secondsLeft = 3;

  const timerInterval = setInterval(function () {
    const secondsIcons = [
      `<i class="opac-75 fas fa-fw fa-grip-vertical fa-rotate-90"></i>`,
      `<i class="opac-50 fas fa-fw fa-ellipsis-v"></i>`,
      `<i class="opac-25 fas fa-fw fa-ellipsis-v fa-rotate-90"></i>`,
      `<i class="fas fa-fw fa-grip-vertical"></i>`,
    ];
    // console.log("secondsLeft :>> ", secondsLeft);
    $seconds.textContent = secondsLeft;
    $secondsIcon.innerHTML = "";
    $secondsIcon.innerHTML = secondsIcons[3 - secondsLeft];

    if (secondsLeft === 0) {
      // console.log("next item");
      currentIndex++;

      if (currentIndex >= instructionsText.length) {
        currentIndex = 0; // Restart from the first element
      }

      $instructionsText.textContent = instructionsText[currentIndex];
      $instructionsIcon.innerHTML = "";
      $instructionsIcon.innerHTML = instructionsIcons[currentIndex];
      secondsLeft = 3; // Reset the countdown for the next item
    } else {
      secondsLeft--;
    }
  }, 1000);

  // Initialize the first text
  $instructionsText.textContent = instructionsText[currentIndex];
  $instructionsIcon.innerHTML = "";
  console.log(instructionsIcons[currentIndex]);
  $instructionsIcon.innerHTML = instructionsIcons[currentIndex];
}
setTimeInstructions();

function fetchCoordsInput() {
  return [
    +document.querySelector("#map-coords-lng").value,
     +document.querySelector("#map-coords-lat").value,
  ]
}
$buttonCoords.addEventListener( "click", ( e ) => {
  e.preventDefault();
  console.log("map-coords-button clicked")
  console.log(fetchCoordsInput());
  map.flyTo( {
    zoom: 19,
    center: fetchCoordsInput(),
    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
  } );
  if ( e.target.dataset.selected === "primary" ) {
    e.target.dataset.selected = "alt";
    document.querySelector("#map-coords-lng").value =
      document.querySelector("#map-coords-lng").dataset.alt;
    document.querySelector("#map-coords-lat").value =
      document.querySelector( "#map-coords-lat" ).dataset.alt;
    document.querySelector( ".map-coords-button-icon" ).innerHTML = '';
    document.querySelector(".map-coords-button-icon").innerHTML = `<i class="fas fa-fw fa-undo"</i>`;
    
  } else {
    e.target.dataset.selected = "primary";
    document.querySelector("#map-coords-lng").value =
    document.querySelector("#map-coords-lng").dataset.primary;
    document.querySelector("#map-coords-lat").value =
    document.querySelector("#map-coords-lat").dataset.primary;
    document.querySelector(".map-coords-button-icon").innerHTML = `<i class="fas fa-fw fa-plane-departure"</i>`;
    
  }
  

})
  
const userBaseHeight  = document.querySelector("#user-base-height");
const userTopHeight  = document.querySelector("#user-top-height");
const userStepCount  = document.querySelector("#user-step-count");
const userToleranceW  = document.querySelector("#user-tolerance-w");

// ----------------
const fetchUserInput= () => {
  return {
  inBaseHi:        userBaseHeight.value * 1,
  inTopHi:         userTopHeight.value  * 1,
  inStepCount:     userStepCount.value  * 1,
  inToleranceWidth:userToleranceW.value * 1,
}};


function renderRouteDistance(poly, elementId) {
  function geoRouteDistance( poly ) {
    return geometricRoute(poly, fetchUserInput())
    .features.map((d) => d.properties.LOOPLENGTH + d.properties.STEPHEIGHT)
    .reduce( ( accumulator, currentValue ) => accumulator + currentValue, 0 )
  }
  let routeDistance = geoRouteDistance(poly);
  console.log("routeLen " + routeDistance);
  const $el = document.getElementById( elementId )
  $el.innerText = "";
  $el.innerText = "" + roundByN(routeDistance, 0);
}
function renderLoopLength(poly, elementID) {
  function geoLoopLength(poly) {
  return geometricRoute(poly, fetchUserInput())
      .features.map((d) => d.properties.LOOPLENGTH)
      .reduce((accumulator, currentValue) => currentValue, 0);
  }
  const loopLength = geoLoopLength(poly);
  const $el = document.getElementById(elementID);
  $el.innerText = "";
  $el.innerText = "" + roundByN(loopLength, 0) + " m";
  
}

renderLoopLength( testpoly, "calc-loop-length" );
renderRouteDistance( testpoly, "calc-route-dist" );

function handlerSatellite( e ) {
  console.log( e.target.id + " " + e.target.checked );
  if ( e.target.checked ) {
    map.setStyle( "mapbox://styles/mapbox/standard-satellite" );
    map.setConfigProperty("basemap", "lightPreset", "dusk");
    console.log(map.getLight());
  } else {
    map.setStyle("mapbox://styles/mapbox/standard");
  }
}
$switchSatellite
  .addEventListener("change", handlerSatellite);

function handlerGeoBtn( e ) {
  const deltaMapping = {
    plus: +1,
    minus: -1,
  }
  console.log( e.target.dataset.target )
  console.log( e.target.dataset.delta )
  let temp = document.getElementById( e.target.dataset.target );
  if (temp.value > temp.min) {
    console.log(temp.min);
    temp.value = +temp.value + deltaMapping[e.target.dataset.delta];
    handlerGeo()
  } else if ( temp.value === temp.min ) {
    console.log(temp.min);
    if (e.target.dataset.delta==='plus') {
      temp.value = +temp.value + deltaMapping[e.target.dataset.delta];
    } else {
      console.log('MIN LIMIT REACHED')
    }
    handlerGeo();
  } else {
    console.log("MIN LIMIT REACHED");
  }

}
  
$geoButtons.forEach((button) =>
  button.addEventListener("click", handlerGeoBtn)
);
  
const handlerGeo = () => {
  if (map.getLayer("user-extrude-layer")) {
    map.setPaintProperty(
      "user-extrude-layer",
      "fill-extrusion-base",
      + fetchUserInput().inBaseHi 
    );
    map.setPaintProperty(
      "user-extrude-layer",
      "fill-extrusion-height",
      +fetchUserInput().inTopHi
    );
  }
  if (draw.getAll().features.length) {
    renderRouteDistance(draw.getAll(), "calc-route-dist");
    map
      .getSource("line-src")
      .setData( geometricRoute( draw.getAll(), fetchUserInput() ) );
    map.triggerRepaint()
    renderLoopLength(draw.getAll(), "calc-loop-length");
    
  } else { // TEST RUN WITH NO DRAW DATA 
    map
      .getSource("line-src")
      .setData( geometricRoute(testpoly, fetchUserInput() ) );
    map.triggerRepaint()
    renderRouteDistance(testpoly, "calc-route-dist")
    renderLoopLength(testpoly, "calc-loop-length")
  }
};

$geoInputs.forEach((inputEl) =>
    inputEl.addEventListener( "change", handlerGeo )
);

function handlerShowPanelGeo(e) {
  // e.target is the SWITCH element
  console.log("clk target:>> " + e.target.dataset.target);
  console.log("clk on>> " + e.target.id + " chk stat>> " + e.target.checked);

  const isChecked = e.target.checked;
  // el is the DATA-TARGET ELEMENT that needs to be
  const el = document.getElementById(e.target.dataset.target);
  if (!isChecked) {
    el.classList.remove("animate__slideInLeft");
    el.classList.add("animate__fadeOutLeftBig");
  } else {
    el.classList.remove("animate__fadeOutLeftBig");
    el.classList.add("animate__slideInLeft");
  }
}

$showPanelGeo.addEventListener("change", handlerShowPanelGeo);


$showPanelCoords.addEventListener( "change", handlerShowPanelCoords );
function handlerShowPanelCoords(e) {
  // e.target is the SWITCH element
  console.log("clk target:>> " + e.target.dataset.target);
  console.log("clk on>> " + e.target.id + " chk stat>> " + e.target.checked);
  // animate__animated animate__delay-3s overlay bg-transparent px-1 py-0 animate__slideInRight
  const isChecked = e.target.checked;
  // el is the DATA-TARGET ELEMENT that needs to be
  const el = document.getElementById(e.target.dataset.target);
  if (!isChecked) {
    el.classList.remove("animate__delay-3s");
    el.classList.remove("animate__slideInRight");
    el.classList.add("animate__fadeOutRightBig");
  } else {
    el.classList.remove("animate__fadeOutRightBig");
    el.classList.add("animate__slideInRight");
  }
}
// #region base config and public key token
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw";
let baseConfig = {
  basemap: {
    lightPreset: "dusk",
  },
};
// #endregion
// #region map construct map object
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard",
  config: baseConfig,
  zoom: 18.93,
  bearing: 150,
  center: positionMap, // `civic`
  // center: [ 27.1428, 38.423733, ], // izmir
  pitch: 60,
  antialias: true,
});
// #endregion
// #region TEST data to draw an initial polygon
// #endregion
// #region geometric route
function roundByN(floatNum, numDecimals) {
  const tenExp = 10 ** numDecimals;
  const res = Math.round(floatNum * tenExp) / tenExp;
  // console.log(res)
  return res;
}
// #endregion
// #region mapbox GL Draw Controls
const draw = new MapboxDraw({
  displayControlsDefault: true,
  // defaultMode: 'draw_polygon'
});
map.addControl(draw);
map.on("draw.create", updateArea);
map.on("draw.delete", updateArea);
map.on("draw.update", updateArea);
map.on("draw.combine", updateArea);
map.on("draw.uncombine", updateArea);
// #endregion
// #region enable disable dusk mode
function handlerDuskMode(e) {
    console.log("before");
    console.log(e.target.checked);
    if (e.target.checked) {
      console.log("dusk mode");
      map.setConfigProperty("basemap", "lightPreset", "dusk");
    } else {
      map.setConfigProperty("basemap", "lightPreset", "day");
    }
  };
$duskMode.addEventListener("change", handlerDuskMode);
// #endregion
// #region ** updateArea()-** -blue extrusion - main function
function updateArea(e) {
  const polygon = draw.getAll();
  map.getSource("user-extrude-src").setData(polygon);
  map.getSource("line-src").setData(geometricRoute(polygon, fetchUserInput()));
  
  if (polygon.features.length > 0) {
    const area = turf.area(polygon);
    const length = turf.length(polygon, { units: "meters" });
    $area.innerText = `${roundByN(area,0)}`;
    $distance.innerText = `${roundByN(length, 0)}`;

    map.getSource("user-extrude-src").setData(polygon);
    map.getSource( "line-src" ).setData( geometricRoute( polygon, fetchUserInput() ) );
    renderRouteDistance(polygon, "calc-route-dist");
    renderLoopLength(polygon, "calc-loop-length");
    
  } else {
    $area.innerHTML = "";
    if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
  }
}
// #endregion
// #region map camera control events: HANDLER DISABLE
function handlerCamCheckBoxes(e) {
  const handler = e.target.id;
  // console.log('handler')
  // console.log(handler)
  // console.log(e.target.checked)
  if (e.target.checked) {
    map[handler].enable();
  } else {
    map[handler].disable();
  }
}
$camControls.addEventListener("change", handlerCamCheckBoxes);
// #endregion


// #region cam-controls-checkbox disable-enable ALL

function handlerDisableCam(e) {
  const handlers = [
    "scrollZoom",
    "boxZoom",
    "dragRotate",
    "dragPan",
    "keyboard",
    "touchZoomRotate",
  ];
  const isChecked = e.target.checked;
  handlers.forEach((h) => { // disables and unchks html el's
    if (document.getElementById(h)) {
      if (isChecked) {
        map[h].disable();
        document.getElementById(h).removeAttribute("checked");
      } else {
        map[h].enable();
        document.getElementById(h).setAttribute("checked", "checked");
      }
    } else {
      if (isChecked) { // disables all cam controls
        map[h].disable();
      } else {
        map[h].enable();
      }
      
    }
  });
}
$disableCamControls.addEventListener("change", handlerDisableCam);
// #endregion
// #region show Camera Control Panel
 function handlerShowPanelCam(e){
   // console.log(`show-panel-cam: ${e.target.checked}`)
   if (!e.target.checked) {
     $camControls.classList.remove("animate__delay-1s");
     $camControls.classList.toggle("animate__slideInDown");
     $camControls.classList.toggle("animate__fadeOutUpBig");
     // $camControls.style.display = "none"; // removes layout
     console.log("camControls: HIDDEN");
   } else {
     $camControls.classList.toggle("animate__slideInDown");
     $camControls.classList.toggle("animate__fadeOutUpBig");
     // $camControls.style.display = "block";
     console.log("camControlsl DISPLAYED");
   }
 };
$showPanelCam.addEventListener( "change", handlerShowPanelCam );
// #endregion
// #region info box with 'lng and lat' vs 'x and y' (from documentation)
function handlerMouseMove(e)  {
  $info.setAttribute("positionX", e.point.x);
  $info.setAttribute("positionY", e.point.y);
  $info.setAttribute("lng", e.lngLat.lng);
  $info.setAttribute("lat", e.lngLat.lat);
  // console.log(e.lngLat.lng + " " + e.lngLat.lat)
  $info.innerHTML = `x ${roundByN(JSON.stringify(e.point.x), 4)} y ${roundByN(
    JSON.stringify(e.point.y),
    4
  )}
    lng: ${roundByN(JSON.stringify(e.lngLat.wrap().lng), 6)} lat: ${roundByN(
    JSON.stringify(e.lngLat.wrap().lat),
    6
  )}`;
}
map.on("mousemove", handlerMouseMove);
// #endregion
// #region Object-3d model transformation: (from documentation)
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
  scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
};
// #endregion
// #region Custom layer for THREE.JS SCNE 3D:(from documentation)
const THREE = window.THREE;
const customLayer = {
  id: "threeJS",
  type: "custom",
  renderingMode: "3d",
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
    loader.load("../../assets/models/uav/scene.gltf", (gltf) => {
      this.scene.add(gltf.scene);
      // console.log(`this.id: ${this.id}`)
    });
    this.map = map;

    // use the Mapbox GL JS map canvas for three.js
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
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
    this.scene.rotation.z += (Math.random() - 0.5) * 0.005;
    this.scene.position.y += (Math.random() - 0.5) * 0.2;
    this.renderer.render(this.scene, this.camera);
    gl.flush();
    this.map.triggerRepaint();
    // console.log(this)
  },
  // #endregion
};
// #endregion
// #region blank geoJSON dat`a to load when there is no polygon
const polyData = {
  type: "FeatureCollection",
  features: [],
};
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
// #endregion
```


```js
// #region  MAP ON LOAD: LAYERS and DATA SOURCEs
map.on("style.load", () => {
  map.addLayer(customLayer);
  // ZERO: user draw polygon or we feed for test purposes (ex: testpoly)
  let fetchData = () => ( draw.getAll().features.length ? draw.getAll() : testpoly );
  console.log(fetchData())
  
  // Extrude layer data
  map.addSource("user-extrude-src", {
    type: "geojson",
    data:fetchData(),
    // data:testpoly,
  });
  // Line layer data
  map.addSource("line-src", {
    type: "geojson",
    lineMetrics: true,
    data: geometricRoute( fetchData(), fetchUserInput()),
  });

  // Render id: "user-extrude-layer",
  map.addLayer({
    id: "user-extrude-layer",
    type: "fill-extrusion",
    source: "user-extrude-src",
    layout: {
      "fill-extrusion-edge-radius": 0.0,
    },
    paint: {
      "fill-extrusion-height": fetchUserInput().inTopHi,
      "fill-extrusion-base": fetchUserInput().inBaseHi,
      "fill-extrusion-emissive-strength": 0.9,
      "fill-extrusion-color": "SkyBlue",
      "fill-extrusion-opacity": 0.5,
      "fill-extrusion-ambient-occlusion-wall-radius": 0,
      "fill-extrusion-ambient-occlusion-radius": 6.0,
      "fill-extrusion-ambient-occlusion-intensity": 0.9,
      "fill-extrusion-ambient-occlusion-ground-attenuation": 0.9,
      "fill-extrusion-vertical-gradient": false,
      "fill-extrusion-line-width": 0, //outwards like a wall
      "fill-extrusion-flood-light-wall-radius": 20,
      "fill-extrusion-flood-light-intensity": 0.9,
      "fill-extrusion-flood-light-color": "DarkTurquoise",
      "fill-extrusion-flood-light-ground-radius": 20,
      "fill-extrusion-cutoff-fade-range": 0,
      "fill-extrusion-rounded-roof": true,
      "fill-extrusion-cast-shadows": false,
      // "":,
    },
  });

  map.on("dblclick", "user-extrude-layer", function (ob) {
    if (ob && ob.features && ob.features.length > 0) {
      // alert("test");
      console.log("test event on ext feature");
    }
  });

  // base config for 2 line layers hrz/vert
  const paintLine = {
    "line-emissive-strength": 1.0,
    "line-blur": 0.2,
    "line-width": 1.25,
    "line-color": "limegreen",
    // "line-gradient": [
    //   "interpolate",
    //   ["linear"],
    //   ["line-progress"],
    //   0.02, "skyblue",
    //   0.04, "aqua",
    //   0.06, "limegreen",
    //   1.00, "lime",
    // ],
    // "line-trim-color": "red",
    // "line-trim-offset": [0.0, 0.005],
    // 'line-gap-width': 1,
  };
  let layoutLine = {
    // shared layout between two layers
    "line-z-offset": [
      "at",
      ["*", ["line-progress"], ["-", ["length", ["get", "elevation"]], 1]],
      ["get", "elevation"],
    ],
    "line-elevation-reference": "sea",
    "line-cap": "round",
  };
```
-----

```JS
  // id: "elevated-line-horizontal",
  layoutLine["line-cross-slope"] = 0;
  map.addLayer({
    id: "elevated-line-horizontal",
    type: "line",
    source: "line-src",
    layout: layoutLine,
    paint: paintLine,
  });

  // elevated-line-vert
  layoutLine["line-cross-slope"] = 1;
  map.addLayer({
    id: "elevated-line-vertical",
    type: "line",
    source: "line-src",
    layout: layoutLine,
    paint: paintLine,
  });
  map.on("moveend", () => {
    const mapCenter = map.getCenter();
    const isMapAway = () => {
      const isLngAway = Math.abs(+mapCenter.lng - positionMap.lng) > 0.5;
      const isLatAway = Math.abs(+mapCenter.lat - positionMap.lat) > 0.5;
      if (isLatAway ) {
        if (isLngAway) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    if ( isMapAway() ) {
      console.log( 'is Map Away TRUE' );
      console.log(`Map Lng: ${mapCenter.lng}, Lat: ${mapCenter.lat}`);
      document.querySelector("#map-coords-lng").value =
        document.querySelector("#map-coords-lng").dataset.alt;

      document.querySelector("#map-coords-lat").value =
        document.querySelector("#map-coords-lat").dataset.alt;
      document.querySelector(
        ".map-coords-button-icon"
      ).innerHTML = `<i class="fas fa-fw fa-undo"></i>`;
    }


  });

  map.on("load", function () {
    map.addControl(
      new mapboxgl.Minimap({
        // center: positionMap, // Civic
        center: [
          +positionMap.lng,
          +positionMap.lat,
        ], // Civic
        zoom: 12,
      }),
      "bottom-right"
    );
  });
});
// #endregion

```