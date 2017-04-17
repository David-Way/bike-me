'use strict';

var Handlebars = require('handlebars');
var L = require('leaflet');
require('leaflet.offline');

var app = (function() {

  var app = {

  };

  if('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function() {
        console.log('Service Worker Active');
      });
  }

  app.map = L.map('map', {
    center: [53.3470, -6.2589],
    zoom: 14,
    minZoom: 13,
    maxBounds: [
      [53.3233, -6.3178],
      [53.3764, -6.1832]
    ],
    tap: true,
    attributionControl: false
  });

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '',
  }).addTo(app.map);

  L.tileLayer.offline('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      subdomains: '1234',
      minZoom: 13
    }
  ).addTo(app.map);

  var request = new XMLHttpRequest();
  request.open('GET', '/data/Dublin.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      console.log('data', data);

  		//$('main').append('<pre>'+JSON.stringify(data)+'</pre>');
    } else {
      // We reached our target server, but it returned an error

    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();

  return {

  };
})(); //Page Ready
