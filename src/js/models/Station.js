'use strict';

var Marker = require('../util/Marker');
var moment = require('moment');

var Station = function(_data, _infoCardTemplate, _routeController) {
  this.assign(_data);
  this.infoCardTemplate = _infoCardTemplate;
  this.routeController = _routeController;
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
  var el = document.createElement('div');
  el.innerHTML = this.infoCardTemplate;
  el.getElementsByClassName('info-card_title')[0]
    .appendChild(document.createTextNode(this.address));
  el.getElementsByClassName('bikes')[0]
    .appendChild(document.createTextNode(this.available_bikes));
  el.getElementsByClassName('stands')[0]
    .appendChild(document.createTextNode(this.available_bike_stands));
  el.getElementsByClassName('updated')[0]
    .appendChild(document.createTextNode(moment.unix(this.last_update/1000).fromNow()));

  this.infoPanel = document.getElementById('infoPanel');
  while (this.infoPanel.firstChild) {
    this.infoPanel.removeChild(this.infoPanel.firstChild);
  }
  this.infoPanel.appendChild(el);
};

Station.prototype.showDirections = function() {
  console.log(this.marker);
  this.routeController.setWaypoints([
    L.latLng(this.marker.lat, this.marker.lng),
    L.latLng(53.3470, -6.2589)
  ]);
  //this.routeController.spliceWaypoints(0, 1, [53.3470, -6.2589]);
};

Station.prototype.assign = function(_object) {
  for (var prop in _object) {
    if (_object.hasOwnProperty(prop)) {
      this[prop] = _object[prop];
    }
  }
};

module.exports = Station;
