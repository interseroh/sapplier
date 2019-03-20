sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"../model/models",
	"./ble"
], function (BaseController, MessageBox, Utilities, History, JSONModel, Models, BLE) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.supplierNavigator.controller.PageIndoorMap", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("PageIndoorMap").attachPatternMatched(this._onObjectMatched, this);
			var model = new JSONModel({currentBeacon: '' });
			this.getView().setModel(model);
		},

		onAfterRendering: function () {
			var image = $("img[name='lageplan-img']")[0];
			image.onload = function () {
				var canvas = $("canvas[name='lageplan-canvas']")[0];
				canvas.height = image.height;
				canvas.width = image.width;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0, canvas.width, image.height);
				$("img[name='lageplan-img']").remove();
			};

		},

		_onButtonPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);
			BLE.stop();
			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Page6", true);
			}
		},

		getQueryParameters: function (oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},

		_onObjectMatched: function (oEvent) {
			if (!sap.ui.Device.system.desktop) {
				BLE.start(this.getView().getModel());
			}
		},

	});
});