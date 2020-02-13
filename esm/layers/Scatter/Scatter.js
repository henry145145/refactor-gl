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
import { ScatterplotLayer } from 'deck.gl';
import React from 'react';
import { t } from '@superset-ui/translation';
import { commonLayerProps } from '../common';
import { createCategoricalDeckGLComponent } from '../../factory';
import TooltipRow from '../../TooltipRow';
import { unitToRadius } from '../../utils/geo';

function getPoints(data) {
  return data.map(function (d) {
    return d.position;
  });
}

function setTooltipContent(formData) {
  return function (o) {
    return React.createElement("div", {
      className: "deckgl-tooltip"
    }, React.createElement(TooltipRow, {
      label: t('Longitude and Latitude') + ": ",
      value: o.object.position[0] + ", " + o.object.position[1]
    }), o.object.cat_color && React.createElement(TooltipRow, {
      label: t('Category') + ": ",
      value: "" + o.object.cat_color
    }), o.object.metric && React.createElement(TooltipRow, {
      label: formData.point_radius_fixed.value.label + ": ",
      value: "" + o.object.metric
    }));
  };
}

export function getLayer(formData, payload, onAddFilter, setTooltip) {
  var fd = formData;
  var dataWithRadius = payload.data.features.map(function (d) {
    var radius = unitToRadius(fd.point_unit, d.radius) || 10;

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
  return new ScatterplotLayer(Object.assign({
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
  }, commonLayerProps(fd, setTooltip, setTooltipContent(fd))));
}
export default createCategoricalDeckGLComponent(getLayer, getPoints);