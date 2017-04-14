'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var isRouteEqual = function isRouteEqual(prevState, nextState) {
  if (prevState === nextState) return true;
  if (prevState.pathname !== nextState.pathname) return false;
  if (prevState.search !== nextState.search) return false;

  var a = prevState.state;
  var b = nextState.state;

  for (var k in a) {
    if (a.hasOwnProperty(k) && (!b.hasOwnProperty(k) || a[k] !== b[k])) {
      return false;
    }
  }
  for (var k in b) {
    if (b.hasOwnProperty(k) && !a.hasOwnProperty(k)) {
      return false;
    }
  }
  return true;
};

var pushState = {
  id: 'router/history/pushedState',
  dispatch: function dispatch(x) {
    return x;
  }
};

exports.pushState = pushState;
var replaceState = {
  id: 'router/history/replacedState',
  dispatch: function dispatch(x) {
    return x;
  }
};

exports.replaceState = replaceState;
var updatedHistory = {
  id: 'router/history/updatedHistory',
  dispatch: function dispatch(x) {
    return x;
  }
};

var makeHistoryStore = function makeHistoryStore(history) {
  return {
    displayName: 'AltHistoryStore',

    state: {},

    lifecycle: {
      bootstrap: function bootstrap(currentState) {
        var state = currentState.state;
        var pathname = currentState.pathname;
        var query = currentState.query;

        history.replaceState(state, pathname, query);
      }
    },

    bindListeners: {
      push: pushState.id,
      replace: replaceState.id,
      update: updatedHistory.id
    },

    push: function push(data) {
      var state = data.state;
      var pathname = data.pathname;
      var query = data.query;

      history.pushState(state, pathname, query);
      this.setState(data);
    },

    replace: function replace(data) {
      var state = data.state;
      var pathname = data.pathname;
      var query = data.query;

      history.replaceState(state, pathname, query);
      this.setState(data);
    },

    update: function update(data) {
      this.setState(data);
      this.preventDefault();
    }
  };
};

var dispatchable = function dispatchable(flux, action) {
  return function (state, pathname, query) {
    return flux.dispatch(action, { state: state, pathname: pathname, query: query });
  };
};

var AltRouter = (function (_React$Component) {
  _inherits(AltRouter, _React$Component);

  _createClass(AltRouter, null, [{
    key: 'contextTypes',
    value: {
      flux: _react2['default'].PropTypes.object
    },
    enumerable: true
  }]);

  function AltRouter(props, context) {
    var _this = this;

    _classCallCheck(this, AltRouter);

    _get(Object.getPrototypeOf(AltRouter.prototype), 'constructor', this).call(this, props, context);

    var flux = props.flux || context.flux;

    this.history = props.history;
    this.routes = typeof props.routes === 'function' ? props.routes(flux) : props.routes;

    var store = flux.createStore(makeHistoryStore(this.history));

    flux.router = {
      pushState: dispatchable(flux, pushState),
      replaceState: dispatchable(flux, replaceState),
      store: store
    };

    var prevState = {};

    this.historyListener = this.history.listen(function (routerState) {
      console.log(routerState);
      if (_this.history.getCurrentLocation) {
        console.log(_this.history.getCurrentLocation());
      }
      if (!isRouteEqual(prevState, routerState)) {
        setTimeout(function () {
          return flux.dispatch(updatedHistory, routerState);
        });
        prevState = routerState;
      }
    });
  }

  _createClass(AltRouter, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.historyListener();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(_reactRouter.Router, { history: this.history, routes: this.routes });
    }
  }]);

  return AltRouter;
})(_react2['default'].Component);

exports['default'] = AltRouter;