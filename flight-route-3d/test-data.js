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
						[-104.9890505253979, 39.73934229970274],
						[-104.98895472324512, 39.739218116228955],
						[-104.98850308452633, 39.73918654412361],
					],
				},
			},
		],
	},
	waypoint: {
		type: "FeatureCollection",
		features: [
			{
				id: "qYftL2gBP4s2Gq4J1bugGPEqMOBYgMJx",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.9884559540231, 39.73917341215039],
					type: "Point",
				},
			},
			{
				id: "7UULuodjaBJMb72muL4R0P07GvMyILTF",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.988114199535, 39.73904261892682],
					type: "Point",
				},
			},
			{
				id: "1HV2SGdaprGMcvIot8KmMiF0FoygJTkR",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.98827533129328, 39.73928299585319],
					type: "Point",
				},
			},
			{
				id: "ROwbvX6KJLjka8l5IcUmbcczEUDXD2Hv",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.98790970565379, 39.73917536819383],
					type: "Point",
				},
			},
			{
				id: "COKSeoDUjAj8yeyVjau90e0v35ZuyBty",
				type: "Feature",
				properties: {},
				geometry: {
					coordinates: [-104.98822617185245, 39.73949181329584],
					type: "Point",
				},
			},
		],
	},
};
