import "core-js/modules/es.array.map";
import "core-js/modules/es.object.assign";

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
import { HexagonLayer } from 'deck.gl';
import React from 'react';
import { t } from '@superset-ui/translation';
import { commonLayerProps, getAggFunc } from '../common';
import sandboxedEval from '../../utils/sandbox';
import { createDeckGLComponent } from '../../factory';
import TooltipRow from '../../TooltipRow';

function setTooltipContent(o) {
  return React.createElement("div", {
    className: "deckgl-tooltip"
  }, React.createElement(TooltipRow, {
    label: t('Centroid (Longitude and Latitude)') + ": ",
    value: "(" + o.coordinate[0] + ", " + o.coordinate[1] + ")"
  }), React.createElement(TooltipRow, {
    label: t('Height') + ": ",
    value: "" + o.object.elevationValue
  }));
}

export function getLayer(formData, payload, onAddFilter, setTooltip) {
  var fd = formData;
  var c = fd.color_picker;
  var data = payload.data.features.map(function (d) {
    return Object.assign({}, d, {
      color: [c.r, c.g, c.b, 255 * c.a]
    });
  });

  if (fd.js_data_mutator) {
    // Applying user defined data mutator if defined
    var jsFnMutator = sandboxedEval(fd.js_data_mutator);
    data = jsFnMutator(data);
  }

  var aggFunc = getAggFunc(fd.js_agg_function, function (p) {
    return p.weight;
  });
  return new HexagonLayer(Object.assign({
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
  }, commonLayerProps(fd, setTooltip, setTooltipContent)));
}

function getPoints(data) {
  return data.map(function (d) {
    return d.position;
  });
}

export default createDeckGLComponent(getLayer, getPoints);