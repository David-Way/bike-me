'use strict';

var CONFIG = require('../config');
var L = require('leaflet');

var Marker = function (_markerType, _markerCategory, _coOrdinates, _onClick, _selected) {
  this.markerType = _markerType;
  this.markerCategory = _markerCategory;
  this.onClick = _onClick;
  this.selected = _selected;
  this.mapMarker = null;
  this.mapMarkerIcon = null;
  this.lat = null;
  this.lng = null;
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
  );
  return this;
};

Marker.prototype.addToMap = function(_map) {
  this.mapMarker.on('click', this.onClick);
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

Marker.prototype.getLatLng = function () {
  return this.mapMarker.getLatLng();
};

Marker.prototype.setSelected = function (_selected) {
  this.selected = _selected;
  this.mapMarker.setIcon(this.getIcon());
};

Marker.prototype.getIcon = function () {
	var iconOptions = {};
  var iconUrl = CONFIG.PATHS.ICON_BASE_URL;
  iconUrl += this.markerType;
	switch (this.markerType) {
    case 'bike-station':
      iconUrl += '-' + this.markerCategory;
      if (this.selected) {
        iconUrl += '-selected';
      }
      iconOptions = {
        iconUrl: iconUrl + '.png',
        iconRetinaUrl: iconUrl + '@2x.png',
        iconSize: [20, 31],
        iconAnchor: [10, 30],
        popupAnchor: [-3, -76],
        shadowSize: [0, 0],
        shadowAnchor: [0, 0]
      };
      break;
    case 'user':
      iconOptions = {
        iconUrl: iconUrl + '.png',
        iconRetinaUrl: iconUrl + '@2x.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [10, 10]
      };
      break;
		default:
	}

	return L.icon(iconOptions);
};

module.exports = Marker;
