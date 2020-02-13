"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.object.assign");

require("core-js/modules/web.dom-collections.for-each");

exports.__esModule = true;
exports.getLayer = getLayer;
exports.default = void 0;

var _deck = require("deck.gl");

var _react = _interopRequireDefault(require("react"));

var _translation = require("@superset-ui/translation");

var _common = require("../common");

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
function getPoints(data) {
  var points = [];
  data.forEach(function (d) {
    points.push(d.sourcePosition);
    points.push(d.targetPosition);
  });
  return points;
}

function setTooltipContent(formData) {
  return function (o) {
    return _react.default.createElement("div", {
      className: "deckgl-tooltip"
    }, _react.default.createElement(_TooltipRow.default, {
      label: (0, _translation.t)('Start (Longitude, Latitude)') + ": ",
      value: o.object.sourcePosition[0] + ", " + o.object.sourcePosition[1]
    }), _react.default.createElement(_TooltipRow.default, {
      label: (0, _translation.t)('End (Longitude, Latitude)') + ": ",
      value: o.object.targetPosition[0] + ", " + o.object.targetPosition[1]
    }), formData.dimension && _react.default.createElement(_TooltipRow.default, {
      label: formData.dimension + ": ",
      value: "" + o.object.cat_color
    }));
  };
}

function getLayer(fd, payload, onAddFilter, setTooltip) {
  var data = payload.data.features;
  var sc = fd.color_picker;
  var tc = fd.target_color_picker;
  return new _deck.ArcLayer(Object.assign({
    data: data,
    getSourceColor: function getSourceColor(d) {
      return d.sourceColor || d.color || [sc.r, sc.g, sc.b, 255 * sc.a];
    },
    getTargetColor: function getTargetColor(d) {
      return d.targetColor || d.color || [tc.r, tc.g, tc.b, 255 * tc.a];
    },
    id: "path-layer-" + fd.slice_id,
    strokeWidth: fd.stroke_width ? fd.stroke_width : 3
  }, (0, _common.commonLayerProps)(fd, setTooltip, setTooltipContent(fd))));
}

var _default = (0, _factory.createCategoricalDeckGLComponent)(getLayer, getPoints);

exports.default = _default;