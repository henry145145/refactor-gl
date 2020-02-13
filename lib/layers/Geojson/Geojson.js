"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

exports.__esModule = true;
exports.getLayer = getLayer;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _deck = require("deck.gl");

var _DeckGLContainer = _interopRequireDefault(require("../../DeckGLContainer"));

var _colors = require("../../utils/colors");

var _sandbox = _interopRequireDefault(require("../../utils/sandbox"));

var _common = require("../common");

var _TooltipRow = _interopRequireDefault(require("../../TooltipRow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/sort-prop-types */

/* eslint-disable react/no-array-index-key */

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
// TODO import geojsonExtent from 'geojson-extent';
var propertyMap = {
  fillColor: 'fillColor',
  color: 'fillColor',
  fill: 'fillColor',
  'fill-color': 'fillColor',
  strokeColor: 'strokeColor',
  'stroke-color': 'strokeColor',
  'stroke-width': 'strokeWidth'
};

var alterProps = function alterProps(props, propOverrides) {
  var newProps = {};
  Object.keys(props).forEach(function (k) {
    if (k in propertyMap) {
      newProps[propertyMap[k]] = props[k];
    } else {
      newProps[k] = props[k];
    }
  });

  if (typeof props.fillColor === 'string') {
    newProps.fillColor = (0, _colors.hexToRGB)(props.fillColor);
  }

  if (typeof props.strokeColor === 'string') {
    newProps.strokeColor = (0, _colors.hexToRGB)(props.strokeColor);
  }

  return Object.assign({}, newProps, {}, propOverrides);
};

var features;

var recurseGeoJson = function recurseGeoJson(node, propOverrides, extraProps) {
  if (node && node.features) {
    node.features.forEach(function (obj) {
      recurseGeoJson(obj, propOverrides, node.extraProps || extraProps);
    });
  }

  if (node && node.geometry) {
    var newNode = Object.assign({}, node, {
      properties: alterProps(node.properties, propOverrides)
    });

    if (!newNode.extraProps) {
      newNode.extraProps = extraProps;
    }

    features.push(newNode);
  }
};

function setTooltipContent(o) {
  return o.object.extraProps && _react.default.createElement("div", {
    className: "deckgl-tooltip"
  }, Object.keys(o.object.extraProps).map(function (prop, index) {
    return _react.default.createElement(_TooltipRow.default, {
      key: "prop-" + index,
      label: prop + ": ",
      value: "" + o.object.extraProps[prop]
    });
  }));
}

function getLayer(formData, payload, onAddFilter, setTooltip) {
  var fd = formData;
  var fc = fd.fill_color_picker;
  var sc = fd.stroke_color_picker;
  var fillColor = [fc.r, fc.g, fc.b, 255 * fc.a];
  var strokeColor = [sc.r, sc.g, sc.b, 255 * sc.a];
  var propOverrides = {};

  if (fillColor[3] > 0) {
    propOverrides.fillColor = fillColor;
  }

  if (strokeColor[3] > 0) {
    propOverrides.strokeColor = strokeColor;
  }

  features = [];
  recurseGeoJson(payload.data, propOverrides);
  var jsFnMutator;

  if (fd.js_data_mutator) {
    // Applying user defined data mutator if defined
    jsFnMutator = (0, _sandbox.default)(fd.js_data_mutator);
    features = jsFnMutator(features);
  }

  return new _deck.GeoJsonLayer(Object.assign({
    id: "geojson-layer-" + fd.slice_id,
    filled: fd.filled,
    data: features,
    stroked: fd.stroked,
    extruded: fd.extruded,
    pointRadiusScale: fd.point_radius_scale
  }, (0, _common.commonLayerProps)(fd, setTooltip, setTooltipContent)));
}

var propTypes = {
  formData: _propTypes.default.object.isRequired,
  payload: _propTypes.default.object.isRequired,
  setControlValue: _propTypes.default.func.isRequired,
  viewport: _propTypes.default.object.isRequired,
  onAddFilter: _propTypes.default.func,
  setTooltip: _propTypes.default.func
};
var defaultProps = {
  onAddFilter: function onAddFilter() {},
  setTooltip: function setTooltip() {}
};

function deckGeoJson(props) {
  var formData = props.formData,
      payload = props.payload,
      setControlValue = props.setControlValue,
      onAddFilter = props.onAddFilter,
      setTooltip = props.setTooltip,
      viewport = props.viewport; // TODO get this to work
  // if (formData.autozoom) {
  //   viewport = common.fitViewport(viewport, geojsonExtent(payload.data.features));
  // }

  var layer = getLayer(formData, payload, onAddFilter, setTooltip);
  return _react.default.createElement(_DeckGLContainer.default, {
    mapboxApiAccessToken: payload.data.mapboxApiKey,
    viewport: viewport,
    layers: [layer],
    mapStyle: formData.mapbox_style,
    setControlValue: setControlValue
  });
}

deckGeoJson.propTypes = propTypes;
deckGeoJson.defaultProps = defaultProps;
var _default = deckGeoJson;
exports.default = _default;