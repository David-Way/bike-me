'use strict';

var L = require('leaflet');

var Marker = function(_markerType, _coOrdinates) {
	this.markerType = _markerType;
	this.coOrdinates = _coOrdinates;
	return this.init();
};

Marker.prototype.init = function() {
  this.markerIcon = this.getIcon();
  return L.marker(this.coOrdinates, {icon: this.markerIcon});
};

Marker.prototype.getIcon = function() {
	var icon = null;
	switch (this.markerType) {
		case 'station':
			 icon = L.icon({
				iconUrl: '../images/icons/bike-station-icon.png',
				iconRetinaUrl: '../images/icons/bike-station-icon@2x.png',
				iconSize: [40, 62],
				iconAnchor: [20, 61],
				popupAnchor: [-3, -76],
				shadowSize: [68, 95],
				shadowAnchor: [22, 94]
			});
			break;
		case 'user':
			icon = L.icon({
				iconUrl: '../images/icons/user-icon.png',
				iconRetinaUrl: '../images/icons/user-icon@2x.png',
				iconSize: [40, 40],
				iconAnchor: [20, 20],
				popupAnchor: [20, 20]
			});
			break;
		default:

	}
	return icon;
};

module.exports = Marker;
