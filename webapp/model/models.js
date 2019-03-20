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
					"Name": "Shops"
				}, {
					"ID": "2",
					"Name": "Gastronomie"
				}, {
					"ID": "3",
					"Name": "Unterhaltung"
				}, {
					"ID": "4",
					"Name": "Büros & Wohnungen"
				}, {
					"ID": "5",
					"Name": "Hotels"
				}, {
					"ID": "6",
					"Name": "Alle"
				}]
			};

			var oModel = new JSONModel(category);
			return oModel;
		},

	};

});