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
					"Kategorie": "Personal"
				}, {
					"ID": "2",
					"Name": "Interseroh",
					"Navigation_Points": [],
					"Kategorie": "Umwelt"
				}, {
					"ID": "3",
					"Name": "Telekom",
					"Navigation_Points": [],
					"Kategorie": "IT"
				}, {
					"ID": "4",
					"Name": "Open Grid Europe",
					"Navigation_Points": [],
					"Kategorie": "Energie"
				}, {
					"ID": "5",
					"Name": "e-maks",
					"Navigation_Points": [],
					"Kategorie": "Dienstleistung"
				}, {
					"ID": "6",
					"Name": "uniper",
					"Navigation_Points": [],
					"Kategorie": "Energie"
				}]
			};

			var oModel = new JSONModel(location);
			return oModel;
		},

	};

});