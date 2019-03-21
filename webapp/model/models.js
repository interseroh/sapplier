sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {
		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createFLPModel: function () {
			var fnGetuser = jQuery.sap.getObject("sap.ushell.Container.getUser"),
				bIsShareInJamActive = fnGetuser ? fnGetuser().isJamActive() : false,
				oModel = new JSONModel({
					isShareInJamActive: bIsShareInJamActive
				});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createCategoryModel: function () {

			var category = {
				categorySet: [{
					"ID": "1",
					"Name": "Personal"
				}, {
					"ID": "2",
					"Name": "Umwelt"
				}, {
					"ID": "3",
					"Name": "IT"
				}, {
					"ID": "4",
					"Name": "Energie"
				}, {
					"ID": "5",
					"Name": "Dienstleistung"
				}, {
					"ID": "6",
					"Name": "Alle"
				}]
			};

			var oModel = new JSONModel(category);
			return oModel;
		},

		createLocationModel: function () {

			var location = {
				locationSet: [{
					"ID": "1",
					"Name": "randstad",
					"Navigation_Points": [],
					"Kategorie": "Personal",
					"Logo": "randstad.png"
				}, {
					"ID": "2",
					"Name": "Interseroh",
					"Navigation_Points": [],
					"Kategorie": "Umwelt",
					"Logo": "interseroh.png"

				}, {
					"ID": "3",
					"Name": "Telekom",
					"Navigation_Points": [],
					"Kategorie": "IT",
					"Logo": "telekom.png",
				}, {
					"ID": "4",
					"Name": "Open Grid Europe",
					"Navigation_Points": [],
					"Kategorie": "Energie",
					"Logo": "openGrid.png"
				}, {
					"ID": "5",
					"Name": "e-maks",
					"Navigation_Points": [],
					"Kategorie": "Dienstleistung",
					"Logo": "eMaks.png"
				}, {
					"ID": "6",
					"Name": "uniper",
					"Navigation_Points": [],
					"Kategorie": "Energie",
					"Logo": "uniPer.png"
				}]
			};

			var oModel = new JSONModel(location);
			return oModel;
		},

		createBeaconsModel: function () {

			var beacons = {
				beaconsSet: [{
					"id": "ljNl",
					"beschreibung": "Eingang",
					"cx": 129,
					"cy": 480,
					"major": 1,
					"minor": 1
				}, {
					"id": "JsOXzO",
					"beschreibung": "Säule 1",
					"cx": 106,
					"cy": 380,
					"major": 1,
					"minor": 2
				}, {
					"id": "JsGYeY",
					"beschreibung": "Säule 2",
					"cx": 106,
					"cy": 312,
					"major": 1,
					"minor": 3
				}, {
					"id": "JsyyGG",
					"beschreibung": "Säule 3",
					"cx": 106,
					"cy": 238,
					"major": 1,
					"minor": 4
				}, {
					"id": "JsVC06",
					"beschreibung": "Säule 4",
					"cx": 105,
					"cy": 136,
					"major": 1,
					"minor": 5
				}, {
					"id": "Js5GCf",
					"beschreibung": "Säule 5",
					"cx": 105,
					"cy": 89,
					"major": 1,
					"minor": 6
				}, {
					"id": "Zo06",
					"beschreibung": "Fernseher",
					"cx": 209,
					"cy": 45,
					"major": 1,
					"minor": 7
				}, {
					"id": "5uyf",
					"beschreibung": "Säule 6",
					"cx": 322,
					"cy": 89,
					"major": 1,
					"minor": 8
				}, {
					"id": "MFxB",
					"beschreibung": "Säule 7",
					"cx": 321,
					"cy": 163,
					"major": 1,
					"minor": 9
				}, {
					"id": "OsWO",
					"beschreibung": "Säule 8",
					"cx": 311,
					"cy": 237,
					"major": 1,
					"minor": 10
				}, {
					"id": "Jsww2b",
					"beschreibung": "Säule 9",
					"cx": 311,
					"cy": 312,
					"major": 1,
					"minor": 11
				}, {
					"id": "JsXcEF",
					"beschreibung": "Säule 10",
					"cx": 311,
					"cy": 380,
					"major": 1,
					"minor": 12
				}, {
					"id": "Js3DR1",
					"beschreibung": "Ausgang",
					"cx": 311,
					"cy": 481,
					"major": 1,
					"minor": 13
				}]
			};

			var oModel = new JSONModel(beacons);
			return oModel;
		},

	};

});