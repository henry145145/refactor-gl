"use strict";

exports.__esModule = true;
exports.createDeckGLComponent = createDeckGLComponent;
exports.createCategoricalDeckGLComponent = createCategoricalDeckGLComponent;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _DeckGLContainer = _interopRequireDefault(require("./DeckGLContainer"));

var _CategoricalDeckGLContainer = _interopRequireDefault(require("./CategoricalDeckGLContainer"));

var _common = require("./layers/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const propTypes = {
  formData: _propTypes.default.object.isRequired,
  payload: _propTypes.default.object.isRequired,
  setControlValue: _propTypes.default.func.isRequired,
  viewport: _propTypes.default.object.isRequired,
  onAddFilter: _propTypes.default.func,
  setTooltip: _propTypes.default.func,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired
};
const defaultProps = {
  onAddFilter() {},

  setTooltip() {}

};

function createDeckGLComponent(getLayer, getPoints) {
  // Higher order component
  class Component extends _react.default.PureComponent {
    constructor(props) {
      super(props);
      const originalViewport = props.viewport;
      const viewport = props.formData.autozoom ? (0, _common.fitViewport)(originalViewport, getPoints(props.payload.data.features)) : originalViewport;
      this.state = {
        viewport,
        layer: this.computeLayer(props)
      };
      this.onViewportChange = this.onViewportChange.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      // Only recompute the layer if anything BUT the viewport has changed
      const nextFdNoVP = _extends({}, nextProps.formData, {
        viewport: null
      });

      const currFdNoVP = _extends({}, this.props.formData, {
        viewport: null
      });

      if (!(0, _lodash.isEqual)(nextFdNoVP, currFdNoVP) || nextProps.payload !== this.props.payload) {
        this.setState({
          layer: this.computeLayer(nextProps)
        });
      }

      const [oldFilter, newFilter] = [currFdNoVP.extra_filters, nextFdNoVP.extra_filters];
      const [diff, diff2] = [(0, _lodash.differenceWith)(oldFilter, newFilter, _lodash.isEqual), (0, _lodash.differenceWith)(newFilter, oldFilter, _lodash.isEqual)];

      if (diff.length || diff2.length) {
        const originalViewport = nextProps.viewport;
        const viewport = nextProps.formData.autozoom ? (0, _common.fitViewport)(originalViewport, getPoints(nextProps.payload.data.features)) : originalViewport;
        this.setState({
          viewport
        });
      }
    }

    onViewportChange(viewport) {
      this.setState({
        viewport
      });
    } // eslint-disable-next-line class-methods-use-this


    computeLayer(props) {
      const {
        formData,
        payload,
        onAddFilter,
        setTooltip
      } = props;
      return getLayer(formData, payload, onAddFilter, setTooltip);
    }

    render() {
      const {
        formData,
        payload,
        setControlValue,
        height,
        width
      } = this.props;
      const {
        layer,
        viewport
      } = this.state;
      console.log(formData);
      return _react.default.createElement(_DeckGLContainer.default, {
        mapboxApiAccessToken: payload.data.mapboxApiKey,
        viewport: viewport,
        layers: [layer],
        mapStyle: formData.mapbox_style,
        setControlValue: setControlValue,
        width: width,
        height: height,
        onViewportChange: this.onViewportChange
      });
    }

  }

  Component.propTypes = propTypes;
  Component.defaultProps = defaultProps;
  return Component;
}

function createCategoricalDeckGLComponent(getLayer, getPoints) {
  function Component(props) {
    const {
      formData,
      payload,
      setControlValue,
      setTooltip,
      viewport,
      width,
      height
    } = props;
    return _react.default.createElement(_CategoricalDeckGLContainer.default, {
      formData: formData,
      mapboxApiKey: payload.data.mapboxApiKey,
      setControlValue: setControlValue,
      viewport: viewport,
      getLayer: getLayer,
      payload: payload,
      setTooltip: setTooltip,
      getPoints: getPoints,
      width: width,
      height: height
    });
  }

  Component.propTypes = propTypes;
  Component.defaultProps = defaultProps;
  return Component;
}