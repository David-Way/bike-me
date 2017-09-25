'use strict';

var Station = require('./Station');
var CONFIG = require('../config');

var StationList = function(_User, _apiEndpoint, _map, _routeController) {
  this.User = _User;
  this.map = _map;
  this.routeController = _routeController;
  this.staticStationsDataURL = '/data/Dublin.json';
  this.stationsAPIEndpoint = _apiEndpoint + '/stations';
  this.stations = [];
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
      return new Station(this.User, stationData, this.infoCardTemplate, this.routeController);
    }
  }
  return false;
};

StationList.prototype.updateStations = function (stationsData) {
  for (var i = 0; i < stationsData.length; i++) {
    var stationData = stationsData[i];
    var listedStation = this.stationListed(stationData);
    if (listedStation) { // update it
      this.stations[i].removeFromMap(this.map);
      this.stations[i] = listedStation;
      this.stations[i].addToMap(this.map);
    } else { // create it
      var station = new Station(
        this.User,
        stationData,
        this.infoCardTemplate,
        this.routeController
      );
      station.addToMap(this.map);
      this.stations.push(station);
    }
  }
};

StationList.prototype.loadStaticStationData = function () {
  var request = new XMLHttpRequest();
  request.open('GET', this.staticStationsDataURL, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      this.updateStations(data);
    } else { // TODO handle Error

    }
  }.bind(this);
  request.onerror = function(error) { // TODO handle Error
    console.log('Error loading latest dynamic station data:', error);
  };
  request.send();
};

StationList.prototype.loadLatestDynamicStationData = function() {
  var request = new XMLHttpRequest();
  request.open('GET', this.stationsAPIEndpoint, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      this.updateStations(data);
    } else { // TODO handle Error
      clearTimeout(this.loadLatestDynamicStationDataWatchId);
    }
    this.hideLoadingIcon();
  }.bind(this);
  request.onerror = function(error) { // TODO handle Error
    console.log('Error loading latest dynamic station data:', error.target.status);
    this.hideLoadingIcon();
  };

  this.showLoadingIcon();
  request.send();
};

StationList.prototype.showLoadingIcon = function () {
  //test
  console.log('showing loading icon');
};

StationList.prototype.hideLoadingIcon = function () {
  //test 2
  console.log('hiding loading icon');
};

module.exports = StationList;
