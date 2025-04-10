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
                            [-104.98880577159332, 39.73931234424225],
                            [-104.9888047909794, 39.739474425443774],
                            [-104.98889877496177, 39.739474389236506],
                            [-104.98890000860759, 39.73931432060394],
                            [-104.98880577159332, 39.73931234424225],
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
                            [-104.98896674950852, 39.73912645283187],
                            [-104.98946986603366, 39.73913859698544],
                            [-104.9897045033536, 39.739365865964174],
                            [-104.98915626542545, 39.7393676004568],
                            [-104.98896674950852, 39.73912645283187],
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
                        [-104.98868933367768, 39.739292666320125],
                        [-104.9883717991386, 39.739218068040856],
                    ],
                },
            },
        ],
    },
    waypoint: {
        type: "FeatureCollection",
        features: [
            {
                id: "waypoint-drawn0",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98833605697591, 39.73920584798282],
                    type: "Point",
                },
            },
            {
                id: "waypoint-drawn1",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98822709052405, 39.73924307111167],
                    type: "Point",
                },
            },
            {
                id: "waypoint-drawn2",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98819490822522, 39.73937299253359],
                    type: "Point",
                },
            },
            {
                id: "waypoint-drawn3",
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: [-104.98806349717078, 39.73944929547727],
                    type: "Point",
                },
            },
        ],
    },
};
