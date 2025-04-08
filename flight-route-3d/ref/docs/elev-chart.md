```js
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
( async () => {
    const map = new mapboxgl.Map( {
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
        bounds: [-71.4, 44.36, -71.08, 44.25279]
    } );

    // default start and end point are defined as a geoJSON LineString
    const lineData = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [-71.328053, 44.313497],
                [-71.12971, 44.25279]
            ]
        },
        properties: {}
    };

    map.on( 'style.load', () => {
        // add source and layer for rendering the line
        map.addSource( 'line-data', {
            type: 'geojson',
            data: lineData
        } );

        map.addLayer( {
            id: 'line-line-data',
            type: 'line',
            source: 'line-data',
            paint: {
                'line-width': 4,
                'line-color': '#37a2eb'
            }
        } );

        // add the digital elevation model tiles
        map.addSource( 'mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 20
        } );
        map.setTerrain( { 'source': 'mapbox-dem', 'exaggeration': 1 } );

        // add draggable markers
        const marker0 = new mapboxgl.Marker( {
            draggable: true,
            color: '#83f7a0'
        } )
            .setLngLat( lineData.geometry.coordinates[0] )
            .addTo( map );

        const marker1 = new mapboxgl.Marker( {
            draggable: true,
            color: '#ed6461'
        } )
            .setLngLat( lineData.geometry.coordinates[1] )
            .addTo( map );

        // as the user drags a marker, update the data for the line and re-render it with setData()
        const updateLineData = ( e, position ) => {
            const { lng, lat } = e.target.getLngLat();
            lineData.geometry.coordinates[position] = [lng, lat];
            map.getSource( 'line-data' ).setData( lineData );
        };

        marker0.on( 'drag', ( e ) => {
            updateLineData( e, 0 );
        } );
        marker0.on( 'dragend', updateElevationProfile );

        marker1.on( 'drag', ( e ) => {
            updateLineData( e, 1 );
        } );
        marker1.on( 'dragend', updateElevationProfile );
    } );

    const myLineChart = new Chart( document.getElementById( 'chart-canvas' ), {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    align: 'start',
                    text: 'Elevation (m)'
                }
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: 0,
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            layout: {
                padding: {
                    top: 6,
                    right: 20,
                    bottom: -10,
                    left: 20
                }
            }
        }
    } );

    function updateElevationProfile() {
        // split the line into 1km segments
        const chunks = turf.lineChunk( lineData, 1 ).features;

        // get the elevation for the leading coordinate of each segment
        const elevations = [
            ...chunks.map( ( feature ) => {
                return map.queryTerrainElevation(
                    feature.geometry.coordinates[0]
                );
            } ),
            // do not forget the last coordinate
            map.queryTerrainElevation(
                chunks[chunks.length - 1].geometry.coordinates[1]
            )
        ];

        // add dummy labels
        myLineChart.data.labels = elevations.map( () => '' );
        myLineChart.data.datasets[0] = {
            data: elevations,
            fill: false,
            tension: 0.4
        };
        myLineChart.update();
    }

    // trigger the first chart draw after the DEM tiles have loaded
    await map.once( 'idle' );
    updateElevationProfile();
} )();
```
