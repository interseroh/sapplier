sap.ui.define([
	"./ble",
	"../model/models"
], function (BLE, Models) {
	"use strict";

	// History of enter/exit events.
	var mRegionEvents = [];

	// Nearest ranged beacon.
	var mNearestBeacon = null;

	// Timer that displays nearby beacons.
	var mNearestBeaconDisplayTimer = null;

	// Background flag.
	var mbleInBackground = false;

	// Background notification id counter.
	var mNotificationId = 0;

	// Mbleing of region event state names.
	// These are used in the event display string.
	var mBeaconstateNames = {
		'CLRegionStateInside': 'Enter',
		'CLRegionStateOutside': 'Exit'
	};

	// Here monitored regions are defined.
	var mBeacons = [];

	var mRegions = [];

	// var mRegionData = {
	//     'region1': 'Region One',
	//     'region2': 'Region Two'
	// };

	function onDeviceReady() {
		// startMonitoringAndRanging();
		// startNearestBeaconDisplayTimer();
		// displayRegionEvents();
	};

	function onAppToBackground() {
		mbleInBackground = true;
		stopNearestBeaconDisplayTimer();
	};

	function onAppToForeground() {
		mbleInBackground = false;
		startNearestBeaconDisplayTimer();
		// displayRegionEvents();
	};

	function startNearestBeaconDisplayTimer() {
		mNearestBeaconDisplayTimer = setInterval(displayNearestBeacon, 750);
	};

	function stopNearestBeaconDisplayTimer() {
		clearInterval(mNearestBeaconDisplayTimer);
		mNearestBeaconDisplayTimer = null;
	};

	function startRanging() {
		// function onDidDetermineStateForRegion(result) {
		//     saveRegionEvent(result.state, result.region.identifier);
		//     displayRecentRegionEvent();

		function onDidRangeBeaconsInRegion(result) {
			updateNearestBeacon(result.beacons);
		}

		function onError(errorMessage) {
			console.log('Monitoring beacons did fail: ' + errorMessage);
		}

		// Request permission from user to access location info.
		cordova.plugins.locationManager.requestAlwaysAuthorization();

		// Create delegate object that holds beacon callback functions.
		var delegate = new cordova.plugins.locationManager.Delegate();

		// Set delegate functions.
		// delegate.didDetermineStateForRegion = onDidDetermineStateForRegion;
		delegate.didRangeBeaconsInRegion = onDidRangeBeaconsInRegion;

		cordova.plugins.locationManager.setDelegate(delegate);

		// Start monitoring and ranging beacons.
		startRangingBeacons(mBeacons, onError);
	};

	function startRangingBeacons(beacons, errorCallback) {
		// Start monitoring and ranging regions.
		for (var i in beacons) {
			startRangingBeacon(beacons[i], errorCallback);
		}
	};

	function startRangingBeacon(beacon, errorCallback) {
		// Create a region object.
		var identifier = beacon.id.toString();
		var uuid = "F7826DA6-4FA2-4E98-8024-BC5B71E0893E";
		var major = parseInt(beacon.major);
		var minor = parseInt(beacon.minor);
		var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

		mRegions.push(beaconRegion);

		// Start ranging.
		cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
			.fail(errorCallback)
			.done();

	};

	function saveRegionEvent(eventType, regionId) {
		// Save event.
		mRegionEvents.push({
			type: eventType,
			time: getTimeNow(),
			regionId: regionId
		});

		// Truncate if more than ten entries.
		if (mRegionEvents.length > 10) {
			mRegionEvents.shift();
		}
	};

	function getBeaconId(beacon) {
		return beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
	};

	function isSameBeacon(beacon1, beacon2) {
		return getBeaconId(beacon1) == getBeaconId(beacon2);
	};

	function isNearerThan(beacon1, beacon2) {
		return beacon1.accuracy > 0 && beacon2.accuracy > 0 && beacon1.accuracy < beacon2.accuracy;
	};

	function updateNearestBeacon(beacons) {
		for (var i = 0; i < beacons.length; ++i) {
			var beacon = beacons[i];
			if (!mNearestBeacon) {
				mNearestBeacon = beacon;
			} else {
				if (isSameBeacon(beacon, mNearestBeacon) ||
					isNearerThan(beacon, mNearestBeacon)) {
					mNearestBeacon = beacon;
				}
			}
		}
	};

	function displayNearestBeacon() {
		if (!mNearestBeacon) {
			return;
		}
		// minor = Lagerreihe
		// ACCURACY = Entfernung
		var data = {
			UUID: mNearestBeacon.uuid,
			MAJOR: mNearestBeacon.major,
			MINOR: mNearestBeacon.minor,
			PROXIMITY: mNearestBeacon.proximity,
			ACCURACY: mNearestBeacon.accuracy,
			RSSI: mNearestBeacon.rssi,
			LOCATION: ("00000" + mNearestBeacon.minor).slice(-5),
			DISTANCE: mNearestBeacon.accuracy,
		};

		/*        ModelData.Update(selDialogLocationBLE, ["UUID", "MAJOR", "MINOR"], [data.UUID, data.MAJOR, data.MINOR], data);*/

		// show the last x values
		/*        if (modelselDialogLocationBLE.getData().length > 1) {
		            var firstEntry = modelselDialogLocationBLE.getData()[0];
		            ModelData.Delete(selDialogLocationBLE, ["UUID", "MAJOR", "MINOR"], [firstEntry.UUID, firstEntry.MAJOR, firstEntry.MINOR]);
		        }*/
	};

	function displayRecentRegionEvent() {
		if (mbleInBackground) {
			// Set notification title.
			var event = mRegionEvents[mRegionEvents.length - 1];
			if (!event) {
				return;
			}
			var title = getEventDisplayString(event);

			// Create notification.
			cordova.plugins.notification.local.schedule({
				id: ++mNotificationId,
				title: title
			});
		} else {
			displayRegionEvents();
		}
	};

	function displayRegionEvents() {
		// Clear list.
		$('#events').empty();

		// Update list.
		for (var i = mRegionEvents.length - 1; i >= 0; --i) {
			var event = mRegionEvents[i];
			var title = getEventDisplayString(event);
			var element = $(
				'<li>' + '<strong>' + title + '</strong>' + '</li>'
			);
			$('#events').bleend(element);
		}

		// If the list is empty display a help text.
		if (mRegionEvents.length <= 0) {
			var element = $(
				'<li>' + '<strong>' + 'Waiting for region events, please move into or out of a beacon region.' + '</strong>' + '</li>'
			);
			$('#events').bleend(element);
		}
	};

	function getEventDisplayString(event) {
		/*        return event.time + ': ' + mBeaconstateNames[event.type] + ' ' + mRegionData[event.regionId];*/
	};

	function getTimeNow() {
		function pad(n) {
			return (n < 10) ? '0' + n : n;
		}

		function format(h, m, s) {
			return pad(h) + ':' + pad(m) + ':' + pad(s);
		}

		var d = new Date();
		return format(d.getHours(), d.getMinutes(), d.getSeconds());
	}

	return {

		initialize: function () {
			document.addEventListener('deviceready', onDeviceReady, false);
			document.addEventListener('pause', onAppToBackground, false);
			document.addEventListener('resume', onAppToForeground, false);
		},

		start: function () {
			mBeacons = Models.createBeaconsModel().getData().beaconsSet;
			startRanging();
			startNearestBeaconDisplayTimer();
		},

		stop: function () {
			/*        mAppInBackground = true;*/
			// stopNearestBeaconDisplayTimer();

			$.each(mRegions, function (i, region) {
				cordova.plugins.locationManager.stopRangingBeaconsInRegion(region)
					.fail(function (e) {
						console.log(e);
					})
					.done();
			});
		},

	};
});