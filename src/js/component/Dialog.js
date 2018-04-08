'use strict';

var uniqid = require('uniqid');
var Delegate = require('../util/Delegate');
var ACTION = 'button';
var ACTION_STATE = 'data-action';

var Dialog = function(_templateId, _callback, _actionFilter) {
  this.id = uniqid();
  this.templateId = _templateId;
  this.callback = _callback;
  this.context = document.body;
  this.template = document.getElementById(
    this.templateId
  ).innerHTML.replace(
    'id="#"',
    'id="' + this.id + '"'
  );
  this.event = new Delegate(
    _actionFilter || this.actionFilter,
    this.handleActionClick.bind(this)
  );
  this.context.insertAdjacentHTML(
    'beforeend',
    this.template
  );
  this.context.addEventListener(
    'click',
    this.event
  );
  this.element = document.getElementById(this.id);
  return this;
};

Dialog.prototype.remove = function () {
  this.element.parentNode.removeChild(this.element);
  this.context.removeEventListener('click', this.event);
};

Dialog.prototype.actionFilter = function(_elem) {
  return _elem.classList && _elem.classList.contains(ACTION);
};

Dialog.prototype.handleActionClick = function(_event) {
  var action = _event.delegateTarget;
  console.log('action', action);
  switch (action.getAttribute(ACTION_STATE)) {
    case 'confirm':
      this.callback();
      this.remove();
      break;
    case 'deny':
      this.remove();
      break;
    default:
  }
};

module.exports = Dialog;
