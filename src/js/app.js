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
    User: null,
    map: null,
    routeController: null, // used for route finding
    BikeStationList: [],   // list of bike stations
    BusStationList: [],   // list of bus stations/stops
    apiEndpoint: CONFIG.API_END_POINT,
    mapboxKey: CONFIG.MAPBOX_KEY,
    state: CONFIG.APP_STATE.DEFAULT,
    init: function() {
      _.registerServiceWorker();
      _.createMap();
      _.createRouteController();
      _.getUserLocation();
      _.getStationsList();
      _.setState();
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
      new BottomNav(this.setState.bind(this));
    },
    setState: function(_state) {
      if (this.state !== _state) {
        this.state = _state;
        switch (this.state) {
          case CONFIG.APP_STATE.BIKES:
            _.BikeStationList.setCategory('bike');
            _.BikeStationList.show();
            break;
          case CONFIG.APP_STATE.STANDS:
            _.BikeStationList.setCategory('stands');
            _.BikeStationList.show();
            break;
          case CONFIG.APP_STATE.BUS_STOPS:
            _.BikeStationList.hide();
            break;
          default:
        }
      }
    }
  };

  return {
    init: _.init
  };
}();

App.init();
