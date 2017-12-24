'use strict';

var Delegate = function (criteria, listener) {
  return function(e) {
    var el = e.target;
    do {
      if (!criteria(el)) continue;
      e.delegateTarget = el;
      listener.apply(this, arguments);
      return;
    } while( (el = el.parentNode) );
  };
};

module.exports = Delegate;
