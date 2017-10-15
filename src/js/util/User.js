'use strict';

var Marker = require('./Marker');
//var Promise = require('bluebird');

var User = function(_mapConfig) {
  this.mapConfig = _mapConfig;
  this.UserMarker = null;
  this.watchID = null;
  return this.init();
};

User.prototype.init = function() { // TODO handle user permission request friendlier
  if ('geolocation' in navigator) {
    this.UserMarker = new Marker('user', null, {lat: 53.3470, lng: -6.2589});
    this.watchID = navigator.geolocation.watchPosition(
      this.geolocationSuccess.bind(this),
      this.geolocationError.bind(this)
    );
    // this.UserMarker = new Marker('user', {
    //   lat: position.coords.latitude,
    //   lng: position.coords.longitude}
    // );
    //do_something(position.coords.latitude, position.coords.longitude);
    // new Promise(function(resolve) {
    //   this.geolocationWatchID = navigator.geolocation.watchPosition(resolve);
    // }.bind(this)).bind(this).then(function(userPosition) {
    //   this.geolocationSuccess(userPosition);
    // }).catch(function(error) {
    //   this.geolocationError(error);
    // });
  } else {
    console.log('Geolocation is not available.');
  }

  return this;
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

User.prototype.addToMap = function(_map) {
  this.UserMarker.addToMap(_map);
};

User.prototype.getLatLng = function() {
  return this.UserMarker.getLatLng();
};

module.exports = User;
