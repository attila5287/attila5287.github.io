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
							[-104.98937377254047, 39.739529099736046],
							[-104.98939278888022, 39.73959458942298],
							[-104.98921408596428, 39.73961237327589],
							[-104.98921255939582, 39.73983428147409],
							[-104.98988152559114, 39.73982736162651],
							[-104.98989793263199, 39.7396137421585],
							[-104.98968902506329, 39.739616480170724],
							[-104.9896960981715, 39.73954135824394],
							[-104.98937377254047, 39.739529099736046],
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
						[-104.98872762611701, 39.73941031151935],
						[-104.98892146570941, 39.73914624529985],
						[-104.9883443285896, 39.73898023580185],
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
