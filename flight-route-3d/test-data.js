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
							[-104.98881326473402, 39.73920871530939],
							[-104.98839605462733, 39.73907142450156],
					],
				},
			},
		],
	},
	waypoint: {
		type: "FeatureCollection",
		features: [
			{
				id: "2lNwYiRH3w94iUxFIhHhTxtg9uev09vY",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.9883363062525, 39.73916544140897],
					type: "Point",
				},
			},
			{
				id: "dsZlveKqeu4ieLN62gqyqDKcQIj3z6NE",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.98807277881374, 39.73918516564379],
					type: "Point",
				},
			},
			{
				id: "w4bCp3vw5oWNKDXPXxkhwSsYgk3Cqg95",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.98830108599321, 39.73938745825862],
					type: "Point",
				},
			},
			{
				id: "mOMAWEacxBylbxL61xqy9U5x2fxm35wG",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.98795849481498, 39.73927698340856],
					type: "Point",
				},
			},
			{
				id: "NMjEvdHkiOwIBnqOuNv3zp4HYqEXfMQn",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.9881205167563, 39.73947261303269],
					type: "Point",
				},
			},
		],
	},
};
