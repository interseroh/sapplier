sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"../model/models"
], function (BaseController, MessageBox, Utilities, History, JSONModel, Models) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.supplierNavigator.controller.PageIndoorMap", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App5c90f29e06f87f01158d7743";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;
			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("PageIndoorMap").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		},
 
		onAfterRendering: function() {
			var image=$("img[name='lageplan-img']")[0];
			image.onload=function(){
			    var canvas=$("canvas[name='lageplan-canvas']")[0];
	            canvas.hight=100;
	            canvas.width=200;
	            var ctx=canvas.getContext("2d");
	            ctx.scale(2, 2);
	            ctx.drawImage(image, 0,0, 100, 200);
	            image.style.visibility = 'hidden';
			};
            
		},



		_onButtonPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
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
	});
});