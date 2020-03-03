function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint-disable compat/compat */

/* eslint-disable react/no-unsafe */

/* eslint-disable promise/always-return */

/* eslint-disable react/jsx-handler-names */

/* eslint-disable react/no-access-state-in-setstate */

/* eslint-disable react/sort-comp */

/* eslint-disable camelcase */

/* eslint-disable react/destructuring-assignment */

/* eslint-disable sort-keys */

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
import _ from 'lodash';
import PropTypes from 'prop-types';
import { SupersetClient } from '@superset-ui/connection';
import DeckGLContainer from '../DeckGLContainer';
import { getExploreLongUrl } from '../utils/explore';
import layerGenerators from '../layers';
const propTypes = {
  formData: PropTypes.object.isRequired,
  payload: PropTypes.object.isRequired,
  setControlValue: PropTypes.func.isRequired,
  viewport: PropTypes.object.isRequired,
  onAddFilter: PropTypes.func,
  setTooltip: PropTypes.func,
  onSelect: PropTypes.func
};
const defaultProps = {
  onAddFilter() {},

  setTooltip() {},

  onSelect() {}

};

class DeckMulti extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subSlicesLayers: {}
    };
    this.onViewportChange = this.onViewportChange.bind(this);
  }

  componentDidMount() {
    const {
      formData,
      payload
    } = this.props;
    this.loadLayers(formData, payload);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      formData,
      payload
    } = nextProps; // const hasChanges = !_.isEqual(this.props.formData.deck_slices, nextProps.formData.deck_slices);
    // if (hasChanges) {
    //   this.loadLayers(formData, payload);
    // }

    this.loadLayers(formData, payload);
  }

  onViewportChange(viewport) {
    this.setState({
      viewport
    });
  }

  loadLayers(formData, payload, viewport) {
    this.setState({
      subSlicesLayers: {},
      viewport
    });
    payload.data.slices.forEach(subslice => {
      // Filters applied to multi_deck are passed down to underlying charts
      // note that dashboard contextual information (filter_immune_slices and such) aren't
      // taken into consideration here
      const filters = [...(subslice.form_data.filters || []), ...(formData.filters || []), ...(formData.extra_filters || [])];

      const subsliceCopy = _extends({}, subslice, {
        form_data: _extends({}, subslice.form_data, {
          filters,
          adhoc_filters: formData.adhoc_filters,
          extra_filters: filters
        })
      });

      SupersetClient.get({
        endpoint: getExploreLongUrl(subsliceCopy.form_data, 'json')
      }).then(({
        json
      }) => {
        const layer = layerGenerators[subsliceCopy.form_data.viz_type](subsliceCopy.form_data, json, this.props.onAddFilter, this.props.setTooltip, [], this.props.onSelect);
        this.setState({
          subSlicesLayers: _extends({}, this.state.subSlicesLayers, {
            [subsliceCopy.slice_id]: layer
          })
        });
      }).catch(() => {});
    });
  }

  render() {
    const {
      payload,
      formData,
      setControlValue
    } = this.props;
    const {
      subSlicesLayers
    } = this.state;
    const layers = Object.values(subSlicesLayers);
    return React.createElement(DeckGLContainer, {
      mapboxApiAccessToken: payload.data.mapboxApiKey,
      viewport: this.state.viewport || this.props.viewport,
      onViewportChange: this.onViewportChange,
      layers: layers,
      mapStyle: formData.mapbox_style,
      setControlValue: setControlValue
    });
  }

}

DeckMulti.propTypes = propTypes;
DeckMulti.defaultProps = defaultProps;
export default DeckMulti;