sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"../model/models",
	"./ble",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, MessageBox, Utilities, History, JSONModel,  Models, BLE, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.supplierNavigator.controller.Page7", {

		_onStandardListItemPress: function (oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function (fnResolve) {
				this.doNavigate("PageIndoorMap", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			Models.currentZiel=oBindingContext.getObject().ID;
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
			var sNavTarget = oBindingContext.getObject().ID;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext,
						navTarget: sNavTarget
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName, {
						navTarget: sNavTarget
				}, false);

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		}
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
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.getView().setModel(Models.createLocationModel());

			this.oRouter.getRoute("Page7").attachPatternMatched(this._onObjectMatched, this);

		},

		onFilterCategory: function (value) {

			// build filter array
			var aFilter = [];
			var sQuery = value;
			if (sQuery === "Alle") {
				sQuery = "";
			}
			if (sQuery) {
				aFilter.push(new Filter("Kategorie", FilterOperator.EQ, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("locationList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		onFilterName: function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getSource().getProperty("value");
			if (sQuery) {
				aFilter.push(new Filter("Name", FilterOperator.EQ, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("locationList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		_onObjectMatched: function (oEvent) {
			var sCategoryName = oEvent.getParameter("arguments").category;
			this.getView().byId("page7").setTitle(sCategoryName);
			this.onFilterCategory(sCategoryName);
		},

	});
}, /* bExport= */ true);