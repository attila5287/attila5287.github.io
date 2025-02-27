import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function model() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 50, 500);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 100;
    controls.maxDistance = 1000;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Add a ground plane
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x999999,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -50;
    ground.receiveShadow = true;
    ground.name = "ground";
    scene.add(ground);

    // Annotation variables
    let annotationMode = 'idle'; // 'idle', 'drawing', 'extruding'
    let annotationPoints = [];
    let annotationMeshes = [];
    let currentPolygon = null;
    let currentExtrudedPolygon = null;
    let extrusionHeight = 50; // Default extrusion height
    let extrusionOffset = 0; // For vertical positioning of the extrusion
    let extrusionDirection = -1; // -1 for downward, 1 for upward, 0 for centered
    let scaleX = 1.0; // Scale factor for X dimension
    let scaleZ = 1.0; // Scale factor for Z dimension
    let closeIndicator = null;
    
    // Visual elements group
    const annotationsGroup = new THREE.Group();
    annotationsGroup.name = "annotationsGroup";
    scene.add(annotationsGroup);
    
    // Creates materials
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
    const polygonMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3366ff, 
        transparent: true, 
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    const extrudedMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6699ff, 
        transparent: true, 
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    // Geometries
    const pointGeometry = new THREE.SphereGeometry(3, 16, 16);
    
    // Raycaster for getting 3D points on model
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Creates a fallback model
    let loadedModel = createFallbackModel();
    
    // Creates a simple fallback model
    function createFallbackModel() {
        console.log('Creating fallback model...');
        // Creates a simple building-like shape with slightly larger dimensions
        const baseGeometry = new THREE.BoxGeometry(150, 150, 150);
        const baseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xAA8866,
            roughness: 0.7 
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 75;
        base.castShadow = true;
        base.receiveShadow = true;
        base.name = "modelBase"; // Add name for easier identification
        
        // Adds a roof
        const roofGeometry = new THREE.ConeGeometry(120, 80, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x884422,
            roughness: 0.6 
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 175;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        roof.name = "modelRoof"; // Add name for easier identification
        
        // Creates a group for the model
        const modelGroup = new THREE.Group();
        modelGroup.name = "fallbackModel"; // Name the group
        modelGroup.add(base);
        modelGroup.add(roof);
        scene.add(modelGroup);
        
        return modelGroup;
    }

    // Set up UI controls
    setupUI();
    
    function setupUI() {
        const drawButton = document.getElementById('draw-button');
        const extrudeButton = document.getElementById('extrude-button');
        const resetButton = document.getElementById('reset-button');
        const heightSlider = document.getElementById('height-slider');
        
        if (drawButton) {
            drawButton.addEventListener('click', () => {
                if (annotationMode === 'idle') {
                    startDrawing();
                    drawButton.textContent = 'Finish Polygon';
                } else if (annotationMode === 'drawing') {
                    finishPolygon();
                    drawButton.textContent = 'Start Drawing Polygon';
                }
            });
        }
        
        if (extrudeButton) {
            extrudeButton.addEventListener('click', extrudePolygon);
        }
        
        if (resetButton) {
            resetButton.addEventListener('click', resetAnnotations);
        }
        
        if (heightSlider) {
            heightSlider.addEventListener('input', (e) => {
                extrusionHeight = parseInt(e.target.value);
                if (currentExtrudedPolygon) {
                    updateExtrusion();
                }
            });
        }
        
        // Adds a dropdown for extrusion direction
        const directionLabel = document.createElement('div');
        directionLabel.textContent = 'Extrusion Direction:';
        directionLabel.style.marginTop = '10px';
        
        const directionSelect = document.createElement('select');
        directionSelect.id = 'direction-select';
        
        const options = [
            { value: '-1', text: 'Extrude Downward' },
            { value: '0', text: 'Extrude Centered' },
            { value: '1', text: 'Extrude Upward' }
        ];
        
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.text = option.text;
            directionSelect.appendChild(opt);
        });
        
        directionSelect.value = '-1'; // Default to downward
        
        directionSelect.addEventListener('change', (e) => {
            extrusionDirection = parseInt(e.target.value);
            if (currentExtrudedPolygon) {
                updateExtrusion();
            }
        });
        
        // Adds an offset slider
        const offsetLabel = document.createElement('div');
        offsetLabel.textContent = 'Extrusion Vertical Offset:';
        offsetLabel.style.marginTop = '10px';
        
        const offsetSlider = document.createElement('input');
        offsetSlider.type = 'range';
        offsetSlider.id = 'offset-slider';
        offsetSlider.min = '-100';
        offsetSlider.max = '100';
        offsetSlider.value = '0';
        
        offsetSlider.addEventListener('input', (e) => {
            extrusionOffset = parseInt(e.target.value);
            if (currentExtrudedPolygon) {
                updateExtrusion();
            }
        });
        
        // Adds X scale slider
        const scaleXLabel = document.createElement('div');
        scaleXLabel.textContent = 'Width Scale (X):';
        scaleXLabel.style.marginTop = '10px';
        
        const scaleXSlider = document.createElement('input');
        scaleXSlider.type = 'range';
        scaleXSlider.id = 'scale-x-slider';
        scaleXSlider.min = '0.5';
        scaleXSlider.max = '2.0';
        scaleXSlider.step = '0.1';
        scaleXSlider.value = '1.0';
        
        scaleXSlider.addEventListener('input', (e) => {
            scaleX = parseFloat(e.target.value);
            if (currentExtrudedPolygon) {
                updateExtrusion();
            }
        });
        
        // Adds Z scale slider
        const scaleZLabel = document.createElement('div');
        scaleZLabel.textContent = 'Depth Scale (Z):';
        scaleZLabel.style.marginTop = '10px';
        
        const scaleZSlider = document.createElement('input');
        scaleZSlider.type = 'range';
        scaleZSlider.id = 'scale-z-slider';
        scaleZSlider.min = '0.5';
        scaleZSlider.max = '2.0';
        scaleZSlider.step = '0.1';
        scaleZSlider.value = '1.0';
        
        scaleZSlider.addEventListener('input', (e) => {
            scaleZ = parseFloat(e.target.value);
            if (currentExtrudedPolygon) {
                updateExtrusion();
            }
        });
        
        // Finds the UI container and add the new controls
        const uiContainer = document.getElementById('ui-container');
        if (uiContainer) {
            uiContainer.appendChild(document.createElement('hr'));
            uiContainer.appendChild(directionLabel);
            uiContainer.appendChild(directionSelect);
            uiContainer.appendChild(offsetLabel);
            uiContainer.appendChild(offsetSlider);
            uiContainer.appendChild(document.createElement('hr'));
            uiContainer.appendChild(scaleXLabel);
            uiContainer.appendChild(scaleXSlider);
            uiContainer.appendChild(scaleZLabel);
            uiContainer.appendChild(scaleZSlider);
        }
    }
    
    // Annotations Functions
    function startDrawing() {
        console.log("Starting drawing mode");
        annotationMode = 'drawing';
        resetAnnotations();
        controls.enabled = false; // Disable orbit controls while annotating
    }
    
    function addAnnotationPoint(event) {
        if (annotationMode !== 'drawing') {
            console.log("Not in drawing mode");
            return;
        }
        
        // Gets mouse position
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Updates raycaster
        raycaster.setFromCamera(mouse, camera);
        
        console.log("Checking for intersections...");
        console.log("Scene objects:", scene.children.map(obj => obj.name || obj.type));
        
        // Check for intersections with scene objects recursively
        const intersects = raycaster.intersectObjects(scene.children, true);
        console.log("All intersections:", intersects.length);
        
        if (intersects.length === 0) {
            console.log("No intersections found at all");
            
            // As a fallback, creates a point at a fixed distance from the camera
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = 300; // Fixed distance
            const position = camera.position.clone().add(dir.multiplyScalar(distance));
            
            console.log("Creating fallback point at:", position);
            
            // Adds point to our list
            annotationPoints.push(position);
            
            // Creates visual point
            const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
            pointMesh.position.copy(position);
            annotationsGroup.add(pointMesh);
            annotationMeshes.push(pointMesh);
            
            // If we have at least two points, draw a line
            if (annotationPoints.length >= 2) {
                const lastIndex = annotationPoints.length - 1;
                
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    annotationPoints[lastIndex - 1],
                    annotationPoints[lastIndex]
                ]);
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                annotationsGroup.add(line);
                annotationMeshes.push(line);
            }
            
            // Updates polygon visualization
            updatePolygonVisualization();
            
            // Show indicators when near the first point (if we have at least 2 points)
            if (annotationPoints.length >= 3) {
                const firstPoint = annotationPoints[0];
                const lastPoint = annotationPoints[annotationPoints.length - 1];
                const distance = firstPoint.distanceTo(lastPoint);
                
                // If we're getting close to the first point
                if (distance < 40) {
                    // Remove previous indicator if it exists
                    if (closeIndicator) {
                        annotationsGroup.remove(closeIndicator);
                    }
                    
                    // Creates a visual indicator
                    const indicatorGeometry = new THREE.RingGeometry(5, 7, 16);
                    const indicatorMaterial = new THREE.MeshBasicMaterial({ 
                        color: 0xffff00, 
                        side: THREE.DoubleSide 
                    });
                    closeIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
                    closeIndicator.position.copy(firstPoint);
                    // Rotate to face camera
                    closeIndicator.lookAt(camera.position);
                    annotationsGroup.add(closeIndicator);
                } else if (closeIndicator) {
                    // Removes indicator if we're not close
                    annotationsGroup.remove(closeIndicator);
                    closeIndicator = null;
                }
            }
            
            // Checks if we should auto-close the polygon
            if (annotationPoints.length >= 3) {
                // Checks if the last point is close to the first point
                const firstPoint = annotationPoints[0];
                const lastPoint = annotationPoints[annotationPoints.length - 1];
                
                // Calculates distance between first and last point
                const distance = firstPoint.distanceTo(lastPoint);
                
                // If they're closer than 20 units, auto-close the polygon
                if (distance < 20) {
                    console.log("Auto-closing polygon - last point is close to first point");
                    
                    // Removes the last point (it's too close to the first one)
                    annotationPoints.pop();
                    
                    // Removes the last visual point
                    const lastPointMesh = annotationMeshes.pop();
                    annotationsGroup.remove(lastPointMesh);
                    
                    // Removes the last line
                    const lastLine = annotationMeshes.pop();
                    annotationsGroup.remove(lastLine);
                    
                    // Instead, create a line from the second-to-last point to the first point
                    const closeLineGeometry = new THREE.BufferGeometry().setFromPoints([
                        annotationPoints[annotationPoints.length - 1],
                        annotationPoints[0]
                    ]);
                    
                    const closeLine = new THREE.Line(closeLineGeometry, lineMaterial);
                    annotationsGroup.add(closeLine);
                    annotationMeshes.push(closeLine);
                    
                    // Updates polygon visualization
                    updatePolygonVisualization();
                    
                    // Calls finishPolygon to complete the process
                    finishPolygon();
                }
            }
            
            return;
        }
        
        // Filter for valid intersections
        const validIntersects = intersects.filter(intersect => {
            // Skip ground plane and annotation meshes
            const obj = intersect.object;
            const isAnnotation = annotationMeshes.includes(obj);
            const isGround = obj === ground;
            
            console.log(`Object: ${obj.name || obj.type}, isAnnotation: ${isAnnotation}, isGround: ${isGround}`);
            
            return !isAnnotation && !isGround;
        });
        
        console.log("Valid intersections:", validIntersects.length);
        
        if (validIntersects.length > 0) {
            const intersectionPoint = validIntersects[0].point.clone();
            
            console.log("Added point at:", intersectionPoint);
            
            // Adds point to our list
            annotationPoints.push(intersectionPoint);
            
            // Creates visual point
            const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
            pointMesh.position.copy(intersectionPoint);
            annotationsGroup.add(pointMesh);
            annotationMeshes.push(pointMesh);
            
            // If we have at least two points, draw a line
            if (annotationPoints.length >= 2) {
                const lastIndex = annotationPoints.length - 1;
                
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    annotationPoints[lastIndex - 1],
                    annotationPoints[lastIndex]
                ]);
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                annotationsGroup.add(line);
                annotationMeshes.push(line);
            }
            
            // Updates polygon visualization
            updatePolygonVisualization();
            
            // Show sindicator when near the first point (if we have at least 2 points)
            if (annotationPoints.length >= 3) {
                const firstPoint = annotationPoints[0];
                const lastPoint = annotationPoints[annotationPoints.length - 1];
                const distance = firstPoint.distanceTo(lastPoint);
                
                // If we're getting close to the first point
                if (distance < 40) {
                    // Remove previous indicator if it exists
                    if (closeIndicator) {
                        annotationsGroup.remove(closeIndicator);
                    }
                    
                    // Create a visual indicator
                    const indicatorGeometry = new THREE.RingGeometry(5, 7, 16);
                    const indicatorMaterial = new THREE.MeshBasicMaterial({ 
                        color: 0xffff00, 
                        side: THREE.DoubleSide 
                    });
                    closeIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
                    closeIndicator.position.copy(firstPoint);
                    // Rotate to face camera
                    closeIndicator.lookAt(camera.position);
                    annotationsGroup.add(closeIndicator);
                } else if (closeIndicator) {
                    // Remove indicator if we're not close
                    annotationsGroup.remove(closeIndicator);
                    closeIndicator = null;
                }
            }
            
            // Checks if we should auto-close the polygon
            if (annotationPoints.length >= 3) {
                // Checks if the last point is close to the first point
                const firstPoint = annotationPoints[0];
                const lastPoint = annotationPoints[annotationPoints.length - 1];
                
                // Calculates distance between first and last point
                const distance = firstPoint.distanceTo(lastPoint);
                
                // If they're closer than 20 units, auto-close the polygon
                if (distance < 20) {
                    console.log("Auto-closing polygon - last point is close to first point");
                    
                    // Removes the last point (it's too close to the first one)
                    annotationPoints.pop();
                    
                    // Removes the last visual point
                    const lastPointMesh = annotationMeshes.pop();
                    annotationsGroup.remove(lastPointMesh);
                    
                    // Removes the last line
                    const lastLine = annotationMeshes.pop();
                    annotationsGroup.remove(lastLine);
                    
                    // Instead, creates a line from the second-to-last point to the first point
                    const closeLineGeometry = new THREE.BufferGeometry().setFromPoints([
                        annotationPoints[annotationPoints.length - 1],
                        annotationPoints[0]
                    ]);
                    
                    const closeLine = new THREE.Line(closeLineGeometry, lineMaterial);
                    annotationsGroup.add(closeLine);
                    annotationMeshes.push(closeLine);
                    
                    // Updates polygon visualization
                    updatePolygonVisualization();
                    
                    // Calls finishPolygon to complete the process
                    finishPolygon();
                }
            }
        } else {
            console.log("No valid intersection found - all intersections were with ground or annotations");
            
            // As a fallback, create a point at a fixed distance from the camera
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = 300; // Fixed distance
            const position = camera.position.clone().add(dir.multiplyScalar(distance));
            
            console.log("Creating fallback point at:", position);
            
            // Adds point to our list
            annotationPoints.push(position);
            
            // Creates visual point
            const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
            pointMesh.position.copy(position);
            annotationsGroup.add(pointMesh);
            annotationMeshes.push(pointMesh);
            
            // If we have at least two points, draw a line
            if (annotationPoints.length >= 2) {
                const lastIndex = annotationPoints.length - 1;
                
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    annotationPoints[lastIndex - 1],
                    annotationPoints[lastIndex]
                ]);
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                annotationsGroup.add(line);
                annotationMeshes.push(line);
            }
            
            // Updates polygon visualization
            updatePolygonVisualization();
            
            // Shows indicator when near the first point (if we have at least 2 points)
            if (annotationPoints.length >= 3) {
                const firstPoint = annotationPoints[0];
                const lastPoint = annotationPoints[annotationPoints.length - 1];
                const distance = firstPoint.distanceTo(lastPoint);
                
                // If we're getting close to the first point
                if (distance < 40) {
                    // Remove previous indicator if it exists
                    if (closeIndicator) {
                        annotationsGroup.remove(closeIndicator);
                    }
                    
                    // Creates a visual indicator
                    const indicatorGeometry = new THREE.RingGeometry(5, 7, 16);
                    const indicatorMaterial = new THREE.MeshBasicMaterial({ 
                        color: 0xffff00, 
                        side: THREE.DoubleSide 
                    });
                    closeIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
                    closeIndicator.position.copy(firstPoint);
                    // Rotates to face camera
                    closeIndicator.lookAt(camera.position);
                    annotationsGroup.add(closeIndicator);
                } else if (closeIndicator) {
                    // Removes indicator if we're not close
                    annotationsGroup.remove(closeIndicator);
                    closeIndicator = null;
                }
            }
            
            // Checks if we should auto-close the polygon
            if (annotationPoints.length >= 3) {
                // Checks if the last point is close to the first point
                const firstPoint = annotationPoints[0];
                const lastPoint = annotationPoints[annotationPoints.length - 1];
                
                // Calculates distance between first and last point
                const distance = firstPoint.distanceTo(lastPoint);
                
                // If they're closer than 20 units, auto-close the polygon
                if (distance < 20) {
                    console.log("Auto-closing polygon - last point is close to first point");
                    
                    // Removes the last point (it's too close to the first one)
                    annotationPoints.pop();
                    
                    // Removes the last visual point
                    const lastPointMesh = annotationMeshes.pop();
                    annotationsGroup.remove(lastPointMesh);
                    
                    // Removes the last line
                    const lastLine = annotationMeshes.pop();
                    annotationsGroup.remove(lastLine);
                    
                    // Instead, creates a line from the second-to-last point to the first point
                    const closeLineGeometry = new THREE.BufferGeometry().setFromPoints([
                        annotationPoints[annotationPoints.length - 1],
                        annotationPoints[0]
                    ]);
                    
                    const closeLine = new THREE.Line(closeLineGeometry, lineMaterial);
                    annotationsGroup.add(closeLine);
                    annotationMeshes.push(closeLine);
                    updatePolygonVisualization();
                    finishPolygon();
                }
            }
        }
    }
    
    function updatePolygonVisualization() {
        // Only create polygon if we have at least 3 points
        if (annotationPoints.length < 3) return;
        
        // If we already have a polygon, remove it
        if (currentPolygon) {
            annotationsGroup.remove(currentPolygon);
            const index = annotationMeshes.indexOf(currentPolygon);
            if (index !== -1) {
                annotationMeshes.splice(index, 1);
            }
        }
        
        try {
            // Creates a shape from points
            const shape = new THREE.Shape();
            
            // Moves to first point
            shape.moveTo(annotationPoints[0].x, annotationPoints[0].z);
            
            // Adds lines to remaining points
            // Note: We're using x and z coordinates to make the shape flat on the xz plane
            for (let i = 1; i < annotationPoints.length; i++) {
                shape.lineTo(annotationPoints[i].x, annotationPoints[i].z);
            }
            
            // Closes the shape
            shape.lineTo(annotationPoints[0].x, annotationPoints[0].z);
            
            // Creates geometry from shape
            const geometry = new THREE.ShapeGeometry(shape);
            
            // Rotates geometry to align with the xz plane
            geometry.rotateX(Math.PI / 2);
            // Creates mesh
            currentPolygon = new THREE.Mesh(geometry, polygonMaterial);
            currentPolygon.name = "currentPolygon";
            
            // Adjusts y position based on average y of points
            const avgY = annotationPoints.reduce((sum, p) => sum + p.y, 0) / annotationPoints.length;
            currentPolygon.position.y = avgY;
            
            // Adds to scene
            annotationsGroup.add(currentPolygon);
            annotationMeshes.push(currentPolygon);
        } catch (error) {
            console.error("Error creating polygon:", error);
        }
    }
    
    function finishPolygon() {
        console.log("Finishing polygon");
        if (annotationMode !== 'drawing' || annotationPoints.length < 3) {
            console.log("Cannot finish: not in drawing mode or not enough points");
            return;
        }
        
        // Removes close indicator if it exists
        if (closeIndicator) {
            annotationsGroup.remove(closeIndicator);
            closeIndicator = null;
        }
        
        // Make sure there's a line connecting the last point to the first
        const lastIndex = annotationPoints.length - 1;
        
        // Checks if we already have a closing line
        let needClosingLine = true;
        for (let i = 0; i < annotationMeshes.length; i++) {
            const mesh = annotationMeshes[i];
            if (mesh.isLine) {
                // Checks if this line connects the last and first points
                const positions = mesh.geometry.attributes.position.array;
                const start = new THREE.Vector3(positions[0], positions[1], positions[2]);
                const end = new THREE.Vector3(positions[3], positions[4], positions[5]);
                
                const isFirstPoint = (start.distanceTo(annotationPoints[0]) < 0.1 || 
                                    end.distanceTo(annotationPoints[0]) < 0.1);
                const isLastPoint = (start.distanceTo(annotationPoints[lastIndex]) < 0.1 || 
                                    end.distanceTo(annotationPoints[lastIndex]) < 0.1);
                
                if (isFirstPoint && isLastPoint) {
                    needClosingLine = false;
                    break;
                }
            }
        }
        
        // Adds closing line if needed
        if (needClosingLine) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                annotationPoints[lastIndex],
                annotationPoints[0]
            ]);
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            annotationsGroup.add(line);
            annotationMeshes.push(line);
        }
        
        // Updates polygon visualization one last time
        updatePolygonVisualization();
        
        // Switchs mode
        annotationMode = 'idle';
        controls.enabled = true; // Re-enable orbit controls
        
        // Updates button text if it exists
        const drawButton = document.getElementById('draw-button');
        if (drawButton) {
            drawButton.textContent = 'Start Drawing Polygon';
        }
    }
    
    function extrudePolygon() {
        console.log("Extruding polygon");
        if (annotationPoints.length < 3 || !currentPolygon) {
            console.log("Cannot extrude: not enough points or no polygon");
            return;
        }
        
        // If we already have an extruded polygon, remove it
        if (currentExtrudedPolygon) {
            annotationsGroup.remove(currentExtrudedPolygon);
            const index = annotationMeshes.indexOf(currentExtrudedPolygon);
            if (index !== -1) {
                annotationMeshes.splice(index, 1);
            }
        }
        
        try {
            // Creates a shape from points
            const shape = new THREE.Shape();
            
            // Calculates the center of the polygon for scaling
            const center = new THREE.Vector2(0, 0);
            for (let i = 0; i < annotationPoints.length; i++) {
                center.x += annotationPoints[i].x;
                center.y += annotationPoints[i].z;
            }
            center.x /= annotationPoints.length;
            center.y /= annotationPoints.length;
            
            // Moves to first point with scaling
            const firstPoint = new THREE.Vector2(
                center.x + (annotationPoints[0].x - center.x) * scaleX,
                center.y + (annotationPoints[0].z - center.y) * scaleZ
            );
            shape.moveTo(firstPoint.x, firstPoint.y);
            
            // Adds lines to remaining points with scaling
            for (let i = 1; i < annotationPoints.length; i++) {
                const scaledPoint = new THREE.Vector2(
                    center.x + (annotationPoints[i].x - center.x) * scaleX,
                    center.y + (annotationPoints[i].z - center.y) * scaleZ
                );
                shape.lineTo(scaledPoint.x, scaledPoint.y);
            }
            
            // Closes the shape
            shape.lineTo(firstPoint.x, firstPoint.y);
            
            // Extrusion settings
            const extrudeSettings = {
                steps: 1,
                depth: extrusionHeight,
                bevelEnabled: false
            };
            
            // Creates extruded geometry
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            
            // Rotate geometry to align with the xz plane
            geometry.rotateX(Math.PI / 2);
            
            // Create mesh
            currentExtrudedPolygon = new THREE.Mesh(geometry, extrudedMaterial);
            currentExtrudedPolygon.name = "extrudedPolygon";
            
            // Calculates position based on direction and offset
            const avgY = annotationPoints.reduce((sum, p) => sum + p.y, 0) / annotationPoints.length;
            
            let positionY;
            if (extrusionDirection === -1) {
                // Extrudes downward from points
                positionY = avgY - extrusionOffset;
            } else if (extrusionDirection === 1) {
                // Extrudes upward from points
                positionY = avgY - extrusionHeight + extrusionOffset;
            } else {
                // Extrudes centered on points
                positionY = avgY - (extrusionHeight / 2) + extrusionOffset;
            }
            
            currentExtrudedPolygon.position.y = positionY;
            
            // Adds to scene
            annotationsGroup.add(currentExtrudedPolygon);
            annotationMeshes.push(currentExtrudedPolygon);
            
            // Saves annotation (just console.log in this example)
            saveAnnotation();
        } catch (error) {
            console.error("Error extruding polygon:", error);
        }
    }
    
    function updateExtrusion() {
        if (!currentExtrudedPolygon) return;
        
        try {
            // Removes current extruded polygon
            annotationsGroup.remove(currentExtrudedPolygon);
            const index = annotationMeshes.indexOf(currentExtrudedPolygon);
            if (index !== -1) {
                annotationMeshes.splice(index, 1);
            }
            
            // Creates a shape from points
            const shape = new THREE.Shape();
            
            // Calculates the center of the polygon for scaling
            const center = new THREE.Vector2(0, 0);
            for (let i = 0; i < annotationPoints.length; i++) {
                center.x += annotationPoints[i].x;
                center.y += annotationPoints[i].z;
            }
            center.x /= annotationPoints.length;
            center.y /= annotationPoints.length;
            
            // Moves to first point with scaling
            const firstPoint = new THREE.Vector2(
                center.x + (annotationPoints[0].x - center.x) * scaleX,
                center.y + (annotationPoints[0].z - center.y) * scaleZ
            );
            shape.moveTo(firstPoint.x, firstPoint.y);
            
            // Adds lines to remaining points with scaling
            for (let i = 1; i < annotationPoints.length; i++) {
                const scaledPoint = new THREE.Vector2(
                    center.x + (annotationPoints[i].x - center.x) * scaleX,
                    center.y + (annotationPoints[i].z - center.y) * scaleZ
                );
                shape.lineTo(scaledPoint.x, scaledPoint.y);
            }
            
            // Closes the shape
            shape.lineTo(firstPoint.x, firstPoint.y);
            
            // Extrusions settings
            const extrudeSettings = {
                steps: 1,
                depth: extrusionHeight,
                bevelEnabled: false
            };
            
            // Creates extruded geometry
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            
            // Rotates geometry to align with the xz plane
            geometry.rotateX(Math.PI / 2);
            
            // Creates mesh
            currentExtrudedPolygon = new THREE.Mesh(geometry, extrudedMaterial);
            currentExtrudedPolygon.name = "extrudedPolygon";
            
            // Calculates position based on direction and offset
            const avgY = annotationPoints.reduce((sum, p) => sum + p.y, 0) / annotationPoints.length;
            
            let positionY;
            if (extrusionDirection === -1) {
                // Extrudes downward from points
                positionY = avgY - extrusionOffset;
            } else if (extrusionDirection === 1) {
                // Extrudes upward from points
                positionY = avgY - extrusionHeight + extrusionOffset;
            } else {
                // Extrudes centered on points
                positionY = avgY - (extrusionHeight / 2) + extrusionOffset;
            }
            
            currentExtrudedPolygon.position.y = positionY;
            
            // Adds to scene
            annotationsGroup.add(currentExtrudedPolygon);
            annotationMeshes.push(currentExtrudedPolygon);
        } catch (error) {
            console.error("Error updating extrusion:", error);
        }
    }
    
    function resetAnnotations() {
        console.log("Resetting annotations");
        // Clears all annotation points and meshes
        annotationPoints = [];
        
        // Removes all annotation meshes from scene
        for (const mesh of annotationMeshes) {
            annotationsGroup.remove(mesh);
        }
        
        // Removes close indicator if it exists
        if (closeIndicator) {
            annotationsGroup.remove(closeIndicator);
            closeIndicator = null;
        }
        
        annotationMeshes = [];
        currentPolygon = null;
        currentExtrudedPolygon = null;
    }
    
    // Saves annotation 
    function saveAnnotation() {
        const annotationData = {
            points: annotationPoints.map(p => ({ x: p.x, y: p.y, z: p.z })),
            extrusionHeight: extrusionHeight,
            extrusionDirection: extrusionDirection,
            extrusionOffset: extrusionOffset,
            scaleX: scaleX,
            scaleZ: scaleZ
        };
        
        console.log('Annotation data saved:', annotationData);
    }
    
    // Event Listeners
    renderer.domElement.addEventListener('click', (event) => {
        // Only handle clicks if we're in drawing mode
        console.log("Click detected, annotation mode:", annotationMode);
        if (annotationMode === 'drawing') {
            addAnnotationPoint(event);
        }
    });
    
    // Window resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
}

// Start the application
model();