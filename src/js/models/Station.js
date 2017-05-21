'use strict';

var Marker = require('../util/Marker');
var moment = require('moment');

var Station = function(_data, _infoCardTemplate) {
  this.assign(_data);
  this.infoCardTemplate = _infoCardTemplate;
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

  infoPanel = document.getElementById('infoPanel');
  while (infoPanel.firstChild) {
    infoPanel.removeChild(infoPanel.firstChild);
  }
  infoPanel.appendChild(el);
};

Station.prototype.assign = function(_object) {
  for (var prop in _object) {
    if (_object.hasOwnProperty(prop)) {
      this[prop] = _object[prop];
    }
  }
};

module.exports = Station;
