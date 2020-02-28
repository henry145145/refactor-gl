import "core-js/modules/es.array.iterator";
import "core-js/modules/es.array.join";
import "core-js/modules/es.array.map";
import "core-js/modules/es.object.to-string";
import "core-js/modules/web.dom-collections.iterator";

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-disable react/jsx-sort-default-props */

/* eslint-disable react/sort-prop-types */

/* eslint-disable react/jsx-handler-names */

/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable no-negated-condition */

/* eslint-disable react/forbid-prop-types */

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';
import { t } from '@superset-ui/translation';
import BootrapSliderWrapper from './BootstrapSliderWrapper';
import './PlaySlider.css';
var propTypes = {
  start: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  loopDuration: PropTypes.number,
  maxFrames: PropTypes.number,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  reversed: PropTypes.bool,
  disabled: PropTypes.bool,
  range: PropTypes.bool
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

var PlaySlider = /*#__PURE__*/function (_React$PureComponent) {
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
    Mousetrap.bind(['space'], this.play);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    Mousetrap.unbind(['space']);
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
      return t('Data has no time steps');
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
    return React.createElement("div", {
      className: "play-slider"
    }, React.createElement("div", {
      className: "play-slider-controls padded"
    }, React.createElement("i", {
      className: "fa fa-step-backward fa-lg slider-button ",
      onClick: this.stepBackward
    }), React.createElement("i", {
      className: this.getPlayClass(),
      onClick: this.play
    }), React.createElement("i", {
      className: "fa fa-step-forward fa-lg slider-button ",
      onClick: this.stepForward
    })), React.createElement("div", {
      className: "play-slider-scrobbler padded"
    }, React.createElement(BootrapSliderWrapper, {
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
}(React.PureComponent);

export { PlaySlider as default };
PlaySlider.propTypes = propTypes;
PlaySlider.defaultProps = defaultProps;