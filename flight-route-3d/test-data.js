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
        id: "waypoint",
        type: "FeatureCollection",
        features: [
            {
                id: "waypoint-drawn1",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98834605636421, 39.739328325790666],
                    type: "Point",
                },
            },
            {
                id: "waypoint-drawn2",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98800650565032, 39.73939646711008],
                    type: "Point",
                },
            },
            {
                id: "waypoint-drawn3",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98782806425507, 39.739303360174034],
                    type: "Point",
                },
            },
            {
                id: "waypoint-drawn4",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98697406222989, 39.73929898251856],
                    type: "Point",
                },
            },
        ],
    },
};
