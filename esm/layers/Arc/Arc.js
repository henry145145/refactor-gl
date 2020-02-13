import "core-js/modules/es.array.for-each";
import "core-js/modules/es.object.assign";
import "core-js/modules/web.dom-collections.for-each";

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
import { ArcLayer } from 'deck.gl';
import React from 'react';
import { t } from '@superset-ui/translation';
import { commonLayerProps } from '../common';
import { createCategoricalDeckGLComponent } from '../../factory';
import TooltipRow from '../../TooltipRow';

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
    return React.createElement("div", {
      className: "deckgl-tooltip"
    }, React.createElement(TooltipRow, {
      label: t('Start (Longitude, Latitude)') + ": ",
      value: o.object.sourcePosition[0] + ", " + o.object.sourcePosition[1]
    }), React.createElement(TooltipRow, {
      label: t('End (Longitude, Latitude)') + ": ",
      value: o.object.targetPosition[0] + ", " + o.object.targetPosition[1]
    }), formData.dimension && React.createElement(TooltipRow, {
      label: formData.dimension + ": ",
      value: "" + o.object.cat_color
    }));
  };
}

export function getLayer(fd, payload, onAddFilter, setTooltip) {
  var data = payload.data.features;
  var sc = fd.color_picker;
  var tc = fd.target_color_picker;
  return new ArcLayer(Object.assign({
    data: data,
    getSourceColor: function getSourceColor(d) {
      return d.sourceColor || d.color || [sc.r, sc.g, sc.b, 255 * sc.a];
    },
    getTargetColor: function getTargetColor(d) {
      return d.targetColor || d.color || [tc.r, tc.g, tc.b, 255 * tc.a];
    },
    id: "path-layer-" + fd.slice_id,
    strokeWidth: fd.stroke_width ? fd.stroke_width : 3
  }, commonLayerProps(fd, setTooltip, setTooltipContent(fd))));
}
export default createCategoricalDeckGLComponent(getLayer, getPoints);