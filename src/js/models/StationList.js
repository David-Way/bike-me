'use strict';

var CONFIG = require('../config');
var Delegate = require('../util/Delegate');
var Station = require('./Station');
var LoadingBar = require('../component/LoadingBar');

var StationList = function(_category, _User, _apiEndpoint, _map, _routeController, _visible) {
  this.visible = _visible;
  this.category = _category;
  this.User = _User;
  this.map = _map;
  this.routeController = _routeController;
  if (this.category === 'bus') {
    this.staticStationsDataURL = '/data/dublin-bus-stops.json';
    this.stationsAPIEndpoint = 'TODO';
  } else {
    this.staticStationsDataURL = '/data/dublin-bikes.json';
    this.stationsAPIEndpoint = _apiEndpoint + '/stations';
    this.infoCardTemplate =
      document.getElementById('bikeInfoCardTemplate').innerHTML;
  }
  this.stations = [];
  this.selectedStation = null;
  this.loadLatestDynamicStationDataWatchId = null;

  this.loadStationData(this.staticStationsDataURL);
  this.loadStationData(this.stationsAPIEndpoint);
  this.addEventListeners();

  this.loadLatestDynamicStationDataWatchId = setInterval(function () {
    this.loadStationData(this.stationsAPIEndpoint);
  }.bind(this), CONFIG.TIMER.DYNAMIC_BIKE_STATION_DATA);

  return this;
};

StationList.prototype.stationListed = function (stationData) {
  for (var i = 0; i < this.stations.length; i++) {
    if (this.stations[i].number === stationData.number) {
      return new Station(
        this.category,
        this.User,
        stationData,
        this.infoCardTemplate,
        this.routeController,
        this.stationSelectedCallback.bind(this)
      );
    }
  }
  return false;
};

StationList.prototype.updateStations = function (stationsData) {
  for (var i = 0; i < stationsData.length; i++) {
    var stationData = stationsData[i];
    var listedStation = this.stationListed(stationData);
    if (listedStation) { // update it if its listed
      this.stations[i].removeFromMap(this.map);
      this.stations[i] = listedStation;
      if (this.visible) {
        this.stations[i].addToMap(this.map);
      }
      if (this.stations[i].getSelectedState()) { // if the station is selected
        this.stations[i].showInfoPanel();        // get it to 'update' its info panel
      }
    } else { // create it if it's not listed
      var station = new Station(
        this.category,
        this.User,
        stationData,
        this.infoCardTemplate,
        this.routeController,
        this.stationSelectedCallback.bind(this)
      );
      if (this.visible) {
        station.addToMap(this.map);
      }
      this.stations.push(station);
    }
  }
};

StationList.prototype.stationSelectedCallback = function (_selectedStation) {
  if (this.selectedStation && this.selectedStation !== _selectedStation) {
    this.selectedStation.hideItinerary();
  }
  for (var i = 0; i < this.stations.length; i++) {
    if (this.stations[i].number !== _selectedStation.number) {
      this.stations[i].setSelectedState(false);
    } else { // found selected station
      this.stations[i].toggleSelectedState();
      if (this.stations[i].getSelectedState()) {
        this.selectedStation = this.stations[i];
        this.stations[i].showInfoPanel();
        this.stations[i].showDirections();
      } else { //hide info panel
        this.selectedStation = null;
        this.stations[i].hideInfoPanel();
        this.stations[i].hideItinerary();
        this.stations[i].hideDirections();
      }
    }
  }
};

StationList.prototype.loadStationData = function (_dataURL) {
  var ctx = document.getElementsByClassName('leaflet-top leaflet-center')[0];
  var loadingBar = new LoadingBar(ctx);
  loadingBar.init();
  var request = new XMLHttpRequest();
  request.open('GET', _dataURL, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      this.updateStations(data);
    } else { // TODO handle Error
      clearTimeout(this.loadLatestDynamicStationDataWatchId);
      loadingBar.remove();
    }
    loadingBar.finish();
  }.bind(this);
  request.onerror = function(error) { // TODO handle Error
    console.log('Error loading latest station data:', _dataURL, error);
    loadingBar.remove();
  };
  return request.send();
};

StationList.prototype.setCategory = function (_category) {
  this.category = _category;
  for (var i = 0; i < this.stations.length; i++) {
    this.stations[i].setCategory(this.map, this.category);
  }
};

StationList.prototype.show = function () {
  if (!this.visible) {
    this.visible = true;
    for (var i = 0; i < this.stations.length; i++) {
      this.stations[i].addToMap(this.map);
    }
  }
};

StationList.prototype.hide = function () {
  if (this.visible) {
    this.visible = false;
    for (var i = 0; i < this.stations.length; i++) {
      this.stations[i].removeFromMap(this.map);
    }
  }
};

StationList.prototype.addEventListeners = function () {
  var body = document.querySelector('body');
  var buttonsFilter = function(elem) {
    return elem.classList && elem.classList.contains('info-card__toggle-route');
  };
  var buttonHandler = function(e) {
    e.stopPropagation();
    if (this.visible) {
      var button = e.delegateTarget;
      if(!button.classList.contains('active')) {
        button.classList.add('active');
        button.innerHTML = 'Close routes';
        this.selectedStation.showItinerary();
      } else {
        button.classList.remove('active');
        button.innerHTML = 'Open routes';
        if (this.selectedStation) {
          this.selectedStation.hideItinerary();
        }
      }
    }
  }.bind(this);
  body.addEventListener(
		'click',
		new Delegate(buttonsFilter, buttonHandler)
	);
};

StationList.prototype.removeEventListeners = function () {
  // TODO
};

module.exports = StationList;
