```js
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
```