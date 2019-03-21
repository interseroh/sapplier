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
					"Name": "Personal",
					"Icon": "sap-icon://collaborate"
				}, {
					"ID": "2",
					"Name": "Umwelt",
					"Icon": "sap-icon://delete"
				}, {
					"ID": "3",
					"Name": "IT",
					"Icon": "sap-icon://desktop-mobile"
				}, {
					"ID": "4",
					"Name": "Energie",
					"Icon": "sap-icon://energy-saving-lightbulb"
				}, {
					"ID": "5",
					"Name": "Dienstleistung",
					"Icon": "sap-icon://collaborate"
				}, {
					"ID": "6",
					"Name": "Alle",
					"Icon": "sap-icon://world"
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
					"Navigation_Points": [1, 2, 3, 4],
					"Kategorie": "Personal",
					"Logo": "randstad.png"
				}, {
					"ID": "2",
					"Name": "Interseroh",
					"Navigation_Points": [1, 2, 3, 4, 5],
					"Kategorie": "Umwelt",
					"Logo": "interseroh.png"

				}, {
					"ID": "3",
					"Name": "Telekom",
					"Navigation_Points": [1, 2, 3, 4, 5, 6],
					"Kategorie": "IT",
					"Logo": "telekom.png",
				}, {
					"ID": "4",
					"Name": "Open Grid Europe",
					"Navigation_Points": [1, 2, 3, 4, 5, 6, 7, 8],
					"Kategorie": "Energie",
					"Logo": "openGrid.png"
				}, {
					"ID": "5",
					"Name": "e-maks",
					"Navigation_Points": [1, 2, 3, 4, 5, 6, 7, 8, 9],
					"Kategorie": "Dienstleistung",
					"Logo": "eMaks.png"
				}, {
					"ID": "6",
					"Name": "uniper",
					"Navigation_Points": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
					"cx": 921,
					"cy": 3565,
					"major": 1,
					"minor": 1
				}, {
					"id": "JsOXzO",
					"beschreibung": "Säule 1",
					"cx": 792,
					"cy": 2756,
					"major": 1,
					"minor": 2
				}, {
					"id": "JsGYeY",
					"beschreibung": "Säule 2",
					"cx": 800,
					"cy": 2206,
					"major": 1,
					"minor": 3
				}, {
					"id": "JsyyGG",
					"beschreibung": "Säule 3",
					"cx": 805,
					"cy": 1655,
					"major": 1,
					"minor": 4
				}, {
					"id": "JsVC06",
					"beschreibung": "Säule 4",
					"cx": 805,
					"cy": 1106,
					"major": 1,
					"minor": 5
				}, {
					"id": "Js5GCf",
					"beschreibung": "Säule 5",
					"cx": 797,
					"cy": 601,
					"major": 1,
					"minor": 6
				}, {
					"id": "Zo06",
					"beschreibung": "Fernseher",
					"cx": 1569,
					"cy": 275,
					"major": 1,
					"minor": 7
				}, {
					"id": "5uyf",
					"beschreibung": "Säule 6",
					"cx": 2315,
					"cy": 601,
					"major": 1,
					"minor": 8
				}, {
					"id": "MFxB",
					"beschreibung": "Säule 7",
					"cx": 2323,
					"cy": 1106,
					"major": 1,
					"minor": 9
				}, {
					"id": "OsWO",
					"beschreibung": "Säule 8",
					"cx": 2323,
					"cy": 1655,
					"major": 1,
					"minor": 10
				}, {
					"id": "Jsww2b",
					"beschreibung": "Säule 9",
					"cx": 2318,
					"cy": 2206,
					"major": 1,
					"minor": 11
				}, {
					"id": "JsXcEF",
					"beschreibung": "Säule 10",
					"cx": 2310,
					"cy": 2756,
					"major": 1,
					"minor": 12
				}, {
					"id": "Js3DR1",
					"beschreibung": "Ausgang",
					"cx": 2281,
					"cy": 3565,
					"major": 1,
					"minor": 13
				}]
			};

			var oModel = new JSONModel(beacons);
			return oModel;
		},

	};

});