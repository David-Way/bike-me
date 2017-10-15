'use strict';

var CONFIG = require('../config');
var L = require('leaflet');
require('leaflet.offline');
require('leaflet-routing-machine');

var LeafletMap = function() {
  return this.init();
};

LeafletMap.prototype.init = function() {
  var map = L.map('map', CONFIG.mapConfig);
  var zoomControl = new L.Control.Zoom(CONFIG.zoomControl);
  zoomControl.addTo(map);
  L.tileLayer(
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
  ).addTo(map);
  L.tileLayer.offline(
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    CONFIG.offline
  ).addTo(map);
  this.addControlPlaceholders(map);
  return map;
};

LeafletMap.prototype.addControlPlaceholders = function(map) {
  var corners = map._controlCorners,
      l = 'leaflet-',
      container = map._controlContainer,
      className = l + 'top' + ' ' + l + 'center';
  corners.topcenter = L.DomUtil.create('div', className, container);
};

module.exports = LeafletMap;
