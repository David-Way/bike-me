'use strict';

var Marker = require('../util/Marker');

var Station = function(_data) {
  this.assign(_data);
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
  this.marker = new Marker(markerType, this.position);
  return this;
};

Station.prototype.addToMap = function(_map) {
  this.marker.addToMap(_map);
};

Station.prototype.removeFromMap = function (_map) {
  this.marker.removeFromMap(_map);
};

Station.prototype.assign = function(_object) {
  for (var prop in _object) {
    if (_object.hasOwnProperty(prop)) {
      this[prop] = _object[prop];
    }
  }
};

module.exports = Station;
