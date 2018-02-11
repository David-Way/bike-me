'use strict';

var Marker = require('./Marker');
var Fab = require('../component/Fab');
//var Promise = require('bluebird');

var User = function(_map) {
  this.map = _map;
  this.UserMarker = null;
  this.watchID = null;
  this.locationFound = false;
  this.youLocationButton = null;
  return this.init();
};

User.prototype.init = function() { // TODO handle user permission request friendlier
  if ('geolocation' in navigator) {
    this.UserMarker = new Marker('user', null, {lat: 53.3470, lng: -6.2589});
    this.watchID = navigator.geolocation.watchPosition(
      this.geolocationSuccess.bind(this),
      this.geolocationError.bind(this)
    );
    this.addYourLocationButton();
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
  if (!this.locationFound) {
    this.map.panTo(this.UserMarker.getLatLng());
    this.locationFound = true;
  }
};

User.prototype.geolocationError = function(error) {
  console.log('userGeolocationError', error);
  navigator.geolocation.clearWatch(this.geolocationWatchID);
  this.removeYourLocationButton();
};

User.prototype.addYourLocationButton = function() {
  var context = document.getElementsByClassName('leaflet-bottom leaflet-left')[0];
  var label = document.createElement('img');
  label.alt = 'User location';
  label.src = './images/icons/target.svg';
  label.className = 'fab__icon';
  this.youLocationButton = new Fab(context, 'u-ml--small u-mb--small', label, function(event) {
    event.preventDefault();
    this.map.panTo(this.UserMarker.getLatLng());
  }.bind(this));
};

User.prototype.removeYourLocationButton = function() {
  if (this.youLocationButton) {
    this.youLocationButton.remove();
  }
};

User.prototype.addToMap = function(_map) {
  this.UserMarker.addToMap(_map);
};

User.prototype.getLatLng = function() {
  return this.UserMarker.getLatLng();
};

module.exports = User;
