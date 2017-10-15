'use strict';

var CONFIG = require('./config');
var User = require('./util/User');
var L = require('leaflet');
var LeafletMap = require('./models/LeafletMap');
var StationList = require('./models/StationList');
require('classlist-polyfill');

var App = function() {
  var _ = {
    User: null,
    map: null,
    routeController: null, // used for route finding
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
      _.map = new LeafletMap();
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
        show: false,
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
