'use strict';

var Marker = require('../util/Marker');

var Station = function(_data) {
  this.assign(_data);
  return this.init();
};

Station.prototype.init = function() {
  this.marker = new Marker(this.status ? 'station' : 'station-static', this.position);
  return this;
};

Station.prototype.addToMap = function(_map) {
  this.marker.addToMap(_map);
};

Station.prototype.removeFromMap = function (_map) {
  this.marker.removeFromMap(_map)
};

Station.prototype.assign = function(_object) {
  for (var prop in _object) {
    if (_object.hasOwnProperty(prop)) {
      this[prop] = _object[prop];
    }
  }
};

module.exports = Station;
