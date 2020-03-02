"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DeckGLContainer = _interopRequireDefault(require("./DeckGLContainer"));

var _PlaySlider = _interopRequireDefault(require("./components/PlaySlider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/jsx-handler-names */

/* eslint-disable react/destructuring-assignment */

/* eslint-disable react/forbid-prop-types */

/* eslint-disable sort-keys */

/* eslint-disable react/require-default-props */

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
  onValuesChange: _propTypes.default.func,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired
};
const defaultProps = {
  aggregation: false,
  disabled: false,
  mapStyle: 'light',
  setControlValue: () => {},
  onValuesChange: () => {}
};

class AnimatableDeckGLContainer extends _react.default.PureComponent {
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
      mapboxApiAccessToken,
      height,
      width
    } = this.props;
    const layers = getLayers(values);
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
  }

}

exports.default = AnimatableDeckGLContainer;
AnimatableDeckGLContainer.propTypes = propTypes;
AnimatableDeckGLContainer.defaultProps = defaultProps;