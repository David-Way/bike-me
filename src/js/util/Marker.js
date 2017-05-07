'use strict';

var L = require('leaflet');

var Marker = function(_markerType, _coOrdinates) {
	this.markerType = _markerType;
  return this.init(_coOrdinates);
};

Marker.prototype.init = function(_coOrdinates) {
  this.mapMarkerIcon = this.getIcon();
  this.mapMarker = L.marker(_coOrdinates, {icon: this.mapMarkerIcon});
  return this;
};

Marker.prototype.addToMap = function(_map) {
  this.mapMarker.addTo(_map);
};

Marker.prototype.setLatLng = function(lat, lng) {
  var newLatLng = new L.LatLng(lat, lng);
  this.mapMarker.setLatLng(newLatLng);
};

Marker.prototype.getIcon = function() {
	var icon = null;
	switch (this.markerType) {
		case 'station':
			 icon = L.icon({
				iconUrl: '../images/icons/bike-station-icon.png',
				iconRetinaUrl: '../images/icons/bike-station-icon@2x.png',
				iconSize: [20, 31],
				iconAnchor: [10, 30],
				popupAnchor: [-3, -76],
				shadowSize: [0, 0],
				shadowAnchor: [0, 0]
			});
			break;
    case 'station-static':
			 icon = L.icon({
				iconUrl: '../images/icons/bike-station-icon-static.png',
				iconRetinaUrl: '../images/icons/bike-station-icon-static@2x.png',
				iconSize: [20, 31],
				iconAnchor: [10, 30],
				popupAnchor: [-3, -76],
				shadowSize: [0, 0],
				shadowAnchor: [0, 0]
			});
			break;
		case 'user':
			icon = L.icon({
				iconUrl: '../images/icons/user-icon.png',
				iconRetinaUrl: '../images/icons/user-icon@2x.png',
				iconSize: [20, 20],
				iconAnchor: [10, 10],
				popupAnchor: [10, 10]
			});
			break;
		default:

	}
	return icon;
};

module.exports = Marker;
