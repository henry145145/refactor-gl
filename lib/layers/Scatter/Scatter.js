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

var _factory = require("../../factory");

var _TooltipRow = _interopRequireDefault(require("../../TooltipRow"));

var _geo = require("../../utils/geo");

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
  return data.map(function (d) {
    return d.position;
  });
}

function setTooltipContent(formData) {
  return function (o) {
    return _react.default.createElement("div", {
      className: "deckgl-tooltip"
    }, _react.default.createElement(_TooltipRow.default, {
      label: (0, _translation.t)('Longitude and Latitude') + ": ",
      value: o.object.position[0] + ", " + o.object.position[1]
    }), o.object.cat_color && _react.default.createElement(_TooltipRow.default, {
      label: (0, _translation.t)('Category') + ": ",
      value: "" + o.object.cat_color
    }), o.object.metric && _react.default.createElement(_TooltipRow.default, {
      label: formData.point_radius_fixed.value.label + ": ",
      value: "" + o.object.metric
    }));
  };
}

function getLayer(formData, payload, onAddFilter, setTooltip) {
  var fd = formData;
  var dataWithRadius = payload.data.features.map(function (d) {
    var radius = (0, _geo.unitToRadius)(fd.point_unit, d.radius) || 10;

    if (fd.multiplier) {
      radius *= fd.multiplier;
    }

    if (d.color) {
      return Object.assign({}, d, {
        radius: radius
      });
    }

    var c = fd.color_picker || {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    };
    var color = [c.r, c.g, c.b, c.a * 255];
    return Object.assign({}, d, {
      radius: radius,
      color: color
    });
  });
  return new _deck.ScatterplotLayer(Object.assign({
    id: "scatter-layer-" + fd.slice_id,
    data: dataWithRadius,
    fp64: true,
    getFillColor: function getFillColor(d) {
      return d.color;
    },
    getRadius: function getRadius(d) {
      return d.radius;
    },
    radiusMinPixels: fd.min_radius || null,
    radiusMaxPixels: fd.max_radius || null,
    stroked: false
  }, (0, _common.commonLayerProps)(fd, setTooltip, setTooltipContent(fd))));
}

var _default = (0, _factory.createCategoricalDeckGLComponent)(getLayer, getPoints);

exports.default = _default;