sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"../model/models",
	"./ble"
], function (BaseController, MessageBox, Utilities, History, JSONModel, Models, BLE) {
	"use strict";
	var lastX = 921;
	var lastY = 3690;
	var currentX;
	var currentY;
	var gx;
	var gy;
	var ctx;
	var globalImage;
	var canvas;
	var backupCanvas;
	var heinz;
	var height;
	var width;

	function drawBasis() {
		if (!globalImage.complete){
			return;
		}
		canvas = $("canvas[name='lageplan-canvas']")[0];
		height = canvas.scrollHeight>0?canvas.scrollHeight:height;
		width = canvas.scrollWidth>0?canvas.scrollWidth:width;
		canvas.height = height;
		canvas.width = width;
		ctx = canvas.getContext("2d");
		ctx.scale(1, 1);
		ctx.drawImage(globalImage, 0, 0, canvas.width, canvas.height);
		ctx.scale(width / globalImage.width, height / globalImage.height);
		var ziele = Models.createLocationModel().getData().locationSet;
		$(ziele).each(function(index, ziel){
				var zielImage = new Image();
				zielImage.src = "resources/logos/" + ziel.Logo;
				const cx = ziel.cx;
				const cy = ziel.cy;
				const basicsize = 100;
				zielImage.onload = function () {
					const ar = this.width / this.height;
					ctx.drawImage(this, cx - basicsize * ar, cy - basicsize, basicsize * 2 * ar, basicsize * 2);
				};
		});

		$("img[name='lageplan-img']").css("display", "none");
		if (Models.currentZiel>0) {
			drawNavigation(Models.currentZiel);
		}
	}

	function heinzOn(x, y) {
		drawBasis();
		ctx.drawImage(heinz, x, y);
	};

	function drawPointOnMap(newX, newY) {
		ctx.drawImage(globalImage, 0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#FF0000";
		heinzOn(newX, newY);
	};

	function moveToPosition() {
		gx = gx + (currentX - lastX) / 10;
		gy = gy + (currentY - lastY) / 10;
		drawPointOnMap(gx, gy);
		if ((gx - currentX) * (currentX - lastX) < 0 || (gy - currentY) * (currentY - lastY) < 0) {
			setTimeout(moveToPosition, 50);
		} else {
			lastX = currentX;
			lastY = currentY;
		};
	};

	function drawLine(x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.lineWidth = 15;
		ctx.strokeStyle = "#75b2e5";
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	};

	function drawNavigation() {
		var ziel=Models.createLocationModel().getData().locationSet.find(function(o){return o.ID===Models.currentZiel;});
		switch (Models.currentZiel) {
		case "1":
			drawTo(2);
			var nearestBeacon=_einBeacon(3);
			drawLine(nearestBeacon.cx, nearestBeacon.cy, ziel.cx, ziel.cy);
			break;
		case "2":
			drawTo(3);
			var nearestBeacon=_einBeacon(4);
			drawLine(nearestBeacon.cx, nearestBeacon.cy, ziel.cx, ziel.cy);
			break;
		case "3":
			drawTo(4);
			var nearestBeacon=_einBeacon(5);
			drawLine(nearestBeacon.cx, nearestBeacon.cy, ziel.cx, ziel.cy);
			break;
		case "4":
			drawTo(6);
			var nearestBeacon=_einBeacon(7);
			drawLine(nearestBeacon.cx, nearestBeacon.cy, ziel.cx, ziel.cy);
			break;
		case "5":
			drawTo(9);
			var nearestBeacon=_einBeacon(8);
			drawLine(nearestBeacon.cx, nearestBeacon.cy, ziel.cx, ziel.cy);
			break;
		case "6":
			drawTo(10)
			var nearestBeacon=_einBeacon(9);
			drawLine(nearestBeacon.cx, nearestBeacon.cy, ziel.cx, ziel.cy);
			break;
		default:
		};
	};

    function _einBeacon(beaconNr) {
    	var beacons=Models.createBeaconsModel().getData().beaconsSet;
    	return beacons[beaconNr];
    };
    
	function drawTo(end) {
		var aCoordinates = Models.createBeaconsModel().getData().beaconsSet;
		if (end < 6) {
			for (let i = 0; i <= end; i++) {
				console.log(i);
				drawLine(aCoordinates[i].cx, aCoordinates[i].cy, aCoordinates[i + 1].cx, aCoordinates[i + 1].cy);
			}
		} else {
			drawLine(aCoordinates[0].cx, aCoordinates[0].cy, aCoordinates[11].cx, aCoordinates[11].cy);
			for (let i = 11; i >= end; i--) {
				console.log(i);
				drawLine(aCoordinates[i].cx, aCoordinates[i].cy, aCoordinates[i - 1].cx, aCoordinates[i - 1].cy);
			}
		}
	}
	return BaseController.extend("com.sap.build.standard.supplierNavigator.controller.PageIndoorMap", {
		onInit: function () {
			heinz = new Image();
			heinz.src = "resources/lieferant-heinz.png";
			globalImage = new Image();
			globalImage.src = "resources/appHausKarteAktuell.svg";
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			globalImage.onload = function () {
				drawBasis();
				if (!sap.ui.Device.system.desktop) {
        				BLE.start();
				} else
				{
					$(function(){
						setInterval(function(){
							var numOfBeacons=Models.createBeaconsModel().getData().beaconsSet.length;
							Models.createCurrentBeaconModel().setProperty("/currentBeacon", _einBeacon(Math.trunc(Math.random()*numOfBeacons)));
						}, 2000);
					});
				};
				heinzOn(800, 600);
				drawNavigation();
				/*				
                currentX=800;
                currentY=600;
                gx=lastX;
                gy=lastY;
                moveToPosition();
 */
			};

            var model=Models.createCurrentBeaconModel();
            var binding = new sap.ui.model.PropertyBinding(model, "/", model.getContext("/"));
            binding.attachChange(function(){
            	currentX = model.getData().currentBeacon.cx;
            	currentY = model.getData().currentBeacon.cy;
            	gx = lastX;
            	gy = lastY;
            	moveToPosition()

            },this);

			this.oRouter.getRoute("PageIndoorMap").attachPatternMatched(this._onUrlMatched, this);
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
			drawBasis();
		},

	});
});