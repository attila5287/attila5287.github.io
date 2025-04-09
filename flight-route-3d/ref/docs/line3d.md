```JS

map.on('style.load', () => {
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
    // add the DEM source as a terrain layer
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.0 });

    map.addSource('geojson', {
        'type': 'geojson',
        'lineMetrics': true,
        'data': {
            'type': 'Feature',
            'properties': {
                // add an array of elevation values.
                // the number of values doesn't need to match the number of coordinates.
                'elevation': [
                    4600, 4600, 4600, 4599, 4598, 4596, 4593, 4590, 4584,
                    4578, 4569, 4559, 4547, 4533, 4516, 4497, 4475, 4450,
                    4422, 4390, 4355, 4316, 4275, 4227, 4177, 4124, 4068,
                    4009, 3946, 3880, 3776, 3693, 3599, 3502, 3398, 3290,
                    3171, 3052, 2922, 2786, 2642, 2490, 2332, 2170, 1994,
                    1810, 1612, 1432, 1216, 1000
                ]
            },
            'geometry': {
                'coordinates': [],
                'type': 'LineString'
            }
        }
    });

    // add the elevated line layer
    map.addLayer({
        'id': 'elevated-line',
        'type': 'line',
        'source': 'geojson',
        'layout': {
            'line-z-offset': [
                'at-interpolated',
                [
                    '*',
                    ['line-progress'],
                    ['-', ['length', ['get', 'elevation']], 1]
                ],
                ['get', 'elevation']
            ],
            'line-elevation-reference': 'sea'
        },
        'paint': {
            'line-emissive-strength': 1.0,
            'line-width': 8,
            'line-color': 'royalblue'
        }
    });
});

```

