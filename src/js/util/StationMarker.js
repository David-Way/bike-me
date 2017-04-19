'use strict';

var L = require('leaflet');

var StationMarker = function(coOrdinates) {
	return this.init(coOrdinates);
};

StationMarker.prototype.init = function(_coOrdinates) {
  var markerIcon = this.getIcon();
  return L.marker(_coOrdinates, {icon: markerIcon});
};

StationMarker.prototype.getIcon = function() {
	return L.icon({
    iconUrl: '../images/icons/bike-station-icon.png',
    iconRetinaUrl: '../images/icons/bike-station-icon@2x.png',
    iconSize: [40, 62],
    iconAnchor: [20, 61],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
	});
};

module.exports = StationMarker;
