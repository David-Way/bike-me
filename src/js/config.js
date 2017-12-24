'use strict';

const Config = function () {
  this.APP_STATE = {
    BIKES: 0,
    STANDS: 1,
    BUS_STOPS: 2,
  };
  this.API_END_POINT = 'https://mysterious-temple-97993.herokuapp.com';
  this.MAPBOX_KEY = 'pk.eyJ1IjoiZGF2aWR3YXkiLCJhIjoiY2' +
  'ozajJ4MTZkMDBxbDMzbWtncWd3bnQzNS' +
  'J9.p2VfQYvfnB0K29kkixl08A';
  this.COLOR = {
    PRIMARY: '#FF1744',
    SECONDARY: '#17FFD2',
    BLACK: '#000000',
    WHITE: '#ffffff',
    SUCCESS: '#3CE7A2',
    WARNING: '#E7A23C',
    DANGER: '#C0392b',
  };
  this.TIMER = {
    DYNAMIC_BIKE_STATION_DATA: 30000,
  };
  this.MAP_CONFIG = { // map init config
    center: [ 54.3470, -6.2589 ],
    zoomControl: false,
    zoom: 14,
    minZoom: 13,
    maxBounds: [
      [ 53.3233, -6.3178 ],
      [ 53.3764, -6.1832 ]
    ],
    tap: true,
    attributionControl: false,
  };
  this.OFFLINE = {
    subdomains: '1234',
    minZoom: 13,
  };
  this.map = { // map styling
    lineOptions: {
      styles: [{
        color: this.COLOR.PRIMARY,
        opacity: 1,
        weight: 5,
      }]
    },
    altLineOptions: {
      styles: [{
        color: this.COLOR.BLACK,
        opacity: 0.15,
        weight: 8,
      }]
    },
    routeItinerary: { // used to display itineraries as text in a control
      pointMarkerStyle: {
        radius: 5,
        color: this.COLOR.SUCCESS,
        fillColor: this.COLOR.WHITE,
        opacity: 1,
        fillOpacity: 0.15,
      }
    },
    summaryTemplate: '<div class="leaflet-routing-alt__heading">' +
      '<div class="leaflet-routing-alt__label"></div><div>' +
      '<h2 class="leaflet-routing-alt__title">{name}</h2>' +
      '<h3 class="leaflet-routing-alt__sub-title">{distance}, {time}</h3>' +
      '</div></div>',
  };
  this.ZOOM_CONTROL = {
    position: 'bottomright',
    zoom: 14,
    minZoom: 13,
    maxBounds: [
      [ 53.3233, -6.3178 ],
      [ 53.3764, -6.1832 ],
    ],
  };
  this.PATHS = {
    ICON_BASE_URL: '../images/icons/',
  };
};

module.exports = new Config();
