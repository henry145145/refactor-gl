import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.for-each";
import "core-js/modules/es.object.assign";
import "core-js/modules/es.object.values";
import "core-js/modules/web.dom-collections.for-each";

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-disable react/jsx-sort-default-props */

/* eslint-disable react/sort-prop-types */

/* eslint-disable react/jsx-handler-names */

/* eslint-disable react/no-access-state-in-setstate */

/* eslint-disable camelcase */

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
var propTypes = {
  formData: PropTypes.object.isRequired,
  payload: PropTypes.object.isRequired,
  setControlValue: PropTypes.func.isRequired,
  viewport: PropTypes.object.isRequired,
  onAddFilter: PropTypes.func,
  setTooltip: PropTypes.func,
  onSelect: PropTypes.func
};
var defaultProps = {
  onAddFilter: function onAddFilter() {},
  setTooltip: function setTooltip() {},
  onSelect: function onSelect() {}
};

var DeckMulti =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(DeckMulti, _React$PureComponent);

  function DeckMulti(props) {
    var _this;

    _this = _React$PureComponent.call(this, props) || this;
    _this.state = {
      subSlicesLayers: {}
    };
    _this.onViewportChange = _this.onViewportChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = DeckMulti.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$props = this.props,
        formData = _this$props.formData,
        payload = _this$props.payload;
    this.loadLayers(formData, payload);
  };

  _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    var formData = nextProps.formData,
        payload = nextProps.payload;
    var hasChanges = !_.isEqual(this.props.formData.deck_slices, nextProps.formData.deck_slices);

    if (hasChanges) {
      this.loadLayers(formData, payload);
    }
  };

  _proto.onViewportChange = function onViewportChange(viewport) {
    this.setState({
      viewport: viewport
    });
  };

  _proto.loadLayers = function loadLayers(formData, payload, viewport) {
    var _this2 = this;

    this.setState({
      subSlicesLayers: {},
      viewport: viewport
    });
    payload.data.slices.forEach(function (subslice) {
      // Filters applied to multi_deck are passed down to underlying charts
      // note that dashboard contextual information (filter_immune_slices and such) aren't
      // taken into consideration here
      var filters = [].concat(subslice.form_data.filters || [], formData.filters || [], formData.extra_filters || []);
      var subsliceCopy = Object.assign({}, subslice, {
        form_data: Object.assign({}, subslice.form_data, {
          filters: filters
        })
      });
      SupersetClient.get({
        endpoint: getExploreLongUrl(subsliceCopy.form_data, 'json')
      }).then(function (_ref) {
        var _Object$assign;

        var json = _ref.json;
        var layer = layerGenerators[subsliceCopy.form_data.viz_type](subsliceCopy.form_data, json, _this2.props.onAddFilter, _this2.props.setTooltip, [], _this2.props.onSelect);

        _this2.setState({
          subSlicesLayers: Object.assign({}, _this2.state.subSlicesLayers, (_Object$assign = {}, _Object$assign[subsliceCopy.slice_id] = layer, _Object$assign))
        });
      }).catch(function () {});
    });
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        payload = _this$props2.payload,
        formData = _this$props2.formData,
        setControlValue = _this$props2.setControlValue;
    var subSlicesLayers = this.state.subSlicesLayers;
    var layers = Object.values(subSlicesLayers);
    return React.createElement(DeckGLContainer, {
      mapboxApiAccessToken: payload.data.mapboxApiKey,
      viewport: this.state.viewport || this.props.viewport,
      layers: layers,
      mapStyle: formData.mapbox_style,
      setControlValue: setControlValue,
      onViewportChange: this.onViewportChange
    });
  };

  return DeckMulti;
}(React.PureComponent);

DeckMulti.propTypes = propTypes;
DeckMulti.defaultProps = defaultProps;
export default DeckMulti;