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
	
/*	var lastX = 0;
	var lastY = 0;
	var currentX;
	var currentY;
	var x;
	var y;*/
	
	return BaseController.extend("com.sap.build.standard.supplierNavigator.controller.PageIndoorMap", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("PageIndoorMap").attachPatternMatched(this._onObjectMatched, this);
			var model = new JSONModel({
				currentBeacon: ''
			});
			this.getView().setModel(model);
			this.lastX = 0;
            model.attachPropertyChange(this.goTo());
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
				ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
				ctx.scale(window.innerWidth / 3004, window.innerHeight / 3918);
				var ziele=Ziele.getZiele();
				for (var zielname in ziele) {
					if (ziele.hasOwnProperty(zielname) ) {
						var zielImage=new Image();
						zielImage.src="resources/logos/"+zielname+".png";
						var ziel=ziele[zielname];
						const cx=ziel.cx;
						const cy=ziel.cy;
						const basicsize=100
						zielImage.onload=function(){
							const ar=this.width/this.height;
							ctx.drawImage(this, cx - basicsize*ar, cy - basicsize, basicsize*2*ar, basicsize*2)
						}
					}
				}
				$("img[name='lageplan-img']").css("display", "none");
				console.log('Bild ersetzt');
				this.goTo(2315, 600);
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
			console.log(`Moving to x:${this.x}, y:${this.y}`);
			if (this.lastX && this.lastY) {
				this.globalCtx.clearRect(0, 0, 300, 400);
			}

			this.globalCtx.drawImage(this.globalImage, 0, 0, canvas.width, canvas.height);
			this.globalCtx.fillStyle = "#FF0000";
			this.globalCtx.fillRect(newX, newY, 5, 5);
		},

		moveToPosition: function () {
			this.x = this.x + ((this.currentX - this.lastX) / 10);
			this.y = this.y + (this.currentY - this.lastY) / 10;

			this.drawPointOnMap(this.x, this.y);

			if (((this.x - this.currentX) * (this.currentX - this.lastX) < 0) || (this.y - this.currentY) * (this.currentY - this.lastY) < 0) {
				setTimeout(this.moveToPosition, 50);
			} else {
				this.lastX = this.currentX;
				this.lastY = this.currentY;
			}
		},

		goTo: function () {
			this.currentX = this.getView().getModel().getProperty("cx");
			this.currentY = this.getView().getModel().getProperty("cy");;
			this.x = this.lastX;
			this.y = this.lastY;
			this.moveToPosition()
		},

		_onObjectMatched: function (oEvent) {
			if (!sap.ui.Device.system.desktop) {
				BLE.start(this.getView().getModel());
			}
		},
		
	});
});