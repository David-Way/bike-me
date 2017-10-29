'use strict';

const Config = function () {
  this.apiEndpoint = 'https://mysterious-temple-97993.herokuapp.com';
  this.mapboxKey = 'pk.eyJ1IjoiZGF2aWR3YXkiLCJhIjoiY2' +
  'ozajJ4MTZkMDBxbDMzbWtncWd3bnQzNS' +
  'J9.p2VfQYvfnB0K29kkixl08A';
  this.color = {
    primary: '#FF1744',
    secondary: '#17FFD2',
    black: '#000000',
    white: '#ffffff',
    success: '#3CE7A2',
    warning: '#E7A23C',
    danger: '#C0392b',
  };
  this.timer = {
    dynamicStationData: 30000,
  };
  this.mapConfig = { // map init config
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
  this.offline = {
    subdomains: '1234',
    minZoom: 13,
  };
  this.map = { // map styling
    lineOptions: {
      styles: [{
        color: this.color.primary,
        opacity: 1,
        weight: 5,
      }]
    },
    altLineOptions: {
      styles: [{
        color: this.color.black,
        opacity: 0.15,
        weight: 8,
      }]
    },
    routeItinerary: { // used to display itineraries as text in a control
      pointMarkerStyle: {
        radius: 5,
        color: this.color.success,
        fillColor: this.color.white,
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
  this.zoomControl = {
    position: 'bottomright',
    zoom: 14,
    minZoom: 13,
    maxBounds: [
      [ 53.3233, -6.3178 ],
      [ 53.3764, -6.1832 ],
    ],
  };
  this.paths = {
    iconBaseUrl: '../images/icons/',
  };
};

module.exports = new Config();
