import "core-js/modules/es.array.iterator";
import "core-js/modules/es.object.to-string";
import "core-js/modules/web.dom-collections.iterator";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-disable react/jsx-sort-default-props */

/* eslint-disable react/sort-prop-types */

/* eslint-disable react/forbid-prop-types */

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
import React from 'react';
import PropTypes from 'prop-types';
import DeckGLContainer from './DeckGLContainer';
import PlaySlider from './components/PlaySlider';
var PLAYSLIDER_HEIGHT = 20; // px

var propTypes = {
  getLayers: PropTypes.func.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  getStep: PropTypes.func,
  values: PropTypes.array.isRequired,
  aggregation: PropTypes.bool,
  disabled: PropTypes.bool,
  viewport: PropTypes.object.isRequired,
  children: PropTypes.node,
  mapStyle: PropTypes.string,
  mapboxApiAccessToken: PropTypes.string.isRequired,
  setControlValue: PropTypes.func,
  onValuesChange: PropTypes.func,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
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
    return React.createElement("div", null, React.createElement(DeckGLContainer, {
      viewport: viewport,
      layers: layers,
      setControlValue: setControlValue,
      mapStyle: mapStyle,
      mapboxApiAccessToken: mapboxApiAccessToken,
      bottomMargin: disabled ? 0 : PLAYSLIDER_HEIGHT,
      width: width,
      height: height
    }), !disabled && React.createElement(PlaySlider, {
      start: start,
      end: end,
      step: getStep(start),
      values: values,
      range: !aggregation,
      onChange: onValuesChange
    }), children);
  };

  return AnimatableDeckGLContainer;
}(React.PureComponent);

export { AnimatableDeckGLContainer as default };
AnimatableDeckGLContainer.propTypes = propTypes;
AnimatableDeckGLContainer.defaultProps = defaultProps;