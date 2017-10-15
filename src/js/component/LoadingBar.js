'use strict';

window.requestAnimFrame = function(){
  return (
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(/* function */ callback){
      window.setTimeout(callback, 1000 / 60);
    }
  );
}();

var LoadingBar = function(_context) {
  this.context = _context;
  this.start = null;
  this.element = null;
	this.phase = 0;
  this.pausePoint = 40;
  return this;
};

LoadingBar.prototype.init = function() {
  if (this.context.querySelector('.drip-loader') === null) {
    this.element = document.createElement('div');
    this.element.className = 'drip-loader phase-1';
    var dripLoaderLeft = document.createElement('span');
    dripLoaderLeft.className = 'drip-loader__left';
    var dripLoaderCenter = document.createElement('span');
    dripLoaderCenter.className = 'drip-loader__center';
    var dripLoaderRight = document.createElement('span');
    dripLoaderRight.className = 'drip-loader__right';
    this.element.appendChild(dripLoaderLeft);
    this.element.appendChild(dripLoaderCenter);
    this.element.appendChild(dripLoaderRight);
    this.context.appendChild(this.element);
  }

  return this;
};

LoadingBar.prototype.go = function(_percentage) {
  if (true) {
    this.percentage = _percentage;
  }
};

LoadingBar.prototype.remove = function() {
  if (this.element) {
    this.element.remove();
  }
  return true;
};

LoadingBar.prototype.finish = function() {
  if (this.element) {
    this.element.classList.remove('phase-1');
    this.element.classList.add('phase-2');
    window.setTimeout(function() {
      this.element.remove();
    }.bind(this), 1600);
  }

  return true;
};

module.exports = LoadingBar;
