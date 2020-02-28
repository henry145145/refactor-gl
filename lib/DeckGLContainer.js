"use strict";

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.some");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactMapGl = require("react-map-gl");

var _deck = _interopRequireDefault(require("deck.gl"));

require("mapbox-gl/dist/mapbox-gl.css");

require("./css/deckgl.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var TICK = 250; // milliseconds

var propTypes = {
  viewport: _propTypes.default.object.isRequired,
  layers: _propTypes.default.array.isRequired,
  setControlValue: _propTypes.default.func,
  onViewportChange: _propTypes.default.func,
  mapStyle: _propTypes.default.string,
  mapboxApiAccessToken: _propTypes.default.string.isRequired,
  children: _propTypes.default.node,
  bottomMargin: _propTypes.default.number,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired
};
var defaultProps = {
  mapStyle: 'light',
  setControlValue: function setControlValue() {},
  children: null,
  bottomMargin: 0
};

var DeckGLContainer = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DeckGLContainer, _React$Component);

  function DeckGLContainer(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.tick = _this.tick.bind(_assertThisInitialized(_this)); // This has to be placed after this.tick is bound to this

    _this.state = {
      timer: setInterval(_this.tick, TICK),
      viewState: _this.props.viewport
    };
    _this.onViewStateChange = _this.onViewStateChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = DeckGLContainer.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    clearInterval(this.state.timer);
  };

  _proto.onViewStateChange = function onViewStateChange(_ref) {
    var viewState = _ref.viewState;
    this.setState({
      viewState: viewState,
      lastUpdate: Date.now()
    });
  };

  _proto.tick = function tick() {
    // Rate limiting updating viewport controls as it triggers lotsa renders
    var lastUpdate = this.state.lastUpdate;

    if (lastUpdate && Date.now() - lastUpdate > TICK) {
      var setCV = this.props.setControlValue;

      if (setCV) {
        setCV('viewport', this.state.viewState);
      }

      this.setState({
        lastUpdate: null
      });
    }
  };

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var viewport = nextProps.viewport;
    this.setState({
      viewState: viewport
    });
  };

  _proto.layers = function layers() {
    // Support for layer factory
    if (this.props.layers.some(function (l) {
      return typeof l === 'function';
    })) {
      return this.props.layers.map(function (l) {
        return typeof l === 'function' ? l() : l;
      });
    }

    return this.props.layers;
  };

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        bottomMargin = _this$props.bottomMargin,
        height = _this$props.height,
        width = _this$props.width;
    var viewState = this.state.viewState;
    var adjustedHeight = height - bottomMargin;
    var layers = this.layers();
    console.log(layers);
    return _react.default.createElement("div", {
      style: {
        position: 'relative',
        width: width,
        height: adjustedHeight
      }
    }, _react.default.createElement(_deck.default, {
      initWebGLParameters: true,
      controller: true,
      width: width,
      height: adjustedHeight,
      layers: layers,
      viewState: viewState,
      onViewStateChange: this.onViewStateChange
    }, _react.default.createElement(_reactMapGl.StaticMap, {
      mapStyle: this.props.mapStyle,
      mapboxApiAccessToken: this.props.mapboxApiAccessToken
    })), children);
  };

  return DeckGLContainer;
}(_react.default.Component);

exports.default = DeckGLContainer;
DeckGLContainer.propTypes = propTypes;
DeckGLContainer.defaultProps = defaultProps;