"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

exports.__esModule = true;
exports.getLayer = getLayer;
exports.default = void 0;

var _deck = require("deck.gl");

var _react = _interopRequireDefault(require("react"));

var _common = require("../common");

var _sandbox = _interopRequireDefault(require("../../utils/sandbox"));

var _factory = require("../../factory");

var _TooltipRow = _interopRequireDefault(require("../../TooltipRow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var c = fd.color_picker;
  var fixedColor = [c.r, c.g, c.b, 255 * c.a];
  var data = payload.data.features.map(function (feature) {
    return Object.assign({}, feature, {
      path: feature.path,
      width: fd.line_width,
      color: fixedColor
    });
  });

  if (fd.js_data_mutator) {
    var jsFnMutator = (0, _sandbox.default)(fd.js_data_mutator);
    data = jsFnMutator(data);
  }

  return new _deck.PathLayer(Object.assign({
    id: "path-layer-" + fd.slice_id,
    getColor: function getColor(d) {
      return d.color;
    },
    getPath: function getPath(d) {
      return d.path;
    },
    getWidth: function getWidth(d) {
      return d.width;
    },
    data: data,
    rounded: true,
    widthScale: 1
  }, (0, _common.commonLayerProps)(fd, setTooltip, setTooltipContent)));
}

function getPoints(data) {
  var points = [];
  data.forEach(function (d) {
    points = points.concat(d.path);
  });
  return points;
}

var _default = (0, _factory.createDeckGLComponent)(getLayer, getPoints);

exports.default = _default;