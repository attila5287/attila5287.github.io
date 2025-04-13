#  Turf.JS geospatial data analysis tool with javascript

`Turf uses GeoJSON for all geographic data. Turf expects the data to be standard WGS84 longitude, latitude coordinates. Check out geojson.io for a tool to easily create this data.`

```JS
// Note order: longitude, latitude.
var point1 = turf.point([-73.988214, 40.749128]);

var point2 = {
  type: "Feature",
  geometry: {
    type: "Point",
    // Note order: longitude, latitude.
    coordinates: [-73.988214, 40.749128],
  },
  properties: {},
};
```

```JS

```

```JS
var locationA = turf.point([-75.343, 39.984], { name: "Location A" });
var locationB = turf.point([-75.833, 39.284], { name: "Location B" });
var locationC = turf.point([-75.534, 39.123], { name: "Location C" });

var collection = turf.featureCollection([locationA, locationB, locationC]);

//=collection
```

```JS
var geometry = {
  type: "Point",
  coordinates: [110, 50],
};

var feature = turf.feature(geometry);

//=feature
```

Takes a Feature and a bbox and clips the feature to the bbox using lineclip. May result in degenerate edges when clipping Polygons.

```JS
Takes a Feature and a bbox and clips the feature to the bbox using lineclip. May result in degenerate edges when clipping Polygons.
```
Takes a Point and calculates the location of a destination point given a distance in degrees, radians, miles, or kilometers; and bearing in degrees. This uses the Haversine formula to account for global curvature.
```JS

var destination = turf.destination(point, distance, bearing, options);
```

```JS
var options = { units: "miles" };

var along = turf.along(line, 200, options);
```
Takes a LineString and returns a Point at a specified distance along the line.
```JS
turf.cleanCoords(line).geometry.coordinates

turf.cleanCoords(multiPoint).geometry.coordinates;


```


```JS

turf.round(120.4321, 2);
```

```JS

var curved = turf.bezierSpline(line);
```

```JS

var translatedPoly = turf.transformTranslate(poly, 100, 35);
```


```JS
turf.point(): Create GeoJSON points, specifying coordinates and optional properties. 
```
```JS
turf.lineString(): Create GeoJSON lines from arrays of coordinates. 
```

```JS
turf.polygon(): Create GeoJSON polygons, ensuring at least 4 coordinate pairs for closed shapes. 
```

```JS
turf.featureCollection(): Create a FeatureCollection, a container for multiple GeoJSON features. 
```

```JS
turf.buffer(): Use this function to create a buffer around a feature. 
```

```JS
turf.union(): Merge multiple features into a single GeoJSON. 
```


```JS
turf.merge(): Combines a collection of polygons into a single multipolygon. 
```