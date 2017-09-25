'use strict';

var L = require('leaflet');
var Marker = require('../util/Marker');
var moment = require('moment');

var Station = function(_User, _data, _infoCardTemplate, _routeController) {
  this.assign(_data);
  this.User = _User;
  this.infoCardTemplate = _infoCardTemplate;
  this.routeController = _routeController;
  this.marker = null;
  return this.init();
};

Station.prototype.init = function() {
  var markerType = '';
  if (this.available_bikes !== undefined) {
    if (this.available_bikes === 0) {
      markerType = 'station-red';
    } else if (this.available_bikes > 0 && this.available_bikes < 5) {
      markerType = 'station-orange';
    } else {
      markerType = 'station-green';
    }
  } else {
    markerType = 'station-static';
  }

  this.marker = new Marker(markerType, this.position, this.onClick.bind(this));
  return this;
};

Station.prototype.addToMap = function(_map) {
  this.marker.addToMap(_map);
};

Station.prototype.removeFromMap = function (_map) {
  this.marker.removeFromMap(_map);
};

Station.prototype.onClick = function() {
  this.showInfoPanel();
  this.showDirections();
};

Station.prototype.showInfoPanel = function() {
  var container = document.getElementsByClassName('leaflet-top leaflet-right')[0];
  var infoPanel = document.getElementById('infoPanel');

  if (!infoPanel) {
    infoPanel = document.createElement('div');
    infoPanel.id = 'infoPanel';
  }

  while (infoPanel.firstChild) {
    infoPanel.removeChild(infoPanel.firstChild);
  }

  infoPanel.innerHTML = this.infoCardTemplate;
  infoPanel.getElementsByClassName('info-card_title')[0]
    .appendChild(document.createTextNode(this.address));
  infoPanel.getElementsByClassName('bikes')[0]
    .appendChild(document.createTextNode(this.available_bikes));
  infoPanel.getElementsByClassName('stands')[0]
    .appendChild(document.createTextNode(this.available_bike_stands));
  infoPanel.getElementsByClassName('updated')[0]
    .appendChild(document.createTextNode(moment.unix(this.last_update/1000).fromNow()));

  container.insertBefore(infoPanel, container.firstChild);
};

Station.prototype.showDirections = function() {
  this.routeController.setWaypoints([
    L.latLng(this.User.getLatLng()),
    L.latLng(this.marker.getLatLng()),
  ]);
};

Station.prototype.assign = function(_object) {
  for (var prop in _object) {
    if (_object.hasOwnProperty(prop)) {
      this[prop] = _object[prop];
    }
  }
};

module.exports = Station;
