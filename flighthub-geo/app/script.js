"use strict";

// Test data
const testpoly = {
  type: "FeatureCollection",
  features: [
    {
      id: "v7XuciFKLZeXdki1exROc9FYF5380cyJ",
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          [
            [-104.98889877496177, 39.739474389236506],
            [-104.98890000860759, 39.73931432060394],
            [-104.98880577159332, 39.73931234424225],
            [-104.9888047909794, 39.739474425443774],
            [-104.98889877496177, 39.739474389236506],
          ],
        ],
        type: "Polygon",
      },
    },
  ],
};

// Geometric Route Function
const geometricRoute = (poly, userInput) => {
  console.log(userInput);
  const {
    inBaseHi = 0,
    inTopHi = 20,
    inStepCount = 4,
    inToleranceWidth = 6,
  } = userInput || {};

  let stepHeight = (inTopHi - inBaseHi) / inStepCount;

  const features = []; // output of the function with geoJSON feats
  function elevateFromDistance(
    XfromStart, // distance From Start: X-bar
    inLoopLength, // length of base ring: totalX
    inStepHeight, // height is 2r
    inElevMin // base height
  ) {
    const r = inStepHeight * 0.5; // radius of the circular segments
    const x = XfromStart;

    // 3 SEGMENTS OF THE LINE
    const isInSeg1ConcaveDown = x < r; // First segment (circular, concave down)
    const isInSeg3ConcaveUp = inLoopLength - x < r; // Third segment (circular, concave up)

    let calculatedY; // result

    if (isInSeg1ConcaveDown) {
      // First segment: quarter circle (0 to π/2) moving upward
      calculatedY = Math.sqrt(r * r - (x - r) * (x - r));
    } else if (isInSeg3ConcaveUp) {
      // Third segment: quarter circle (π to 3π/2) moving downward
      const xFromEnd = inLoopLength - x;
      calculatedY = r - Math.sqrt(r * r - (xFromEnd - r) * (xFromEnd - r));
      calculatedY += inStepHeight * 0.5;
    } else {
      // Second segment: straight line at maximum height (2r)
      calculatedY = inStepHeight * 0.5;
    }
    // Add the base elevation
    return calculatedY + inElevMin;
  }

  function smootherPoly(polygon) {
    const buffered = turf.buffer(polygon, inToleranceWidth, {
      units: "meters",
    });
    const simplified = turf.simplify(buffered, {
      tolerance: 0.000001,
      highQuality: false,
    });
    return turf.polygonSmooth(simplified, { iterations: 3 });
  }
  const smoother = smootherPoly(poly);
  const indexOfLastFeat = smoother.features.length - 1;

  for (let indxLoop = 0; indxLoop < inStepCount; indxLoop++) {
    let elevBase = indxLoop * stepHeight + inBaseHi;

    const loopLen2d = turf.length(smoother, { units: "meters" });
    if (smoother.features.length > 0) {
      const feat = {
        // feat for Line - flight Path
        type: "Feature",
        properties: {
          id: indxLoop,
          LOOPLENGTH: loopLen2d,
          STEPHEIGHT: stepHeight,
          ELEVMIN: elevBase,
          ELEVMAX: elevBase + stepHeight,
          distFromStart: [],
          elevation: [],
          coordsRev: [],
        },
        geometry: {
          coordinates: [],
          type: "LineString",
        },
      };
      let rev = [];
      let coords = [];
      let distArray = [];
      coords = smoother.features[indexOfLastFeat].geometry.coordinates.flatMap(
        (d) => d
      );
      rev = [...coords].reverse();
      function distanceFromCoords(cors) {
        const distArr = [];
        distArr.push(0); //first distance
        let sum = 0;
        for (let i = 1; i < cors.length; i++) {
          const seg = turf.distance(cors[i - 1], cors[i], { units: "meters" });
          sum = sum + seg;
          distArr.push(sum);
        }
        return distArr;
      }

      for (let idxCord = 0; idxCord < coords.length; idxCord++) {
        const cord = coords[idxCord];
        feat.geometry.coordinates.push(cord);
      }
      feat.properties.distFromStart = distanceFromCoords(
        smoother.features[indexOfLastFeat].geometry.coordinates.flatMap(
          (d) => d
        )
      );
      distArray = feat.properties.distFromStart;

      if (indxLoop % 2 === 0) {
        // 1st RING
        feat.properties.elevation = distArray.map((distanceFromStart) =>
          elevateFromDistance(
            distanceFromStart,
            feat.properties.LOOPLENGTH,
            feat.properties.STEPHEIGHT,
            feat.properties.ELEVMIN
          )
        );
      } else {
        // 2nd RING
        feat.geometry.coordinates = [];
        feat.geometry.coordinates.push(...rev);
        feat.properties.elevation = feat.properties.distFromStart.map(
          (distanceFromStart) =>
            elevateFromDistance(
              distanceFromStart,
              feat.properties.LOOPLENGTH,
              feat.properties.STEPHEIGHT,
              feat.properties.ELEVMIN
            )
        );
      }
      features.push(feat);
    } else {
      console.log("generate lines: no feats in geojson smoother polygon");
    }
  }
  console.log(features);

  return {
    type: "FeatureCollection",
    features: features,
  };
};

