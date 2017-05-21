'use strict';

var L = require('leaflet');

var Marker = function (_markerType, _coOrdinates, _onClick) {
  this.markerType = _markerType;
  this.onClick = _onClick;
  return this.init(_coOrdinates);
};

Marker.prototype.init = function (_coOrdinates) {
  this.mapMarkerIcon = this.getIcon();
  this.lat = _coOrdinates.lat;
  this.lng = _coOrdinates.lng;
  this.mapMarker = L.marker(
    [
      this.lat,
      this.lng
    ],
    {
      icon: this.mapMarkerIcon
    }
  ).on('click', this.onClick);
  return this;
};

Marker.prototype.addToMap = function(_map) {
  return this.mapMarker.addTo(_map);
};

Marker.prototype.removeFromMap = function (_map) {
  this.mapMarker.off('click');
  return _map.removeLayer(this.mapMarker);
};

Marker.prototype.setLatLng = function (position) {
  var newLatLng = new L.LatLng(position.lat, position.lng);
  this.mapMarker.setLatLng(newLatLng);
};

Marker.prototype.getIcon = function () {
	var icon = null;
	switch (this.markerType) {
		case 'station-red':
			 icon = L.icon({
				iconUrl: '../images/icons/bike-station-icon-red.png',
				iconRetinaUrl: '../images/icons/bike-station-icon-red@2x.png',
				iconSize: [20, 31],
				iconAnchor: [10, 30],
				popupAnchor: [-3, -76],
				shadowSize: [0, 0],
				shadowAnchor: [0, 0]
			});
			break;
    case 'station-orange':
			 icon = L.icon({
				iconUrl: '../images/icons/bike-station-icon-orange.png',
				iconRetinaUrl: '../images/icons/bike-station-icon-orange@2x.png',
				iconSize: [20, 31],
				iconAnchor: [10, 30],
				popupAnchor: [-3, -76],
				shadowSize: [0, 0],
				shadowAnchor: [0, 0]
			});
			break;
    case 'station-green':
			 icon = L.icon({
				iconUrl: '../images/icons/bike-station-icon-green.png',
				iconRetinaUrl: '../images/icons/bike-station-icon-green@2x.png',
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
