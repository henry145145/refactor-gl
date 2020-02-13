"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _mousetrap = _interopRequireDefault(require("mousetrap"));

var _translation = require("@superset-ui/translation");

var _BootstrapSliderWrapper = _interopRequireDefault(require("./BootstrapSliderWrapper"));

require("./PlaySlider.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var propTypes = {
  start: _propTypes.default.number.isRequired,
  step: _propTypes.default.number.isRequired,
  end: _propTypes.default.number.isRequired,
  values: _propTypes.default.array.isRequired,
  onChange: _propTypes.default.func,
  loopDuration: _propTypes.default.number,
  maxFrames: _propTypes.default.number,
  orientation: _propTypes.default.oneOf(['horizontal', 'vertical']),
  reversed: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  range: _propTypes.default.bool
};
var defaultProps = {
  onChange: function onChange() {},
  loopDuration: 15000,
  maxFrames: 100,
  orientation: 'horizontal',
  reversed: false,
  disabled: false,
  range: true
};

var PlaySlider =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(PlaySlider, _React$PureComponent);

  function PlaySlider(props) {
    var _this;

    _this = _React$PureComponent.call(this, props) || this;
    _this.state = {
      intervalId: null
    };
    var range = props.end - props.start;
    var frames = Math.min(props.maxFrames, range / props.step);
    var width = range / frames;
    _this.intervalMilliseconds = props.loopDuration / frames;
    _this.increment = width < props.step ? props.step : width - width % props.step;
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_this));
    _this.play = _this.play.bind(_assertThisInitialized(_this));
    _this.pause = _this.pause.bind(_assertThisInitialized(_this));
    _this.stepBackward = _this.stepBackward.bind(_assertThisInitialized(_this));
    _this.stepForward = _this.stepForward.bind(_assertThisInitialized(_this));
    _this.getPlayClass = _this.getPlayClass.bind(_assertThisInitialized(_this));
    _this.formatter = _this.formatter.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = PlaySlider.prototype;

  _proto.componentDidMount = function componentDidMount() {
    _mousetrap.default.bind(['space'], this.play);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    _mousetrap.default.unbind(['space']);
  };

  _proto.onChange = function onChange(event) {
    this.props.onChange(event.target.value);

    if (this.state.intervalId != null) {
      this.pause();
    }
  };

  _proto.getPlayClass = function getPlayClass() {
    if (this.state.intervalId == null) {
      return 'fa fa-play fa-lg slider-button';
    }

    return 'fa fa-pause fa-lg slider-button';
  };

  _proto.play = function play() {
    if (this.props.disabled) {
      return;
    }

    if (this.state.intervalId != null) {
      this.pause();
    } else {
      var id = setInterval(this.stepForward, this.intervalMilliseconds);
      this.setState({
        intervalId: id
      });
    }
  };

  _proto.pause = function pause() {
    clearInterval(this.state.intervalId);
    this.setState({
      intervalId: null
    });
  };

  _proto.stepForward = function stepForward() {
    var _this2 = this;

    var _this$props = this.props,
        start = _this$props.start,
        end = _this$props.end,
        step = _this$props.step,
        values = _this$props.values,
        disabled = _this$props.disabled;

    if (disabled) {
      return;
    }

    var currentValues = Array.isArray(values) ? values : [values, values + step];
    var nextValues = currentValues.map(function (value) {
      return value + _this2.increment;
    });
    var carriageReturn = nextValues[1] > end ? nextValues[0] - start : 0;
    this.props.onChange(nextValues.map(function (value) {
      return value - carriageReturn;
    }));
  };

  _proto.stepBackward = function stepBackward() {
    var _this3 = this;

    var _this$props2 = this.props,
        start = _this$props2.start,
        end = _this$props2.end,
        step = _this$props2.step,
        values = _this$props2.values,
        disabled = _this$props2.disabled;

    if (disabled) {
      return;
    }

    var currentValues = Array.isArray(values) ? values : [values, values + step];
    var nextValues = currentValues.map(function (value) {
      return value - _this3.increment;
    });
    var carriageReturn = nextValues[0] < start ? end - nextValues[1] : 0;
    this.props.onChange(nextValues.map(function (value) {
      return value + carriageReturn;
    }));
  };

  _proto.formatter = function formatter(values) {
    if (this.props.disabled) {
      return (0, _translation.t)('Data has no time steps');
    }

    var parts = values;

    if (!Array.isArray(values)) {
      parts = [values];
    } else if (values[0] === values[1]) {
      parts = [values[0]];
    }

    return parts.map(function (value) {
      return new Date(value).toUTCString();
    }).join(' : ');
  };

  _proto.render = function render() {
    var _this$props3 = this.props,
        start = _this$props3.start,
        end = _this$props3.end,
        step = _this$props3.step,
        orientation = _this$props3.orientation,
        reversed = _this$props3.reversed,
        disabled = _this$props3.disabled,
        range = _this$props3.range,
        values = _this$props3.values;
    return _react.default.createElement("div", {
      className: "play-slider"
    }, _react.default.createElement("div", {
      className: "play-slider-controls padded"
    }, _react.default.createElement("i", {
      className: "fa fa-step-backward fa-lg slider-button ",
      onClick: this.stepBackward
    }), _react.default.createElement("i", {
      className: this.getPlayClass(),
      onClick: this.play
    }), _react.default.createElement("i", {
      className: "fa fa-step-forward fa-lg slider-button ",
      onClick: this.stepForward
    })), _react.default.createElement("div", {
      className: "play-slider-scrobbler padded"
    }, _react.default.createElement(_BootstrapSliderWrapper.default, {
      value: range ? values : values[0],
      range: range,
      formatter: this.formatter,
      change: this.onChange,
      min: start,
      max: end,
      step: step,
      orientation: orientation,
      reversed: reversed,
      disabled: disabled ? 'disabled' : 'enabled'
    })));
  };

  return PlaySlider;
}(_react.default.PureComponent);

exports.default = PlaySlider;
PlaySlider.propTypes = propTypes;
PlaySlider.defaultProps = defaultProps;