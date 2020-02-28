"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DeckGLContainer = _interopRequireDefault(require("./DeckGLContainer"));

var _PlaySlider = _interopRequireDefault(require("./components/PlaySlider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var PLAYSLIDER_HEIGHT = 20; // px

var propTypes = {
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
  onValuesChange: _propTypes.default.func,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired
};
var defaultProps = {
  aggregation: false,
  disabled: false,
  mapStyle: 'light',
  setControlValue: function setControlValue() {},
  onValuesChange: function onValuesChange() {}
};

var AnimatableDeckGLContainer = /*#__PURE__*/function (_React$PureComponent) {
  _inheritsLoose(AnimatableDeckGLContainer, _React$PureComponent);

  function AnimatableDeckGLContainer() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = AnimatableDeckGLContainer.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        start = _this$props.start,
        end = _this$props.end,
        getStep = _this$props.getStep,
        disabled = _this$props.disabled,
        aggregation = _this$props.aggregation,
        children = _this$props.children,
        getLayers = _this$props.getLayers,
        values = _this$props.values,
        onValuesChange = _this$props.onValuesChange,
        viewport = _this$props.viewport,
        setControlValue = _this$props.setControlValue,
        mapStyle = _this$props.mapStyle,
        mapboxApiAccessToken = _this$props.mapboxApiAccessToken,
        height = _this$props.height,
        width = _this$props.width;
    var layers = getLayers(values);
    return _react.default.createElement("div", null, _react.default.createElement(_DeckGLContainer.default, {
      viewport: viewport,
      layers: layers,
      setControlValue: setControlValue,
      mapStyle: mapStyle,
      mapboxApiAccessToken: mapboxApiAccessToken,
      bottomMargin: disabled ? 0 : PLAYSLIDER_HEIGHT,
      width: width,
      height: height
    }), !disabled && _react.default.createElement(_PlaySlider.default, {
      start: start,
      end: end,
      step: getStep(start),
      values: values,
      range: !aggregation,
      onChange: onValuesChange
    }), children);
  };

  return AnimatableDeckGLContainer;
}(_react.default.PureComponent);

exports.default = AnimatableDeckGLContainer;
AnimatableDeckGLContainer.propTypes = propTypes;
AnimatableDeckGLContainer.defaultProps = defaultProps;