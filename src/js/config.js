'use strict';

const Config = function () {
  this.apiEndpoint = 'https://mysterious-temple-97993.herokuapp.com';
  this.mapboxKey = 'pk.eyJ1IjoiZGF2aWR3YXkiLCJhIjoiY2' +
  'ozajJ4MTZkMDBxbDMzbWtncWd3bnQzNS' +
  'J9.p2VfQYvfnB0K29kkixl08A';
  this.mapConfig = {
    center: [ 54.3470, -6.2589 ],
    zoom: 14,
    minZoom: 13,
    maxBounds: [
      [ 53.3233, -6.3178 ],
      [ 53.3764, -6.1832 ]
    ],
    tap: true,
    attributionControl: false
  };
  this.color = {
    primary: '#FF1744',
    secondary: '#17FFD2',
    black: '#000000',
    white: '#ffffff',
    success: '#3CE7A2',
    warning: '#E7A23C',
    danger: '#C0392b',
  };
  this.map = {
    lineOptionsStyles: [{
      color: this.color.primary,
      opacity: 1,
      weight: 5
    }],
    altLineOptionsStyles: [{
      color: this.color.black,
      opacity: 0.15,
      weight: 8
    }],
    routeItinerary: {
      pointMarkerStyle: {
        radius: 5,
        color: this.color.success,
        fillColor: this.color.white,
        opacity: 1,
        fillOpacity: 0.15,
      }
    },
  };
  this.timer = {
    dynamicStationData: 30000,
  };
};

module.exports = new Config();
