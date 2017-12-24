'use strict';

var CONFIG = require('./config');
var User = require('./util/User');
var L = require('leaflet');
var LeafletMap = require('./models/LeafletMap');
var StationList = require('./models/StationList');
var BottomNav = require('./component/BottomNav');
require('classlist-polyfill');

var App = function() {
  var _ = {
    state: CONFIG.APP_STATE.BIKES,
    User: null,
    map: null,
    routeController: null, // used for route finding
    BikeStationList: [],   // list of bike stations
    BusStationList: [],   // list of bus stations/stops
    apiEndpoint: CONFIG.API_END_POINT,
    mapboxKey: CONFIG.MAPBOX_KEY,
    init: function() {
      _.registerServiceWorker();
      _.createMap();
      _.createRouteController();
      _.getUserLocation();
      _.getStationsList();
      _.createUI();
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
        lineOptions: CONFIG.map.lineOptions,
        altLineOptions: CONFIG.map.altLineOptions,
        createMarker: function() { return null; },
        pointMarkerStyle: CONFIG.map.routeItinerary.pointMarkerStyle,
        summaryTemplate: CONFIG.map.summaryTemplate,
        show: false,
      }).addTo(_.map);
    },
    getStationsList: function() {
      _.BikeStationList = new StationList('bike', _.User, _.apiEndpoint, _.map, _.routeController);
      //_.BusStationList = new StationList('bus', _.User, _.apiEndpoint, _.map, _.routeController);
    },
    getUserLocation: function() {
      // TODO ask user for permission first
      // developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      _.User = new User(_.map);
      _.User.addToMap(_.map);
    },
    createUI: function() {
      new BottomNav();
    },
  };

  return {
    init: _.init
  };
}();

App.init();
