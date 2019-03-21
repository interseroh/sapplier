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
            
            this.lastX = 0;
			this.lastY = 0;
			this.currentX;
			this.currentY;
			this.x;
			this.y;
		},

		onAfterRendering: function () {
			var image = $("img[name='lageplan-img']")[0];
			this.globalImage = image;
			image.onload = function () {
				var canvas = $("canvas[name='lageplan-canvas']")[0];
				this.globalCanvas = canvas;
				canvas.height = window.innerHeight;
				canvas.width = window.innerWidth;
				var ctx = canvas.getContext("2d");
				this.globalCtx = ctx;
				console.log('ScaleX: '+ 3004/window.innerWidth+' ScaleY: '+3918/window.innerHeight);
				ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
				ctx.scale(window.innerWidth/3004, window.innerHeight/3918);
				ctx.fillRect(1569, 275, 20,20);
				//$("img[name='lageplan-img']").remove();
				$("img[name='lageplan-img']").css("display", "none");
				console.log('Bild ersetzt');
			}.bind(this);

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

		drawPointOnMap: function (newX, newY) {
			console.log(`Moving to x:${x}, y:${y}`);
			if (lastX && lastY) {
				ctx.clearRect(0, 0, 300, 400);
			}

			ctx.drawImage(document.getElementById("svg-map"), 0, 0);
			ctx.fillStyle = "#FF0000";
			ctx.fillRect(newX, newY, 5, 5);
		},

		moveToPosition: function () {
			x = x + ((currentX - lastX) / 10);
			y = y + (currentY - lastY) / 10;

			drawPointOnMap(x, y);

			if (((x - currentX) * (currentX - lastX) < 0) || (y - currentY) * (currentY - lastY) < 0) {
				setTimeout(moveToPosition, 50);
			} else {
				lastX = currentX;
				lastY = currentY;
			}
		},

		goTo: function (toX, toY) {
			currentX = toX;
			currentY = toY;
			x = lastX;
			y = lastY;
			moveToPosition()
		},
        
        _onObjectMatched: function (oEvent) {
			if (!sap.ui.Device.system.desktop) {
				BLE.start(this.getView().getModel());
			}
		},

	});
});