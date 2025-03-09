// 4.1 add obstacle -another object- to the scene
import * as THREE from 'three' // add importmap to HTML to avoid errors
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// three.js snippets vs code extension -> tinit STEP-1


const init = () => {
    const scene = new THREE.Scene()
    // create a camera, which defines where we're looking at
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    // create a render and set the size
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    }
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(sizes.width, sizes.height)
    // add the output of the render function to the HTML
    document.body.appendChild(renderer.domElement)
    // tell the camera where to look
    camera.rotation.set(-0.3, 0, 0)
    camera.position.set(0, 10, 15)
    // #endregion

    // --------------- CODE START-------(ttinit above)-------------


    // add bg color 
    const colorBackground = new THREE.Color().setRGB(.05, .05, .95)
    scene.background = colorBackground

    // #region :  Hello Sphere, First mesh: geo, mat-- s2.3
    const geoChar = new THREE.SphereGeometry(1.25, 32, 32)
    const colorChar = new THREE.Color().setRGB(.901, .902, .901)
    let matChar = new THREE.MeshBasicMaterial({ color: colorChar })
    let meshChar = new THREE.Mesh(geoChar, matChar)
    meshChar.position.set(0, 0, 0);
    meshChar.scale.set(1, 1);
    // #endregion

    meshChar.add(camera) // s3.3 
    scene.add(meshChar)

    // #region Add another mesh: floor, PlaneGeometry -- s2.3
    const geoFloor = new THREE.PlaneGeometry(800, 1200, 1, 1) // GEO
    // (width = 800, height = 1200, widthSegments = 1, heightSegments = 1)
    const colorFloor = new THREE.Color().setRGB(.1, .99, .01) //  MAT- need a color
    let matFloor = new THREE.MeshBasicMaterial({
        color: colorFloor,
        side: THREE.DoubleSide
    }) // MAT- finalize defining obj
    let meshFloor = new THREE.Mesh(geoFloor, matFloor) // mesh(geo, mat)
    scene.add(meshFloor)
    meshFloor.rotation.x = Math.PI / 2 //its a wall if we dont rotate PlaneG
    meshFloor.position.y = -5 // floor level
    // #endregion


    // #region Helper funcs and vars for keyboard events - s3.3
    const keyActionsMapping = { // s3.1
        65: () => meshChar.translateX(  -0.1), // A
        68: () => meshChar.translateX(  0.1), // D
        87: () => meshChar.translateZ( -0.2), // W 
        83: () => meshChar.translateZ(  0.1), // S 
        16: () => meshChar.translateY(  0.2),  // Shift
        32: () => meshChar.translateY( -0.1),  // Space
        81: () => meshChar.rotation.y+= 0.01, // Q
        69: () => meshChar.rotation.y-= 0.01, // E
        37: () => camera.rotation.y += 0.01, // ArrowLeft
        39: () => camera.rotation.y -= 0.01, // ArrowRight
        38: () => camera.rotation.x -= 0.01, // ArrowUp 
        40: () => camera.rotation.x += 0.01, // ArrowDown 
        82: () => camera.rotation.set(-0.3,0,0), // R
    }

    let isKeyPressed = false  // s3.2 to handle continuous keys
    // global variable to store event so that we can use event.keyCode property in updateIfKeyAction function which is not an event-listener
    let eventKeyUpDown; // s3.2
    function updateIfKeyAction(e) { // s3.2
        if (isKeyPressed) {
            console.log('UPDATE: A key pressed ' + e.keyCode)
            if (keyActionsMapping[e.keyCode]) {
                console.log('UPDATE: An action key pressed ' + e.keyCode)
                keyActionsMapping[e.keyCode]()
                console.log(`meshChar.position: x,y,z ${meshChar.position.x} ${meshChar.position.y} ${meshChar.position.z} `
                )
            }
        }
    }

    const keydownListener = function (event) {
        console.log('keydown event, key pressed ' + event.keyCode)
        isKeyPressed = true
        eventKeyUpDown = event
    }
    const keyupListener = function (event) {
        console.log('keyup event, key released ' + event.keyCode)
        isKeyPressed = false
        eventKeyUpDown = event
    }

    window.addEventListener('keydown', keydownListener, false)
    window.addEventListener('keyup', keyupListener, false)
    // #endregion

    // #region Add obstacle: geometry + material = mesh - s4.1
    const geoObstacle = new THREE.BoxGeometry(10, 25, 10)  // width, height, depth
    // MeshBasicMat(): color should be hexadecimal string not object
    const matObstacle = new THREE.MeshBasicMaterial({ color: '#808080' }) // ctrl-alt-c for HEx color picker vs-code ext.
    const meshObstacle = new THREE.Mesh(geoObstacle, matObstacle)
    meshObstacle.position.z = -30

    scene.add(meshObstacle)
    // #endregion

    // Detecting Collision works with mesh.Geometry.Vertices, doesn't apply-s4.2

    // #region : Add Player Health (User Guide- since no collision)--s4.3
    function updatePositionChar(params) {
        document.getElementById("positionX").innerHTML = ""
            + " X: " + meshChar.position.x.toFixed(2)
            ;
        document.getElementById("positionY").innerHTML = ""
            + " Y: " + meshChar.position.y.toFixed(2)
            ;
        document.getElementById("positionZ").innerHTML = ""
            + " Z: " + meshChar.position.z.toFixed(2)
            ;
    }
    //#endregion

    // #region Add event listener for  Window Resize --s5.2 

    window.addEventListener("resize", windowResizeListener, false);

    function windowResizeListener() {
        camera.aspect = window.innerWidth / window.innerHeight;
        // must be called after any change in cam props
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // #endregion

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const loader = new THREE.TextureLoader();

    // load GLTF for size and performance


    loader.load("skin.png", function (texture) {

        meshChar.material.needsUpdate = true;

        meshChar.material.map = texture;
    const Loader = new GLTFLoader();
    Loader.setDRACOLoader(dracoLoader);
    Loader.load("uav/scene.gltf",
        
        // onLoad callback
        (data) => {
            // do something with robot
            console.log("loaded successfully");
            // use below function
            data.scene.traverse((object) => {
                if (object.isMesh) {
                    // object.material.envMap = cubeTexture;
                    object.position.set(0, 5, 0);
                    object.rotation.set(9.5, 0, 0);
                    object.scale.set(1, 1);
                    console.log(object)
                    meshChar.add(object) // s3.3 
                }
            });
            // data has scene prpty itself so data-dot-scene
            // scene.add(data.scene);
        },
        // onError callback
        (err) => {
            console.log('An error happened');
        }
    );
    });

    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.5;
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(-2, 10, 0);
    scene.add(dirLight);

    //------------------ CODE END----------(TTInit below - part of step1)
    // function for re-rendering/ runs 60 times per second
    function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        updateIfKeyAction(eventKeyUpDown)
        updatePositionChar()
    }
    animate()
}
init()
