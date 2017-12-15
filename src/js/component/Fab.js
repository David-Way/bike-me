'use strict';

var Fab = function(_context, _classList, _label, _callback) {
  this.context = _context;
  this.element = document.createElement('button');
  this.element.className = 'fab ' + _classList;
  this.element.appendChild(_label);
  this.callback = _callback;
  if (_callback) {
    this.element.addEventListener('click', this.callback);
  }
  this.context.appendChild(this.element);
  return this;
};

Fab.prototype.remove = function() {
  if (this.element) {
    this.element.removeEventListener('click', this.callback);
    this.element.remove();
  }
  return true;
};

module.exports = Fab;
