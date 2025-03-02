import * as THREE from 'three';
// import {FlyControls} from 'three/examples/jsm/controls/FlyControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
// Step 1 - Create a scene
const scene = new THREE.Scene();

// Step 2 - Create a camera
const mainCam = new THREE.PerspectiveCamera(75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000);
mainCam.position.set(0, 0, 5);

// Step 3 - Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


/**
 * ---------------------------------------------------------
 * Write code here
 * ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
 * ---------------------------------------------------------
 */
const subCam = new THREE.PerspectiveCamera(75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000);
subCam.position.set(0, 5, 0);
subCam.lookAt(0, 0, 0);

const camHelper = new THREE.CameraHelper(mainCam);
scene.add(camHelper);

const controls = new FlyControls(mainCam, renderer.domElement);
controls.rollSpeed = 0.5;
controls.movementSpeed = 1;

const clock = new THREE.Clock();

// material for geometries
const material = new THREE.MeshNormalMaterial();

// array will hold three geometries: cylinder, sphere, box
const geo = [];
geo[0] = new THREE.CylinderGeometry(0.25, 0.25);
geo[1] = new THREE.SphereGeometry(0.25);
geo[2] = new THREE.BoxGeometry(0.25, 0.25, 0.25);

// Create 50 meshes, give random geometry and location
for (let i=0; i<50; i++){
    let x = 4 * (2 * Math.random() - 1);
    let z = 4 * (2 * Math.random() - 1);
    let randInt = Math.floor(Math.random()*3);

    let tmpMesh = new THREE.Mesh(geo[randInt], material);
    tmpMesh.position.set(x, 0, z);

    scene.add(tmpMesh);
}

/**---------------------------------------------------------
 * --------------------------------------------------------- 
 */

// Render Scene
renderer.render(scene, mainCam);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    controls.update(clock.getDelta());

    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, mainCam);

    renderer.clearDepth();

    renderer.setScissorTest(true);

    let x = 0.75 * window.innerWidth;
    let y = 0.75 * window.innerHeight;
    let w = 0.25 * window.innerWidth;
    let h = w / subCam.aspect;

    renderer.setScissor(x, y, w, h);
    renderer.setViewport(x, y, w, h);

    renderer.render(scene, subCam);
    renderer.setScissorTest(false);
}

animate();