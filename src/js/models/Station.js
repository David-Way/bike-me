'use strict';

var L = require('leaflet');
var Marker = require('../util/Marker');
var moment = require('moment');

/**
 * Constructs and initilises station object
 *
 * @param  {object} _User -
 * @param  {array} _data -
 * @param  {String} _infoCardTemplate -
 * @param  {object} _routeController -
 * @param  {function} _selectedCallback -
 *
 * @return {Station}
 */
var Station = function(
  _stationCategory, _User, _data, _infoCardTemplate, _routeController, _selectedCallback
) {
  this.assign(_data);
  this.stationCategory = _stationCategory;
  this.User = _User;
  this.infoCardTemplate = _infoCardTemplate;
  this.routeController = _routeController;
  this.selectedCallback = _selectedCallback;
  this.marker = null;
  this.selected = false;
  this.markerCategory = this.getMarkerCategory(this.stationCategory);
  this.marker = new Marker(
    'bike-station',
    this.markerCategory,
    this.position,
    this.onClick.bind(this),
    this.selected
  );

  return this;
};

Station.prototype.getMarkerCategory = function(_stationCategory) {
  var markerCategory = null;
  switch (_stationCategory) {
    case 'bike':
      if (this.available_bikes !== undefined) {
        if (this.available_bikes === 0) {
          markerCategory = 'red';
        } else if (this.available_bikes > 0 && this.available_bikes < 5) {
          markerCategory = 'orange';
        } else {
          markerCategory = 'green';
        }
      } else {
        markerCategory = 'static';
      }
      break;
    case 'stands':
      if (this.available_bike_stands !== undefined) {
        if (this.available_bike_stands === 0) {
          markerCategory = 'red';
        } else if (this.available_bike_stands > 0 && this.available_bike_stands < 5) {
          markerCategory = 'orange';
        } else {
          markerCategory = 'green';
        }
      } else {
        markerCategory = 'static';
      }
      break;
    case 'bus_stop':

      break;
    default:
      markerCategory = 'static';
  }

  return markerCategory;
};

Station.prototype.setCategory = function(_map, _stationCategory) {
  this.stationCategory = _stationCategory;
  this.markerCategory = this.getMarkerCategory(this.stationCategory);
  this.marker.removeFromMap(_map);
  this.marker = new Marker(
    'bike-station',
    this.markerCategory,
    this.position,
    this.onClick.bind(this),
    this.selected
  );
  this.marker.addToMap(_map);
};

Station.prototype.addToMap = function(_map) {
  this.marker.addToMap(_map);
};

Station.prototype.removeFromMap = function (_map) {
  this.marker.removeFromMap(_map);
};

Station.prototype.onClick = function() {
  this.selectedCallback(this);
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

  var subtitle = 'Station no. ' + this.number;
  if (this.banking) {
    subtitle += ' (Credit card machine)';
  }

  infoPanel.innerHTML = this.infoCardTemplate;
  infoPanel.getElementsByClassName('info-card__pin')[0].src =
  'images/icons/' + this.marker.markerType + '-' + this.marker.markerCategory + '.svg';
  infoPanel.getElementsByClassName('info-card__title')[0]
    .appendChild(document.createTextNode(this.address));
  infoPanel.getElementsByClassName('info-card__sub-title')[0]
    .appendChild(document.createTextNode(subtitle));
  infoPanel.getElementsByClassName('bikes')[0]
    .appendChild(document.createTextNode(this.available_bikes || '--'));
  infoPanel.getElementsByClassName('stands')[0]
    .appendChild(document.createTextNode(this.available_bike_stands || '--'));
  infoPanel.getElementsByClassName('updated')[0]
    .appendChild(document.createTextNode(moment.unix(this.last_update/1000).fromNow()));

  container.insertBefore(infoPanel, container.firstChild);
};

Station.prototype.hideInfoPanel = function() {
  var infoPanel = document.getElementById('infoPanel');
  while (infoPanel.firstChild) {
    infoPanel.removeChild(infoPanel.firstChild);
  }
};

Station.prototype.showDirections = function() {
  this.routeController.setWaypoints([
    L.latLng(this.User.getLatLng()),
    L.latLng(this.marker.getLatLng()),
  ]);
};

Station.prototype.hideDirections = function() {
  this.routeController.spliceWaypoints(
    0,
    this.routeController.getWaypoints().length
  );
};

Station.prototype.showItinerary = function() {
  this.routeController.show();
};

Station.prototype.hideItinerary = function() {
  this.routeController.hide();
};

Station.prototype.toggleSelectedState = function() {
  return this.setSelectedState(!this.selected);
};

Station.prototype.getSelectedState = function() {
  return this.selected;
};

Station.prototype.setSelectedState = function(_selected) {
  this.selected = _selected;
  this.marker.setSelected(this.selected);
};

Station.prototype.assign = function(_object) { // TODO move to utilities
  for (var prop in _object) {
    if (_object.hasOwnProperty(prop)) {
      this[prop] = _object[prop];
    }
  }
};

module.exports = Station;