// Export the functions and data
export { testpoly, geometricRoute };

// Main application code
const $info = document.querySelector("#info");
const $area = document.querySelector("#calculated-area");
const $distance = document.querySelector("#calculated-distance");
const $showPanelGeo = document.querySelector("#show-panel-geo");
const $geoButtons = document.querySelectorAll( ".geo-btn" );
const $geoInputs = document.querySelectorAll( ".geo-input-el" );



const positionMap = {
  lng: "-104.9889",
  lat: "39.7394"
}; // denver civics 
// console.log(positionMap)

function fetchCoordsInput() {
  return [
    +document.querySelector("#map-coords-lng").value,
     +document.querySelector("#map-coords-lat").value,
  ]
}
  
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
    map
      .getSource("line-src")
      .setData( geometricRoute( draw.getAll(), fetchUserInput() ) );
    map.triggerRepaint()
    renderRouteDistance(draw.getAll(), "calc-route-dist");
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

// #endregion
// #region Object-3d model transformation: (from documentation)
// #endregion
// // #region Custom layer for THREE.JS SCNE 3D:(from documentation)
// const THREE = window.THREE;
// const customLayer = {
//   id: "threeJS",
//   type: "custom",
//   renderingMode: "3d",
//   onAdd: function (map, gl) {
//     this.camera = new THREE.Camera();
//     this.scene = new THREE.Scene();
//     // create two three.js lights to illuminate the model
//     const directionalLight = new THREE.DirectionalLight(0xffffff);
//     directionalLight.position.set(0, -70, 100).normalize();
//     this.scene.add(directionalLight);

//     const directionalLight2 = new THREE.DirectionalLight(0xffffff);
//     directionalLight2.position.set(0, 70, 100).normalize();
//     this.scene.add(directionalLight2);
//     const directionalLight3 = new THREE.DirectionalLight(0xffffff);
//     directionalLight3.position.set(10, 50, 0).normalize();
//     this.scene.add(directionalLight3);

//     // use the three.js GLTF loader to add the 3D model to the three.js scene
//     // const modelGroup = new THREE.Group();
//     const loader = new THREE.GLTFLoader();
//     loader.load("./uav/scene.gltf", (gltf) => {
//       this.scene.add(gltf.scene);
//       // console.log(`this.id: ${this.id}`)
//     });
//     this.map = map;

//     // use the Mapbox GL JS map canvas for three.js
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: map.getCanvas(),
//       context: gl,
//       antialias: true,
//     });

//     this.renderer.autoClear = false;
//   },

//   // #region RENDER
//   render: function (gl, matrix) {
//     const rotationX = new THREE.Matrix4().makeRotationAxis(
//       new THREE.Vector3(1, 0, 0),
//       modelTransform.rotateX
//     );
//     const rotationY = new THREE.Matrix4().makeRotationAxis(
//       new THREE.Vector3(0, 1, 0),
//       modelTransform.rotateY
//     );
//     const rotationZ = new THREE.Matrix4().makeRotationAxis(
//       new THREE.Vector3(0, 0, 1),
//       modelTransform.rotateZ
//     );

//     const m = new THREE.Matrix4().fromArray(matrix);
//     const l = new THREE.Matrix4()
//       .makeTranslation(
//         modelTransform.translateX,
//         modelTransform.translateY,
//         modelTransform.translateZ
//       )
//       .scale(
//         new THREE.Vector3(
//           modelTransform.scale,
//           -modelTransform.scale,
//           modelTransform.scale
//         )
//       )
//       .multiply(rotationX)
//       .multiply(rotationY)
//       .multiply(rotationZ);
//     this.camera.projectionMatrix = m.multiply(l);
//     this.renderer.resetState();
//     this.scene.rotation.z += (Math.random() - 0.5) * 0.005;
//     this.scene.position.y += (Math.random() - 0.5) * 0.2;
//     this.renderer.render(this.scene, this.camera);
//     gl.flush();
//     this.map.triggerRepaint();
//     // console.log(this)
//   },
//   // #endregion
// };
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
// #region  MAP ON LOAD: LAYERS and DATA SOURCEs
map.on("style.load", () => {
  // map.addLayer(customLayer);
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
  });
});
// #endregion
