"use strict";

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.assign");

exports.__esModule = true;
exports.getLayer = getLayer;
exports.default = void 0;

var _deck = require("deck.gl");

var _react = _interopRequireDefault(require("react"));

var _translation = require("@superset-ui/translation");

var _common = require("../common");

var _sandbox = _interopRequireDefault(require("../../utils/sandbox"));

var _factory = require("../../factory");

var _TooltipRow = _interopRequireDefault(require("../../TooltipRow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function setTooltipContent(o) {
  return _react.default.createElement("div", {
    className: "deckgl-tooltip"
  }, _react.default.createElement(_TooltipRow.default, {
    label: (0, _translation.t)('Centroid (Longitude and Latitude)') + ": ",
    value: "(" + o.coordinate[0] + ", " + o.coordinate[1] + ")"
  }), _react.default.createElement(_TooltipRow.default, {
    label: (0, _translation.t)('Height') + ": ",
    value: "" + o.object.elevationValue
  }));
}

function getLayer(formData, payload, onAddFilter, setTooltip) {
  var fd = formData;
  var c = fd.color_picker;
  var data = payload.data.features.map(function (d) {
    return Object.assign({}, d, {
      color: [c.r, c.g, c.b, 255 * c.a]
    });
  });

  if (fd.js_data_mutator) {
    // Applying user defined data mutator if defined
    var jsFnMutator = (0, _sandbox.default)(fd.js_data_mutator);
    data = jsFnMutator(data);
  }

  var aggFunc = (0, _common.getAggFunc)(fd.js_agg_function, function (p) {
    return p.weight;
  });
  return new _deck.HexagonLayer(Object.assign({
    id: "hex-layer-" + fd.slice_id,
    data: data,
    pickable: true,
    radius: fd.grid_size,
    minColor: [0, 0, 0, 0],
    extruded: fd.extruded,
    colorRange: [[255, 255, 183, 255 * c.a], [250, 218, 127, 255 * c.a], [245, 181, 87, 255 * c.a], [241, 146, 70, 255 * c.a], [224, 74, 40, 255 * c.a], [176, 33, 41, 255 * c.a]],
    maxColor: [c.r, c.g, c.b, 255 * c.a],
    outline: false,
    getElevationValue: aggFunc,
    getColorValue: aggFunc
  }, (0, _common.commonLayerProps)(fd, setTooltip, setTooltipContent)));
}

function getPoints(data) {
  return data.map(function (d) {
    return d.position;
  });
}

var _default = (0, _factory.createDeckGLComponent)(getLayer, getPoints);

exports.default = _default;