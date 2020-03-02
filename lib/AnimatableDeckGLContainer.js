"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DeckGLContainer = _interopRequireDefault(require("./DeckGLContainer"));

var _PlaySlider = _interopRequireDefault(require("./components/PlaySlider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const PLAYSLIDER_HEIGHT = 20; // px

const propTypes = {
  getLayers: _propTypes.default.func.isRequired,
  start: _propTypes.default.number.isRequired,
  end: _propTypes.default.number.isRequired,
  getStep: _propTypes.default.func,
  values: _propTypes.default.array.isRequired,
  aggregation: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  viewport: _propTypes.default.object.isRequired,
  children: _propTypes.default.node,
  mapStyle: _propTypes.default.string,
  mapboxApiAccessToken: _propTypes.default.string.isRequired,
  setControlValue: _propTypes.default.func,
  onViewportChange: _propTypes.default.func,
  onValuesChange: _propTypes.default.func
};
const defaultProps = {
  aggregation: false,
  disabled: false,
  mapStyle: 'light',
  setControlValue: () => {},
  onViewportChange: () => {},
  onValuesChange: () => {}
};

class AnimatableDeckGLContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    this.onViewportChange = this.onViewportChange.bind(this);
  }

  onViewportChange(viewport) {
    const originalViewport = this.props.disabled ? _extends({}, viewport) : _extends({}, viewport, {
      height: viewport.height + PLAYSLIDER_HEIGHT
    });
    this.props.onViewportChange(originalViewport);
  }

  render() {
    const {
      start,
      end,
      getStep,
      disabled,
      aggregation,
      children,
      getLayers,
      values,
      onValuesChange,
      viewport,
      setControlValue,
      mapStyle,
      mapboxApiAccessToken
    } = this.props;
    const layers = getLayers(values); // leave space for the play slider

    const modifiedViewport = _extends({}, viewport, {
      height: disabled ? viewport.height : viewport.height - PLAYSLIDER_HEIGHT
    });

    return _react.default.createElement("div", null, _react.default.createElement(_DeckGLContainer.default, {
      viewport: modifiedViewport,
      layers: layers,
      setControlValue: setControlValue,
      mapStyle: mapStyle,
      mapboxApiAccessToken: mapboxApiAccessToken,
      onViewportChange: this.onViewportChange
    }), !disabled && _react.default.createElement(_PlaySlider.default, {
      start: start,
      end: end,
      step: getStep(start),
      values: values,
      range: !aggregation,
      onChange: onValuesChange
    }), children);
  }

}

exports.default = AnimatableDeckGLContainer;
AnimatableDeckGLContainer.propTypes = propTypes;
AnimatableDeckGLContainer.defaultProps = defaultProps;