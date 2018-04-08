'use strict';

var Marker = require('./Marker');
var Fab = require('../component/Fab');
var Dialog = require('../component/Dialog');

var User = function(_map) {
  this.map = _map;
  this.UserMarker = null;
  this.watchID = null;
  this.locationFound = false;
  this.youLocationButton = null;
  return this;
};

User.prototype.getUserMarker = function () {
  this.UserMarker = new Marker('user', null, { lat: 53.3470, lng: -6.2589 });
  this.watchID = navigator.geolocation.watchPosition(
    this.geolocationSuccess.bind(this),
    this.geolocationError.bind(this)
  );
};

User.prototype.getUserLocation = function() {
  if ('geolocation' in navigator) {
    var permissionsQuery = navigator.permissions.query({
      name: 'geolocation'
    }).then(function(result) {
      if (result.state === 'prompt') {
        new Dialog(
					'locationPermissionsWarningDialog',
					this.getUserMarker.bind(this),
					null
				);
      } else if (result.state === 'denied') {
        console.log('Location permission denied');
      } else  if (result.state === 'granted') {
        console.log('Location permission granted');
        this.getUserMarker();
      }
    }.bind(this));

    return permissionsQuery;
  }
};

User.prototype.geolocationSuccess = function(userPosition) {
  var lat = userPosition.coords.latitude;
  var lng = userPosition.coords.longitude;
  this.UserMarker.setLatLng({'lat': lat, 'lng': lng});
  if (!this.locationFound) {
    this.addToMap(this.map);
    this.map.panTo(this.UserMarker.getLatLng());
    this.addYourLocationButton();
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
    if (this.UserMarker) {
      this.map.panTo(this.UserMarker.getLatLng());
    }
  }.bind(this));
};

User.prototype.removeYourLocationButton = function() {
  if (this.youLocationButton) {
    this.youLocationButton.remove();
  }
};

User.prototype.addToMap = function(_map) {
  if (this.UserMarker) {
    this.UserMarker.addToMap(_map);
    this.UserMarker.addClass('user-marker');
  }
};

User.prototype.getLatLng = function() {
  if (this.UserMarker) {
    return this.UserMarker.getLatLng();
  } else {
    return null;
  }
};

module.exports = User;
