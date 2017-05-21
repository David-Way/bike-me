'use strict';

var L = require('leaflet');
require('leaflet.offline');
var StationList = require('./models/StationList');
var User = require('./util/User');

var App = function() {
  var _ = {
    apiEndpoint: 'https://mysterious-temple-97993.herokuapp.com',
    userLocation: null,
    geolocationWatchID: null,
    map: null,
    mapConfig: {
      center: [53.3470, -6.2589],
      zoom: 14,
      minZoom: 13,
      maxBounds: [
        [53.3233, -6.3178],
        [53.3764, -6.1832]
      ],
      tap: true,
      attributionControl: false
    },
    StationList: [],
    User: null,
    init: function() {
      _.registerServiceWorker();
      _.createMap();
      _.getStationList();
      _.getUserLocation();
    },
    registerServiceWorker: function() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('./service-worker.js')
          .then(function() {
            console.log('Service Worker Active.');
          });
      } else {
        console.log('Service worker not supported on this device. Offline mode not available.');
      }
    },
    createMap: function() {
      _.map = L.map('map', _.mapConfig);
      L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
      ).addTo(_.map);
      L.tileLayer.offline(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        {
          subdomains: '1234',
          minZoom: 13
        }
      ).addTo(_.map);
    },
    getStationList: function() {
      _.StationList = new StationList(_.apiEndpoint, _.map);
    },
    getUserLocation: function() {
      _.User = new User();
      _.User.addToMap(_.map);
    }
  };

  return {
    init: _.init
  };
}();

App.init();
