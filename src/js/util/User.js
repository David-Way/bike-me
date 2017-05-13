'use strict';

var Marker = require('./Marker');
var Promise = require('bluebird');

var User = function(_mapConfig) {
  this.mapConfig = _mapConfig;
  return this.init();
};

User.prototype.init = function() {
  if ('geolocation' in navigator) {
    this.UserMarker = new Marker('user', {lat: 53.3470, lng: -6.2589});
    new Promise(function(resolve) {
      this.geolocationWatchID = navigator.geolocation.watchPosition(resolve);
    }.bind(this)).bind(this).then(function(userPosition) {
      this.geolocationSuccess(userPosition);
    }).catch(function(error) {
      this.geolocationError(error);
    });
  } else {
    console.log('Geolocation is not available.');
  }

  return this;
};

User.prototype.addToMap = function(_map) {
  this.UserMarker.addToMap(_map);
};

User.prototype.geolocationSuccess = function(userPosition) {
  var lat = userPosition.coords.latitude;
  var lng = userPosition.coords.longitude;
  this.UserMarker.setLatLng({'lat': lat, 'lng': lng});
};

User.prototype.geolocationError = function(error) {
  console.log('userGeolocationError', error);
  navigator.geolocation.clearWatch(this.geolocationWatchID);
};

module.exports = User;
