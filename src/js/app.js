'use strict';

var L = require('leaflet');
require('leaflet.offline');
require('leaflet-routing-machine');
var CONFIG = require('./config');
var StationList = require('./models/StationList');
var User = require('./util/User');

var App = function() {
  var _ = {
    User: null,
    map: null,
    routeController: null, // used for route finding
    routeItinerary: null,  // used to display itineraries as text in a control
    StationList: [],       // list of stations
    apiEndpoint: CONFIG.apiEndpoint,
    mapboxKey: CONFIG.mapboxKey,
    init: function() {
      _.registerServiceWorker();
      _.createMap();
      _.createRouteController();
      _.getUserLocation();
      _.getStationList();
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
      _.map = L.map('map', CONFIG.mapConfig);
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
    createRouteController: function() {
			var mapboxRouter = L.Routing.mapbox(_.mapboxKey);
			mapboxRouter.options.profile = 'mapbox/walking';
      _.routeController = L.Routing.control({
        router: mapboxRouter,
        lineOptions: {
          styles: CONFIG.map.lineOptionsStyles,
        },
        altLineOptions: {
          styles: CONFIG.map.altLineOptionsStyles
        },
        createMarker: function() { return null; },
        pointMarkerStyle: CONFIG.map.routeItinerary.pointMarkerStyle,
        show: true,
      }).addTo(_.map);
    },
    getStationList: function() {
      _.StationList = new StationList(_.User, _.apiEndpoint, _.map, _.routeController);
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
