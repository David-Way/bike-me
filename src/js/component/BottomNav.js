'use strict';
var CONFIG = require('../config');
var Delegate = require('../util/Delegate');
var filter = require('array-filter');
var ACTION = 'bottom-nav__action';
var ACTION_ACTIVE = 'bottom-nav__action--active';
var BOTTOM_NAV = '.bottom-nav';
var ACTION_STATE = 'data-app-state';

var BottomNav = function(_callback) {
  this.callback = _callback;
  this.context = document.body;
  this.context.insertAdjacentHTML(
    'beforeend',
    document.getElementById('bottomNavTemplate').innerHTML
  );
  this.context.addEventListener(
    'click',
    new Delegate(this.actionFilter, this.handleActionClick.bind(this))
  );
  return this;
};

BottomNav.prototype.getBottomNavActions = function(bottomNav) {
  return filter(bottomNav.querySelectorAll('.' + ACTION), function (action) {
    return action.closest(BOTTOM_NAV) === bottomNav;
  });
};

BottomNav.prototype.actionFilter = function(_elem) {
  return _elem.classList && _elem.classList.contains(ACTION);
};

BottomNav.prototype.handleActionClick = function(_event) {
  var action = _event.delegateTarget;
  var bottomNav = action.closest(BOTTOM_NAV);
  if (!bottomNav) {
    console.log('Error', ACTION + ' is missing outer ' + BOTTOM_NAV);
  }
  var actionState = action.getAttribute(ACTION_STATE);
  var bottomNavActions = this.getBottomNavActions(bottomNav);

  for (var i = 0; i < bottomNavActions.length; i++) {
    if (bottomNavActions[i].getAttribute(ACTION_STATE) === actionState) {
      bottomNavActions[i].classList.add(ACTION_ACTIVE);
    } else {
      bottomNavActions[i].classList.remove(ACTION_ACTIVE);
    }
  }

  if (CONFIG.APP_STATE[actionState]) {
    this.callback(CONFIG.APP_STATE[actionState]);
  }
};

module.exports = BottomNav;
