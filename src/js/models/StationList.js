'use strict';

var CONFIG = require('../config');
var Station = require('./Station');
var LoadingBar = require('../component/LoadingBar');

var StationList = function(_User, _apiEndpoint, _map, _routeController) {
  this.User = _User;
  this.map = _map;
  this.routeController = _routeController;
  this.staticStationsDataURL = '/data/Dublin.json';
  this.stationsAPIEndpoint = _apiEndpoint + '/stations';
  this.stations = [];
  this.selectedStation = null;
  this.loadLatestDynamicStationDataWatchId = null;
  this.infoCardTemplate = document.getElementById('infoCardTemplate').innerHTML;

  return this.init();
};

StationList.prototype.init = function() {
  this.loadStaticStationData();
  this.loadLatestDynamicStationData();

  this.loadLatestDynamicStationDataWatchId = setInterval(function () {
    this.loadLatestDynamicStationData();
  }.bind(this), CONFIG.timer.dynamicStationData);

  return this;
};

StationList.prototype.stationListed = function (stationData) {
  for (var i = 0; i < this.stations.length; i++) {
    if (this.stations[i].number === stationData.number) {
      return new Station(
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
      this.stations[i].addToMap(this.map);
      if (this.stations[i].getSelectedState()) { // if the station is selected
        this.stations[i].showInfoPanel();        // get it to 'update' its info panel
      }
    } else { // create it if it's not listed
      var station = new Station(
        this.User,
        stationData,
        this.infoCardTemplate,
        this.routeController,
        this.stationSelectedCallback.bind(this)
      );
      station.addToMap(this.map);
      this.stations.push(station);
    }
  }
};

StationList.prototype.stationSelectedCallback = function (_selectedStation) {
  this.selectedStation = _selectedStation;
  for (var i = 0; i < this.stations.length; i++) {
    if (this.stations[i].number !== _selectedStation.number) {
      this.stations[i].setSelectedState(false);
    } else { // found selected station
      this.stations[i].toggleSelectedState();
      if (this.stations[i].getSelectedState()) {
        this.stations[i].showInfoPanel();
        this.stations[i].showDirections();
      } else { //hide info panel
        this.stations[i].hideInfoPanel();
        this.stations[i].hideDirections();
      }
    }
  }
};

// TODO DRY this out - loadStaticStationData ~== loadLatestDynamicStationData
StationList.prototype.loadStaticStationData = function () {
  var ctx = document.getElementsByClassName('leaflet-top leaflet-center')[0];
  var loadingBar = new LoadingBar(ctx);
  loadingBar.init();
  var request = new XMLHttpRequest();
  request.open('GET', this.staticStationsDataURL, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      this.updateStations(data);
    } else { // TODO handle Error
      loadingBar.remove();
    }
    loadingBar.finish();
  }.bind(this);
  request.onerror = function(error) { // TODO handle Error
    console.log('Error loading latest static station data:', error);
    loadingBar.remove();
  };
  return request.send();
};

StationList.prototype.loadLatestDynamicStationData = function() {
  var ctx = document.getElementsByClassName('leaflet-top leaflet-center')[0];
  var loadingBar = new LoadingBar(ctx);
  loadingBar.init();
  var request = new XMLHttpRequest();
  request.open('GET', this.stationsAPIEndpoint, true);
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
    console.log('Error loading latest dynamic station data:', error.target.status);
    loadingBar.remove();
  };
  return request.send();
};

module.exports = StationList;
