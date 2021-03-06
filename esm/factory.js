function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint-disable react/jsx-handler-names */

/* eslint-disable react/destructuring-assignment */

/* eslint-disable react/sort-comp */

/* eslint-disable camelcase */

/* eslint-disable react/no-unsafe */

/* eslint-disable sort-keys */

/* eslint-disable react/no-unused-prop-types */

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
import { isEqual, differenceWith } from 'lodash';
import DeckGLContainer from './DeckGLContainer';
import CategoricalDeckGLContainer from './CategoricalDeckGLContainer';
import { fitViewport } from './layers/common';
const propTypes = {
  formData: PropTypes.object.isRequired,
  payload: PropTypes.object.isRequired,
  setControlValue: PropTypes.func.isRequired,
  viewport: PropTypes.object.isRequired,
  onAddFilter: PropTypes.func,
  setTooltip: PropTypes.func
};
const defaultProps = {
  onAddFilter() {},

  setTooltip() {}

};
export function createDeckGLComponent(getLayer, getPoints) {
  // Higher order component
  class Component extends React.PureComponent {
    constructor(props) {
      super(props);
      const originalViewport = props.viewport;
      const viewport = props.formData.autozoom ? fitViewport(originalViewport, getPoints(props.payload.data.features)) : originalViewport;
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

      if (!isEqual(nextFdNoVP, currFdNoVP) || nextProps.payload !== this.props.payload) {
        this.setState({
          layer: this.computeLayer(nextProps)
        });
      }

      const [oldFilter, newFilter] = [currFdNoVP.extra_filters, nextFdNoVP.extra_filters];
      const [diff, diff2] = [differenceWith(oldFilter, newFilter, isEqual), differenceWith(newFilter, oldFilter, isEqual)];

      if (diff.length || diff2.length) {
        const originalViewport = nextProps.viewport;
        const viewport = nextProps.formData.autozoom ? fitViewport(originalViewport, getPoints(nextProps.payload.data.features)) : originalViewport;
        this.setState({
          viewport
        });
      }
    }

    onViewportChange(viewport) {
      this.setState({
        viewport
      });
    }

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
        setControlValue
      } = this.props;
      const {
        layer,
        viewport
      } = this.state;
      const {
        viz_type,
        canmove
      } = formData;
      return React.createElement(DeckGLContainer, {
        mapboxApiAccessToken: payload.data.mapboxApiKey,
        viewport: viewport,
        layers: [layer],
        mapStyle: formData.mapbox_style,
        setControlValue: setControlValue,
        onViewportChange: this.onViewportChange,
        vizType: viz_type,
        canMove: canmove
      });
    }

  }

  Component.propTypes = propTypes;
  Component.defaultProps = defaultProps;
  return Component;
}
export function createCategoricalDeckGLComponent(getLayer, getPoints) {
  function Component(props) {
    const {
      formData,
      payload,
      setControlValue,
      onAddFilter,
      setTooltip,
      viewport
    } = props;
    return React.createElement(CategoricalDeckGLContainer, {
      formData: formData,
      mapboxApiKey: payload.data.mapboxApiKey,
      setControlValue: setControlValue,
      viewport: viewport,
      getLayer: getLayer,
      payload: payload,
      onAddFilter: onAddFilter,
      setTooltip: setTooltip,
      getPoints: getPoints
    });
  }

  Component.propTypes = propTypes;
  Component.defaultProps = defaultProps;
  return Component;
}