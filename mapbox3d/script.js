import { geometricRoute } from "./geometricRoute.js";
import { testpoly } from "./testdata.js";

// nav-bar HTML elements
let $duskMode = document.querySelector("#duskModeCkbox");
let $camControls = document.querySelector("#navCamControls");
let $disableCamControls = document.querySelector("#disableCamControls");
let $showCam = document.querySelector("#show-panel-cam");
let $showGeo = document.querySelector("#show-panel-geo");
let $info = document.getElementById( "info" );

// ----------------
let fetchInputVals= () => {return {
  inBaseHi:document.querySelector("#user-base-height").value * 1,
  inTopHi: document.querySelector("#user-top-height").value * 1,
  inStepCount:document.querySelector("#user-step-count").value * 1,
  inToleranceWidth:document.querySelector("#user-tolerance-w").value * 1,
}};

function renderRouteDistance(poly, elementId) {
  function geoRouteDistance( poly ) {
    return geometricRoute(poly, fetchInputVals())
    .features.map((d) => d.properties.LOOPLENGTH + d.properties.STEPHEIGHT)
    .reduce( ( accumulator, currentValue ) => accumulator + currentValue, 0 )
  }
  let routeDistance = geoRouteDistance(poly);
  console.log("routeLen " + routeDistance);
  const $el = document.getElementById( elementId )
  $el.innerText = "";
  $el.innerText = "" + roundByN(routeDistance, 0) + " m";
}
function renderLoopLength(poly, elementID) {
  function geoLoopLength(poly) {
  return geometricRoute(poly, fetchInputVals())
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

document
  .querySelector("#enableSatellite")
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

document
  .querySelectorAll(".geo-btn")
  .forEach((button) => button.addEventListener("click", handlerGeoBtn));


const handlerGeo = () => {

  if (map.getLayer("user-extrude-layer")) {
    map.setPaintProperty(
      "user-extrude-layer",
      "fill-extrusion-base",
      + fetchInputVals().inBaseHi 
    );

  }

  if (map.getLayer("user-extrude-layer")) {
    map.setPaintProperty(
      "user-extrude-layer",
      "fill-extrusion-height",
      +fetchInputVals().inTopHi
    );
  }
  if (draw.getAll().features.length) {
    map
      .getSource("line-src")
      .setData( geometricRoute( draw.getAll(), fetchInputVals() ) );
    map.triggerRepaint()
    renderRouteDistance(draw.getAll(), "calc-route-dist");
    renderLoopLength(draw.getAll(), "calc-loop-length");
    
  } else { // TEST RUN WITH NO DRAW DATA 
    map
      .getSource("line-src")
      .setData( geometricRoute(testpoly, fetchInputVals() ) );
    map.triggerRepaint()
    renderRouteDistance(testpoly, "calc-route-dist")
    renderLoopLength(testpoly, "calc-loop-length")
  }
};
document
  .querySelectorAll(".geo-input-el")
  .forEach((inputEl) => inputEl.addEventListener("change", handlerGeo));

$showGeo.addEventListener(
  "change",
  (e) => {
    // e.target is the SWITCH element
    console.log("clk target:>> " + e.target.dataset.target);
    console.log("clk on>> " + e.target.id + " chk stat>> " + e.target.checked);

    const isChecked = e.target.checked;
    // el is the DATA-TARGET ELEMENT that needs to be
    const el = document.querySelector(e.target.dataset.target);
    if (!isChecked) {
      el.classList.remove("animate__slideInLeft");
      el.classList.add("animate__fadeOutLeftBig");
    } else {
      el.classList.remove("animate__fadeOutLeftBig");
      el.classList.add("animate__slideInLeft");
    }
  },
  false
);

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
  center: [-104.9889, 39.7394], // civic
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
// #endregion
// #region enable disable dusk mode
$duskMode.addEventListener("change", (e) => {
  console.log("before");
  console.log(e.target.checked);
  if (e.target.checked) {
    console.log("dusk mode");
    map.setConfigProperty("basemap", "lightPreset", "dusk");
  } else {
    map.setConfigProperty("basemap", "lightPreset", "day");
  }
});
// #endregion
// #region ** updateArea()-** -blue extrusion - main function
function updateArea(e) {
  const polygon = draw.getAll();
  const $area = document.getElementById("calculated-area");
  const $distance = document.getElementById("calculated-distance");
  map.getSource("user-extrude-src").setData(polygon);
  map.getSource("line-src").setData(geometricRoute(polygon, fetchInputVals()));
  
  if (polygon.features.length > 0) {
    const area = turf.area(polygon);
    const length = turf.length(polygon, { units: "meters" });
    $area.innerText = `${roundByN(area,0)}`;
    $distance.innerText = `${roundByN(length, 0)}`;

    map.getSource("user-extrude-src").setData(polygon);
    map.getSource( "line-src" ).setData( geometricRoute( polygon, fetchInputVals() ) );
    renderRouteDistance(polygon, "calc-route-dist");
    renderLoopLength(polygon, "calc-loop-length");
    
  } else {
    $area.innerHTML = "";
    if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
  }
}
// #endregion
// #region map camera control events: HANDLER DISABLE
$camControls.addEventListener("change", (e) => {
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
$disableCamControls.addEventListener("change", (e) => {
  // console.log(`e.target.checked ${e.target.checked}`)
  // document.querySelectorAll(".camCheckBox").forEach((h) => {
  const handlers = [
    "scrollZoom",
    "boxZoom",
    "dragRotate",
    "dragPan",
    "keyboard",
    "doubleClickZoom", // can not be disabled per draw controls
    "touchZoomRotate",
  ];
  document.querySelectorAll(".camCheckBox").forEach((h) => {
    // console.log(`h: ${h.id}`)
    if (h.id != "") {
      if (e.target.checked) {
        map[h.id].disable();
        document.getElementById(h.id).removeAttribute("checked");
      } else {
        document.getElementById(h.id).setAttribute("checked", "checked");
        map[h.id].enable();
      }
    }
  });
});
// #endregion
// #region show Camera Control Panel
$showCam.addEventListener( "change", ( e ) => {
  // console.log(`show-panel-cam: ${e.target.checked}`)
  if (!e.target.checked) {
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
});
// #endregion
// #region info box with 'lng and lat' vs 'x and y' (from documentation)
map.on("mousemove", (e) => {
  $info.setAttribute("positionX", e.point.x);
  $info.setAttribute("positionY", e.point.y);
  $info.setAttribute("lng", e.lngLat.lng);
  $info.setAttribute("lat", e.lngLat.lat);
  // TODO lets make this a table with rounded numbers so it wouldn't take so much space
  // console.log(e.lngLat.lng + " " + e.lngLat.lat)
  $info.innerHTML = `x ${roundByN(JSON.stringify(e.point.x), 4)} y ${roundByN(
    JSON.stringify(e.point.y),
    4
  )}
    lng: ${roundByN(JSON.stringify(e.lngLat.wrap().lng), 6)} lat: ${roundByN(
    JSON.stringify(e.lngLat.wrap().lat),
    6
  )}`;
});
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
    loader.load("images/uav/scene.gltf", (gltf) => {
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
// #region blank geoJSON data to load when there is no polygon
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
    data: geometricRoute( fetchData(), fetchInputVals()),
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
      "fill-extrusion-height": fetchInputVals().inTopHi,
      "fill-extrusion-base": fetchInputVals().inBaseHi,
      "fill-extrusion-emissive-strength": 0.9,
      "fill-extrusion-color": "SkyBlue",
      "fill-extrusion-flood-light-color": "DarkTurquoise",
      "fill-extrusion-opacity": 0.5,
      "fill-extrusion-ambient-occlusion-wall-radius": 0,
      "fill-extrusion-ambient-occlusion-radius": 6.0,
      "fill-extrusion-ambient-occlusion-intensity": 0.9,
      "fill-extrusion-ambient-occlusion-ground-attenuation": 0.9,
      "fill-extrusion-vertical-gradient": false,
      "fill-extrusion-line-width": 0, //outwards like a wall
      "fill-extrusion-flood-light-wall-radius": 20,
      "fill-extrusion-flood-light-intensity": 0.9,
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

  map.on("load", function () {
    map.addControl(
      new mapboxgl.Minimap({
        center: [-104.9889, 39.7394], // Civic
        zoom: 12,
      }),
      "bottom-right"
    );
  });
});
// #endregion
