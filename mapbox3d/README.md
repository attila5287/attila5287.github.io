Mapbox Three.JS Documentation Boilerplate Template

# 01 Mapbox Documentation Basic
## 01.1 HTML part of template
```HTML
<!DOCTYPE html>
<html lang="en" dir="ltr">
   <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <title>Title</title>
       <link href="https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.css" rel="stylesheet">
        <script src="https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.js"></script>
        <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
        </style>
   </head>
   
   <body>
   </body>
</html> 
```
## 01.2 JS part of template
```JS
mapboxgl.accessToken = '';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [ -104.985302, 39.740326 ], // St Services Bldg
    zoom: 18,
    pitch:50,
    bearing:30,
});
```

# 02 Mapbox Documentation Final
## 02.1 Mapbox Doc: Disable Cam Ctrls
https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
```JS
const handlers = [
    "scrollZoom",
    "boxZoom",
    "dragRotate",
    "dragPan",
    "keyboard",
    "doubleClickZoom",
    "touchZoomRotate",
];
handlers.forEach((d) => map[d].disable());

```
```HTML
<nav id="listing-group" class="listing-group">
    <input type="checkbox" id="scrollZoom" />
    <label for="scrollZoom">Scroll zoom</label>
    <input type="checkbox" id="boxZoom" />
    <label for="boxZoom">Box zoom</label>
    <input type="checkbox" id="dragRotate" />
    <label for="dragRotate">Drag rotate</label>
    <input type="checkbox" id="dragPan" />
    <label for="dragPan">Drag pan</label>
    <input type="checkbox" id="keyboard" />
    <label for="keyboard">Keyboard</label>
    <input type="checkbox" id="doubleClickZoom" />
    <label for="doubleClickZoom">DblClk zoom</label>
    <input type="checkbox" id="touchZoomRotate" />
    <label for="touchZoomRotate">Touch Zoom Rotate</label>
</nav>
```

```CSS
.listing-group {
font: 11px/16px "Fantasque Sans Mono", Arial, Helvetica, sans-serif;
font-weight: 400;
font-style: italic;
position: absolute;
top: 5px;
right: 5px;
z-index: 1;
border-radius: 1px;
max-width: 20%;
color: #fff;
}

.listing-group input[type="checkbox"]:first-child + label {
border-radius: 3px 3px 0 0;
}

.listing-group label:last-child {
border-radius: 0 0 3px 3px;
border: none;
}

.listing-group input[type="checkbox"] {
display: none;
}

.listing-group input[type="checkbox"] + label {
background-color: #3386c0;
display: block;
cursor: pointer;
padding: 10px;
border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.listing-group input[type="checkbox"] + label {
background-color: #3386c0;
text-transform: capitalize;
}

.listing-group input[type="checkbox"] + label:hover,
.listing-group input[type="checkbox"]:checked + label {
background-color: #4ea0da;
}

.listing-group input[type="checkbox"]:checked + label:before {
content: "✔";
margin-right: 5px;
}
```
## 02.2 Mapbox Doc: Mouse Coordinates
https://docs.mapbox.com/mapbox-gl-js/example/mouse-position/
```css
#info {
    display: table;
    position: relative;
    margin: 0px auto;
    word-wrap: anywhere;
    white-space: pre-wrap;
    padding: 10px;
    border: none;
    border-radius: 3px;
    font-size: 12px;
    text-align: center;
    color: #222;
    background: #fff;
}
```
```html
<pre id="info"></pre>
```
```JS
map.on('mousemove', (e) => {
    document.getElementById('info').innerHTML =
        // `e.point` is the x, y coordinates of the `mousemove` event
        // relative to the top-left corner of the map.
        JSON.stringify(e.point) +
        '<br />' +
        // `e.lngLat` is the longitude, latitude geographical position of the event.
        JSON.stringify(e.lngLat.wrap());
});
```
## 02.3 Mapbox Doc: Add a 3-d Model
```html
<script src="https://unpkg.com/three@0.126.0/build/three.min.js"></script>
<script src="https://unpkg.com/three@0.126.0/examples/js/loaders/GLTFLoader.js"></
<script src="https://unpkg.com/three@0.126.0/examples/js/loaders/DRACOLoader.js"></
```
