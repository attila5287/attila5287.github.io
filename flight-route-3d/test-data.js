"use strict";
export const testData = {
    geo: {
        id: "geo",
        type: "FeatureCollection",
        features: [
            {
                id: "geo-drawn",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [
                        [
                            [-104.98889877496177, 39.739474389236506],
                            [-104.98890000860759, 39.73931432060394],
                            [-104.98880577159332, 39.73931234424225],
                            [-104.9888047909794, 39.739474425443774],
                            [-104.98889877496177, 39.739474389236506],
                        ],
                    ],
                    type: "Polygon",
                },
            },
        ],
    },
    area: {
        id: "area",
        type: "FeatureCollection",
        features: [
            {
                id: "area-drawn",
                type: "Feature",
                geometry: {
                    coordinates: [
                        [
                            [-104.98895966911624, 39.739127477417554],
                            [-104.9889628866544, 39.7393657483791],
                            [-104.9900532913049, 39.73939446195533],
                            [-104.99007932653677, 39.73903894589199],
                            [-104.98978810054138, 39.73913234625164],
                            [-104.98895966911624, 39.739127477417554],
                        ],
                    ],
                    type: "Polygon",
                },
            },
        ],
    },
    slope: {
        id: "slope",
        type: "FeatureCollection",
        features: [
            {
                id: "slope-drawn",
                type: "Feature",
                type: "LineString",
                geometry: {
                    coordinates: [
                        [-104.98864176620461, 39.73931952182821],
                        [-104.98869714053178, 39.73950633067312],
                    ],
                },
            },
        ],
    },
    waypoint: {
        type: "FeatureCollection",
        features: [
            {
                id: "waypoint-drawn1",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98856871853614, 39.73919693270284],
                    type: "Point",
                },
            },
            {
                id: "waypoint-drawn2",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98847391745613, 39.73937595664805],
                    type: "Point",
                },
            },
            {
                id: "waypoint-drawn3",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.9883284111343, 39.739505739705805],
                    type: "Point",
                },
            },
        ],
    },
};
