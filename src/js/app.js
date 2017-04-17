var $ = jQuery = require('jquery');
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

  $.getJSON('/data/Dublin.json', function(data) {
    console.log('data', data);

		$('main').append('<pre>'+JSON.stringify(data)+'</pre>');
  });

  $('.reload').click(function() {
    window.location.reload();
  });

  return {
    
  };
})(); //Page Ready
