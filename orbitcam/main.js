import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

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

// Step 4 - Create controls
const controls = new OrbitControls(mainCam, renderer.domElement);

// Step 5 - Create Cube Texture
const loader = new THREE.CubeTextureLoader();
const cubeTexture = loader.load([
  'images/Cube-Map/px.png',
  'images/Cube-Map/nx.png',
  'images/Cube-Map/py.png',
  'images/Cube-Map/ny.png',
  'images/Cube-Map/pz.png',
  'images/Cube-Map/nz.png'
]);

// Step 6 - Load MatCap texture
const matCapLoader = new THREE.TextureLoader();
const matcap = matCapLoader.load('images/MatCaps/matcapTexture.png');

// Step 7 - lights
const lights = new THREE.Group();

const light1 = new THREE.PointLight();
light1.position.set(-5, 10, -5);
light1.intensity = 10;
lights.add(light1);

const light2 = new THREE.PointLight();
light2.position.set(5, 5, 5);
light2.intensity = 10;

lights.add(light2);

/**
 * ---------------------------------------------------------
 * Write code here
 * ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
 * ---------------------------------------------------------
 */


scene.background = cubeTexture;
const geometry = new THREE.TorusKnotGeometry();

const material = new THREE.MeshBasicMaterial({
    envMap : cubeTexture
});

const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);


/**---------------------------------------------------------
 * --------------------------------------------------------- 
 */

// Render Scene
renderer.render(scene, mainCam);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    controls.update();

/**
 * ---------------------------------------------------------
 * Write animation code here
 * ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
 * ---------------------------------------------------------
 */

    

/**---------------------------------------------------------
 * --------------------------------------------------------- 
 */    
    
    renderer.render(scene, mainCam);
}

animate();