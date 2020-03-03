"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactMapGl = _interopRequireDefault(require("react-map-gl"));

var _deck = _interopRequireDefault(require("deck.gl"));

require("mapbox-gl/dist/mapbox-gl.css");

var _lodash = require("lodash");

require("./css/deckgl.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const TICK = 2000; // milliseconds

const propTypes = {
  viewport: _propTypes.default.object.isRequired,
  layers: _propTypes.default.array.isRequired,
  setControlValue: _propTypes.default.func,
  mapStyle: _propTypes.default.string,
  mapboxApiAccessToken: _propTypes.default.string.isRequired,
  onViewportChange: _propTypes.default.func,
  vizType: _propTypes.default.string
};
const defaultProps = {
  mapStyle: 'light',
  onViewportChange: () => {},
  setControlValue: () => {}
};

class DeckGLContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.onViewportChange = this.onViewportChange.bind(this); // This has to be placed after this.tick is bound to this

    this.state = {
      previousViewport: props.viewport,
      timer: setInterval(this.tick, TICK)
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.viewport !== prevState.viewport) {
      return {
        viewport: _extends({}, nextProps.viewport),
        previousViewport: prevState.viewport
      };
    }

    return null;
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  onViewportChange(viewport) {
    const vp = Object.assign({}, viewport); // delete vp.width;
    // delete vp.height;

    const newVp = _extends({}, this.state.previousViewport, {}, vp); // this.setState(() => ({ viewport: newVp }));


    this.props.onViewportChange(newVp);
  }

  tick() {
    // Limiting updating viewport controls through Redux at most 1*sec
    // Deep compare is needed as shallow equality doesn't work here, viewport object
    // changes id at every change
    if (this.state && !(0, _lodash.isEqual)(this.state.previousViewport, this.props.viewport)) {
      const setCV = this.props.setControlValue;
      const vp = this.props.viewport;

      if (setCV) {
        setCV('viewport', vp);
      }

      this.setState(() => ({
        previousViewport: this.props.viewport
      }));
    }
  }

  layers() {
    // Support for layer factory
    if (this.props.layers.some(l => typeof l === 'function')) {
      return this.props.layers.map(l => typeof l === 'function' ? l() : l);
    }

    return this.props.layers;
  }

  render() {
    console.log(this.props);
    const {
      viewport
    } = this.props;
    const {
      vizType
    } = this.props;
    const isPath = vizType === 'deck_path';
    return _react.default.createElement(_reactMapGl.default, _extends({}, viewport, {
      mapStyle: this.props.mapStyle,
      onViewportChange: this.onViewportChange,
      dragPan: !isPath,
      dragRotate: !isPath,
      scrollZoom: !isPath,
      doubleClickZoom: !isPath,
      mapboxApiAccessToken: this.props.mapboxApiAccessToken
    }), _react.default.createElement(_deck.default, _extends({}, viewport, {
      layers: this.layers(),
      initWebGLParameters: true
    })));
  }

}

exports.default = DeckGLContainer;
DeckGLContainer.propTypes = propTypes;
DeckGLContainer.defaultProps = defaultProps;