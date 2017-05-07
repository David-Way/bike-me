'use strict';

var L = require('leaflet');
require('leaflet.offline');
var Marker = require('./util/Marker');
var UserLocation = require('./util/UserLocation');

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
    stationMarkers: [],
    init: function() {
      _.registerServiceWorker();
      _.createMap();
      _.loadStaticStationData();
      //_.loadLatestDynamicStationData(); TODO
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
    getUserLocation: function() {
      this.userLocation = new UserLocation();
      this.userLocation.addToMap(_.map);
    },
    createMap: function() {
      _.map = L.map('map', _.mapConfig);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(_.map);
      L.tileLayer.offline('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        subdomains: '1234',
        minZoom: 13
      }).addTo(_.map);
    },
    loadStaticStationData: function() {
      var request = new XMLHttpRequest();
      request.open('GET', '/data/Dublin.json', true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          _.stationMarkers = [];
          for (var i = 0; i < data.length; i++) {
            var lat = data[i].latitude;
            var lng = data[i].longitude;
            var station = new Marker('station-static', [lat, lng]);
            station.addToMap(_.map);
            _.stationMarkers.push(station);
          }
        } else { // TODO handle Error

        }
      };
      request.onerror = function() { // TODO handle Error

      };
      request.send();
    },
    loadLatestDynamicStationData: function() {
      var request = new XMLHttpRequest();
      request.open('GET', _.apiEndpoint + '/stations', true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          console.log('data', data);
          _.stationMarkers = [];
          for (var i = 0; i < data.length; i++) {
            var lat = data[i].latitude;
            var lng = data[i].longitude;
            var station = new Marker('station', [lat, lng]);
            station.addToMap(_.map);
            _.stationMarkers.push(station);
          }
        } else { // TODO handle Error

        }
      };
      request.onerror = function() { // TODO handle Error

      };

      request.send();
    }
  };

  return {
    init: _.init
  };
}();

App.init();
