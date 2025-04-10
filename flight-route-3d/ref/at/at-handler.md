```js
function drawHandler(e) {
  const currentMode = draw.getMode();
  console.log("draw H.A.N.D.L.E.R mode:" + currentMode);
  const mode = draw.getMode();
  const userDrawn = draw.getAll();
  // console.log(userDrawn);
  
  if (userDrawn.features.length > 0) {
    map.getSource("geo-extrude-src").setData(userDrawn);
    // map.triggerRepaint();

    renderCalcbox(userDrawn);
  } else {
    renderCalcbox();
    if (e.type !== "draw.delete") {
      alert("Click the map to draw a polygon.");
    }
  }
}
```