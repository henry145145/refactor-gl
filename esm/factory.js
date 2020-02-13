import "core-js/modules/es.object.assign";

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-disable react/sort-prop-types */

/* eslint-disable react/jsx-handler-names */

/* eslint-disable camelcase */

/* eslint-disable react/no-unused-prop-types */

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
import { isEqual, differenceWith } from 'lodash';
import DeckGLContainer from './DeckGLContainer';
import CategoricalDeckGLContainer from './CategoricalDeckGLContainer';
import { fitViewport } from './layers/common';
var propTypes = {
  formData: PropTypes.object.isRequired,
  payload: PropTypes.object.isRequired,
  setControlValue: PropTypes.func.isRequired,
  viewport: PropTypes.object.isRequired,
  onAddFilter: PropTypes.func,
  setTooltip: PropTypes.func,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
var defaultProps = {
  onAddFilter: function onAddFilter() {},
  setTooltip: function setTooltip() {}
};
export function createDeckGLComponent(getLayer, getPoints) {
  // Higher order component
  var Component =
  /*#__PURE__*/
  function (_React$PureComponent) {
    _inheritsLoose(Component, _React$PureComponent);

    function Component(props) {
      var _this;

      _this = _React$PureComponent.call(this, props) || this;
      var originalViewport = props.viewport;
      var viewport = props.formData.autozoom ? fitViewport(originalViewport, getPoints(props.payload.data.features)) : originalViewport;
      _this.state = {
        viewport: viewport,
        layer: _this.computeLayer(props)
      };
      _this.onViewportChange = _this.onViewportChange.bind(_assertThisInitialized(_this));
      return _this;
    }

    var _proto = Component.prototype;

    _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
      // Only recompute the layer if anything BUT the viewport has changed
      var nextFdNoVP = Object.assign({}, nextProps.formData, {
        viewport: null
      });
      var currFdNoVP = Object.assign({}, this.props.formData, {
        viewport: null
      });

      if (!isEqual(nextFdNoVP, currFdNoVP) || nextProps.payload !== this.props.payload) {
        this.setState({
          layer: this.computeLayer(nextProps)
        });
      }

      var _ref = [currFdNoVP.extra_filters, nextFdNoVP.extra_filters],
          oldFilter = _ref[0],
          newFilter = _ref[1];
      var _ref2 = [differenceWith(oldFilter, newFilter, isEqual), differenceWith(newFilter, oldFilter, isEqual)],
          diff = _ref2[0],
          diff2 = _ref2[1];

      if (diff.length || diff2.length) {
        var originalViewport = nextProps.viewport;
        var viewport = nextProps.formData.autozoom ? fitViewport(originalViewport, getPoints(nextProps.payload.data.features)) : originalViewport;
        this.setState({
          viewport: viewport
        });
      }
    };

    _proto.onViewportChange = function onViewportChange(viewport) {
      this.setState({
        viewport: viewport
      });
    } // eslint-disable-next-line class-methods-use-this
    ;

    _proto.computeLayer = function computeLayer(props) {
      var formData = props.formData,
          payload = props.payload,
          onAddFilter = props.onAddFilter,
          setTooltip = props.setTooltip;
      return getLayer(formData, payload, onAddFilter, setTooltip);
    };

    _proto.render = function render() {
      var _this$props = this.props,
          formData = _this$props.formData,
          payload = _this$props.payload,
          setControlValue = _this$props.setControlValue,
          height = _this$props.height,
          width = _this$props.width;
      var _this$state = this.state,
          layer = _this$state.layer,
          viewport = _this$state.viewport;
      console.log(formData.viewport);
      console.log(viewport);
      return React.createElement(DeckGLContainer, {
        mapboxApiAccessToken: payload.data.mapboxApiKey,
        viewport: viewport,
        layers: [layer],
        mapStyle: formData.mapbox_style,
        setControlValue: setControlValue,
        width: width,
        height: height,
        onViewportChange: this.onViewportChange
      });
    };

    return Component;
  }(React.PureComponent);

  Component.propTypes = propTypes;
  Component.defaultProps = defaultProps;
  return Component;
}
export function createCategoricalDeckGLComponent(getLayer, getPoints) {
  function Component(props) {
    var formData = props.formData,
        payload = props.payload,
        setControlValue = props.setControlValue,
        setTooltip = props.setTooltip,
        viewport = props.viewport,
        width = props.width,
        height = props.height;
    return React.createElement(CategoricalDeckGLContainer, {
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