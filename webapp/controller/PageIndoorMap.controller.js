sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"../model/models",
	"./ble",
	"../model/Ziele"
], function (BaseController, MessageBox, Utilities, History, JSONModel, Models, BLE, Ziele) {
	"use strict";

	var lastX = 0;
	var lastY = 0;
	var currentX;
	var currentY;
	var gx;
	var gy;
	var ctx;
	var globalImage;
	var ready = false;

	function drawPointOnMap(newX, newY) {
		/*		var ctx = this.getView().getModel().getProperty("/globalCtx");*/
		// console.log(ctx);
		// console.log(`Moving to x:${gx}, y:${gy}`);
		if (lastX && lastY) {
			globalCtx.clearRect(0, 0, 300, 400);
		}

		ctx.drawImage(globalImage, 0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(newX, newY, 5, 5);
	}

	function moveToPosition() {
		gx = gx + ((currentX - lastX) / 10);
		gy = gy + (currentY - lastY) / 10;

		drawPointOnMap(gx, gy);

		if (((gx - currentX) * (currentX - lastX) < 0) || (gy - currentY) * (currentY - lastY) < 0) {
			setTimeout(moveToPosition, 50);
		} else {
			lastX = currentX;
			lastY = currentY;
		}
	}

	function drawLine(x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.lineWidth = 15;
		ctx.strokeStyle = "#75b2e5";
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	function drawNavigation(id, that) {
		if (id == 1) {
			console.log('Route zeichnen für: ' + 1);
			var aCoordinates = that.getView().getModel("coordinatesModel").getProperty("/beaconsSet");
			drawLine(aCoordinates[0].cx, aCoordinates[0].cy, aCoordinates[1].cx, aCoordinates[1].cy); //921
			drawLine(aCoordinates[1].cx, aCoordinates[1].cy, aCoordinates[2].cx, aCoordinates[2].cy);
						drawLine(aCoordinates[2].cx, aCoordinates[2].cy, aCoordinates[3].cx, aCoordinates[3].cy);
			drawLine(aCoordinates[3].cx, aCoordinates[3].cy, aCoordinates[4].cx, aCoordinates[4].cy);

		}
	}

	return BaseController.extend("com.sap.build.standard.supplierNavigator.controller.PageIndoorMap", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("PageIndoorMap").attachPatternMatched(this._onObjectMatched, this);
			var model = new JSONModel({
				currentBeacon: ''
			});
			this.getView().setModel(model);
			model.attachPropertyChange(goTo);
			view = this.getView();
			
			this.getView().setModel(Models.createBeaconsModel(), "coordinatesModel");
		},

		_onUrlMatched: function (oEvent) {
			console.log(oEvent);
			var sId = oEvent.getParameter("arguments").ID;
			//console.log(sId)
		},

		onAfterRendering: function () {
			var image = $("img[name='lageplan-img']")[0];
			globalImage = image;
			image.onload = function () {
				//var canvas = this.getView().byId('lageplan-canvas');
				var canvas = $("canvas[name='lageplan-canvas']")[0];
				// console.log(canvas);
				this.getView().getModel().setProperty("/globalCancas", canvas);
				//this.globalCanvas = canvas;
				canvas.height = window.innerHeight;
				canvas.width = window.innerWidth;
				ctx = canvas.getContext("2d");
				// this.getView().getModel().setProperty("/globalCtx", ctx);
				// console.log('ScaleX: ' + 3004 / window.innerWidth + ' ScaleY: ' + 3918 / window.innerHeight);
				ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
				ctx.scale(window.innerWidth / 3004, window.innerHeight / 3918);
				var ziele = Ziele.getZiele();
				for (var zielname in ziele) {
					if (ziele.hasOwnProperty(zielname)) {
						var zielImage = new Image();
						zielImage.src = "resources/logos/" + zielname + ".png";
						var ziel = ziele[zielname];
						const cx = ziel.cx;
						const cy = ziel.cy;
						const basicsize = 100
						zielImage.onload = function () {
							const ar = this.width / this.height;
							ctx.drawImage(this, cx - basicsize * ar, cy - basicsize, basicsize * 2 * ar, basicsize * 2)
						}
					}
				}
				ready = true;
				$("img[name='lageplan-img']").css("display", "none");
				// console.log('Bild ersetzt');
				// goTo(2315, 600);
				//drawLine(792, 2756, 800, 2206);
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getRoute("PageIndoorMap").attachPatternMatched(this._onUrlMatched, this);

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

		_onUrlMatched: function (oEvent) {
			var id = oEvent.getParameter("arguments").navTarget;
			if (id) {
				drawNavigation(id, this);
			}
		},

		_onObjectMatched: function (oEvent) {
			if (!sap.ui.Device.system.desktop) {
				BLE.start(this.getView().getModel(), this.goTo.bind(this));
			}
		},

		goTo: function () {
			if (ready) {
				currentX = this.getView().getModel().getData().currentBeacon.cx;
				currentY = this.getView().getModel().getData().currentBeacon.cy;
				gx = lastX;
				gy = lastY;
				moveToPosition()
			}
		},
	});
});