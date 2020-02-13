import "core-js/modules/es.array.fill";
import "core-js/modules/es.array.for-each";
import "core-js/modules/es.array.map";
import "core-js/modules/es.array.slice";
import "core-js/modules/es.math.log10";
import "core-js/modules/es.number.to-fixed";
import "core-js/modules/web.dom-collections.for-each";

/* eslint-disable no-negated-condition */

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
import { extent } from 'd3-array';
import { scaleThreshold } from 'd3-scale';
import { getSequentialSchemeRegistry, SequentialScheme } from '@superset-ui/color';
import { hexToRGB } from './utils/colors';
var DEFAULT_NUM_BUCKETS = 10;
export function getBreakPoints(_ref, features, accessor) {
  var formDataBreakPoints = _ref.break_points,
      formDataNumBuckets = _ref.num_buckets;

  if (!features) {
    return [];
  }

  if (formDataBreakPoints === undefined || formDataBreakPoints.length === 0) {
    // compute evenly distributed break points based on number of buckets
    var numBuckets = formDataNumBuckets ? parseInt(formDataNumBuckets, 10) : DEFAULT_NUM_BUCKETS;

    var _extent = extent(features, accessor),
        minValue = _extent[0],
        maxValue = _extent[1];

    if (minValue === undefined) {
      return [];
    }

    var delta = (maxValue - minValue) / numBuckets;
    var precision = delta === 0 ? 0 : Math.max(0, Math.ceil(Math.log10(1 / delta)));
    var extraBucket = maxValue > maxValue.toFixed(precision) ? 1 : 0;
    return new Array(numBuckets + 1 + extraBucket).fill().map(function (_, i) {
      return (minValue + i * delta).toFixed(precision);
    });
  }

  return formDataBreakPoints.sort(function (a, b) {
    return parseFloat(a) - parseFloat(b);
  });
}
export function getBreakPointColorScaler(_ref2, features, accessor) {
  var formDataBreakPoints = _ref2.break_points,
      formDataNumBuckets = _ref2.num_buckets,
      linearColorScheme = _ref2.linear_color_scheme,
      opacity = _ref2.opacity;
  var breakPoints = formDataBreakPoints || formDataNumBuckets ? getBreakPoints({
    break_points: formDataBreakPoints,
    num_buckets: formDataNumBuckets
  }, features, accessor) : null;
  var colorScheme = Array.isArray(linearColorScheme) ? new SequentialScheme({
    colors: linearColorScheme,
    id: 'custom'
  }) : getSequentialSchemeRegistry().get(linearColorScheme);
  var scaler;
  var maskPoint;

  if (breakPoints !== null) {
    // bucket colors into discrete colors
    var n = breakPoints.length - 1;
    var bucketedColors = n > 1 ? colorScheme.getColors(n) : [colorScheme.colors[colorScheme.colors.length - 1]]; // repeat ends

    var first = bucketedColors[0];
    var last = bucketedColors[bucketedColors.length - 1];
    bucketedColors.unshift(first);
    bucketedColors.push(last);
    var points = breakPoints.map(function (p) {
      return parseFloat(p);
    });
    scaler = scaleThreshold().domain(points).range(bucketedColors);

    maskPoint = function maskPoint(value) {
      return value > breakPoints[n] || value < breakPoints[0];
    };
  } else {
    // interpolate colors linearly
    scaler = colorScheme.createLinearScale(extent(features, accessor));

    maskPoint = function maskPoint() {
      return false;
    };
  }

  return function (d) {
    var v = accessor(d);
    var c = hexToRGB(scaler(v));

    if (maskPoint(v)) {
      c[3] = 0;
    } else {
      c[3] = opacity / 100 * 255;
    }

    return c;
  };
}
export function getBuckets(fd, features, accessor) {
  var breakPoints = getBreakPoints(fd, features, accessor);
  var colorScaler = getBreakPointColorScaler(fd, features, accessor);
  var buckets = {};
  breakPoints.slice(1).forEach(function (value, i) {
    var _colorScaler;

    var range = breakPoints[i] + " - " + breakPoints[i + 1];
    var mid = 0.5 * (parseFloat(breakPoints[i]) + parseFloat(breakPoints[i + 1])); // fix polygon doesn't show

    var metricLabel = fd.metric ? fd.metric.label || fd.metric : null;
    buckets[range] = {
      color: colorScaler((_colorScaler = {}, _colorScaler[metricLabel || fd.metric] = mid, _colorScaler)),
      enabled: true
    };
  });
  return buckets;
}