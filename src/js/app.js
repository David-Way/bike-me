'use strict';

var L = require('leaflet');
require('leaflet.offline');
var Marker = require('./util/Marker');

var App = function() {
  var _ = {
    userLocationMarker: null,
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
      _.getUserLocation();
    },
    registerServiceWorker: function() {
      if('serviceWorker' in navigator) {
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
      if ('geolocation' in navigator) {
        _.geolocationWatchID = navigator.geolocation.watchPosition(function(position) {
          if (_.userLocationMarker) { // move marker
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            _.userLocationMarker.setLatLng([lat, long]);
          } else { //init
            _.userLocationMarker = new Marker('user', _.mapConfig.center).addTo(_.map);
          }
        });
      } else {
        console.log('Geolocation is not available.');
      }
    },
    createMap: function() {
      _.map = L.map('map', _.mapConfig);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(_.map);

      L.tileLayer.offline('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
          subdomains: '1234',
          minZoom: 13
        }
      ).addTo(_.map);
    },
    loadStaticStationData: function() {
      var request = new XMLHttpRequest();
      request.open('GET', '/data/Dublin.json', true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          console.log('data', data);
          _.stationMarkers = null;
          for (var i = 0; i < data.length; i++) {
            var lat = data[i].latitude;
            var long = data[i].longitude;
            new Marker('station', [lat, long]).addTo(_.map);
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
