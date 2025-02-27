# 3D Polygon Annotation Tool

A web-based tool for creating, manipulating, and visualizing 3D polygonal annotations around 3D models.

![3D Polygon Annotation Tool](https://via.placeholder.com/800x400?text=3D+Polygon+Annotation+Tool)

## Features

- Draw 2D polygons by placing points around 3D models
- Auto-close polygons when returning to the starting point
- Extrude 2D polygons into 3D volumes
- Precise control over extrusion parameters:
  - Height
  - Direction (upward, downward, centered)
  - Vertical offset
  - Width and depth scaling
- Visual indicators for user guidance
- Fallback model when no 3D model is provided

## Getting Started

### Prerequisites

- A modern web browser with WebGL support
- Basic HTTP server (like Python's SimpleHTTPServer, Node.js http-server, or VS Code Live Server)

### Installation

1. Clone or download this repository
2. Create the following file structure:
```
your-project/
├── index.html
├── model.js
└── models/        (optional - for your 3D models)
```
3. Copy the provided HTML and JavaScript code into the respective files
4. Start your local web server
5. Open the application in your browser

### Basic Usage

1. **Initialization**: Load the webpage in your browser
2. **Draw Polygon**: Click "Start Drawing Polygon" and place points around the model
3. **Close Polygon**: Return to near the first point to auto-close, or click "Finish Polygon"
4. **Extrude**: Click "Extrude Polygon" to create a 3D volume
5. **Adjust**: Use the sliders to fit the 3D polygon precisely around the model
6. **Reset**: If needed, click "Reset" to start over

## Controls

The interface provides several controls for creating and adjusting annotations:

### Buttons

- **Start Drawing Polygon**: Enters annotation mode
- **Finish Polygon**: Completes the current polygon (also triggered by auto-close)
- **Extrude Polygon**: Creates a 3D volume from the 2D polygon
- **Reset**: Clears all annotations and starts over

### Sliders

- **Extrusion Height**: Controls how tall the 3D extrusion is
- **Extrusion Vertical Offset**: Adjusts the vertical position of the extrusion
- **Width Scale (X)**: Scales the annotation along the X-axis
- **Depth Scale (Z)**: Scales the annotation along the Z-axis

### Dropdown

- **Extrusion Direction**: Controls which way the extrusion extends
  - Extrude Downward: Extends from the points downward
  - Extrude Centered: Centers the extrusion on the points
  - Extrude Upward: Extends from the points upward

## Code Structure

The application consists of two main files:

### index.html

Contains the HTML structure, CSS styling, and imports the necessary JavaScript libraries:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>3D Polygon Annotation Tool</title>
    <!-- CSS styling -->
    <!-- Import maps for Three.js -->
</head>
<body>
    <!-- UI controls -->
    <!-- Instructions -->
    <script type="module" src="model.js"></script>
</body>
</html>
```

### model.js

Contains all the JavaScript code for the 3D scene, annotations, and user interactions:

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function model() {
    // Scene setup
    // Annotation variables and functions
    // Event listeners
    // Animation loop
}

// Start the application
model();
```

## Key Components

### 1. Annotation System

The core of the tool is the annotation system that handles:

- Point placement on 3D models using raycasting
- Connecting points with lines
- Creating a 2D polygon from points
- Extruding the polygon into 3D
- Scaling and positioning the 3D extrusion

### 2. Auto-Closing Mechanism

The tool features an intelligent auto-closing mechanism:

```javascript
// When the last point is near the first point
if (distance < 20) {
    // Remove the last point
    // Connect the second-to-last point to the first
    // Update polygon visualization
    // Finish the polygon
}
```

### 3. Scaling System

The scaling system allows precise fitting around models:

```javascript
// Calculate center point
// For each point in the polygon:
const scaledPoint = new THREE.Vector2(
    center.x + (point.x - center.x) * scaleX,
    center.y + (point.z - center.y) * scaleZ
);
```

### 4. Extrusion Control

The tool provides complete control over the extrusion:

```javascript
// Based on direction and offset
let positionY;
if (extrusionDirection === -1) {
    // Extrude downward
} else if (extrusionDirection === 1) {
    // Extrude upward
} else {
    // Extrude centered
}
```

## Customization

### Loading Custom Models

To use your own 3D models:

1. Place your GLTF/GLB file in the `models/` directory
2. Update the model path in the GLTFLoader:

```javascript
gltfLoader.load('models/your-model.glb', (gltf) => {
    // Model loaded successfully
});
```

### Adjusting Default Parameters

You can modify the default annotation parameters:

```javascript
// Default values
let extrusionHeight = 50;
let extrusionOffset = 0;
let extrusionDirection = -1;
let scaleX = 1.0;
let scaleZ = 1.0;
```

### Changing Visual Appearance

Customize the appearance of annotations:

```javascript
// Materials
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const polygonMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x3366ff, 
    transparent: true, 
    opacity: 0.5 
});
```

## Backend Integration

The code includes a `saveAnnotation` function that can be modified to send data to a server:

```javascript
function saveAnnotation() {
    const annotationData = {
        points: annotationPoints.map(p => ({ x: p.x, y: p.y, z: p.z })),
        extrusionHeight: extrusionHeight,
        extrusionDirection: extrusionDirection,
        extrusionOffset: extrusionOffset,
        scaleX: scaleX,
        scaleZ: scaleZ
    };
    
    // Currently just logs to console
    console.log('Annotation data saved:', annotationData);
    
    // To send to server:
    // fetch('http://your-server/api/annotations', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(annotationData)
    // });
}
```


## Technologies Used

- [Three.js](https://threejs.org/) - 3D JavaScript library
- [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) - For loading 3D models
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls) - For camera navigation