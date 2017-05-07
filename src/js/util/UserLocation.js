'use strict';

var Marker = require('./Marker');
var Promise = require('bluebird');

var UserLocation = function(_mapConfig) {
  this.mapConfig = _mapConfig;
  return this.init();
};

UserLocation.prototype.init = function() {
  if ('geolocation' in navigator) {
    this.userLocationMarker = new Marker('user', [53.3470, -6.2589]);
    new Promise(function(resolve) {
      this.geolocationWatchID = navigator.geolocation.watchPosition(resolve);
    }.bind(this)).bind(this).then(function(userPosition) {
      this.userGeolocationSuccess(userPosition);
    }).catch(function(error) {
      this.userGeolocationError(error);
    });
  } else {
    console.log('Geolocation is not available.');
  }

  return this;
};

UserLocation.prototype.addToMap = function(_map) {
  console.log(this.userLocationMarker);
  this.userLocationMarker.addToMap(_map);
};

UserLocation.prototype.userGeolocationSuccess = function(userPosition) {
  var lat = userPosition.coords.latitude;
  var lng = userPosition.coords.longitude;
  this.userLocationMarker.setLatLng(lat, lng);
};

UserLocation.prototype.userGeolocationError = function(error) {
  console.log('userGeolocationError', error);
  navigator.geolocation.clearWatch(this.geolocationWatchID);
};

module.exports = UserLocation;
