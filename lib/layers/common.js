"use strict";

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.assign");

exports.__esModule = true;
exports.getBounds = getBounds;
exports.fitViewport = fitViewport;
exports.commonLayerProps = commonLayerProps;
exports.getAggFunc = getAggFunc;

var _viewportMercatorProject = require("viewport-mercator-project");

var d3array = _interopRequireWildcard(require("d3-array"));

var _sandbox = _interopRequireDefault(require("../utils/sandbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
var PADDING = 0.25;
var GEO_BOUNDS = {
  LAT_MAX: 90,
  LAT_MIN: -90,
  LNG_MAX: 180,
  LNG_MIN: -180
};
/**
 * Get the latitude bounds if latitude is a single coordinate
 * @param latExt Latitude range
 */

function getLatBoundsForSingleCoordinate(latExt) {
  var latMin = latExt[0] - PADDING < GEO_BOUNDS.LAT_MIN ? GEO_BOUNDS.LAT_MIN : latExt[0] - PADDING;
  var latMax = latExt[1] + PADDING > GEO_BOUNDS.LAT_MAX ? GEO_BOUNDS.LAT_MAX : latExt[1] + PADDING;
  return [latMin, latMax];
}
/**
 * Get the longitude bounds if longitude is a single coordinate
 * @param lngExt Longitude range
 */


function getLngBoundsForSingleCoordinate(lngExt) {
  var lngMin = lngExt[0] - PADDING < GEO_BOUNDS.LNG_MIN ? GEO_BOUNDS.LNG_MIN : lngExt[0] - PADDING;
  var lngMax = lngExt[1] + PADDING > GEO_BOUNDS.LNG_MAX ? GEO_BOUNDS.LNG_MAX : lngExt[1] + PADDING;
  return [lngMin, lngMax];
}

function getBounds(points) {
  var latExt = d3array.extent(points, function (d) {
    return d[1];
  });
  var lngExt = d3array.extent(points, function (d) {
    return d[0];
  });
  var latBounds = latExt[0] === latExt[1] ? getLatBoundsForSingleCoordinate(latExt) : latExt;
  var lngBounds = lngExt[0] === lngExt[1] ? getLngBoundsForSingleCoordinate(lngExt) : lngExt;
  return [[lngBounds[0], latBounds[0]], [lngBounds[1], latBounds[1]]];
}

function fitViewport(viewport, points, padding) {
  if (padding === void 0) {
    padding = 10;
  }

  try {
    var bounds = getBounds(points);
    return Object.assign({}, viewport, {}, (0, _viewportMercatorProject.fitBounds)({
      bounds: bounds,
      height: viewport.height,
      padding: padding,
      width: viewport.width
    }));
  } catch (error) {
    /* eslint no-console: 0 */
    console.error('Could not auto zoom', error);
    return viewport;
  }
}

function commonLayerProps(formData, setTooltip, setTooltipContent, onSelect) {
  var fd = formData;
  var onHover;
  var tooltipContentGenerator = setTooltipContent;

  if (fd.js_tooltip) {
    tooltipContentGenerator = (0, _sandbox.default)(fd.js_tooltip);
  }

  if (tooltipContentGenerator) {
    onHover = function onHover(o) {
      if (o.picked) {
        setTooltip({
          content: tooltipContentGenerator(o),
          x: o.x,
          y: o.y
        });
      } else {
        setTooltip(null);
      }
    };
  }

  var onClick;

  if (fd.js_onclick_href) {
    onClick = function onClick(o) {
      var href = (0, _sandbox.default)(fd.js_onclick_href)(o);
      window.open(href);
    };
  } else if (fd.table_filter && onSelect !== undefined) {
    onClick = function onClick(o) {
      return onSelect(o.object[fd.line_column]);
    };
  }

  return {
    onClick: onClick,
    onHover: onHover,
    pickable: Boolean(onHover)
  };
}

var percentiles = {
  p1: 0.01,
  p5: 0.05,
  p95: 0.95,
  p99: 0.99
};
/* Get an a stat function that operates on arrays, aligns with control=js_agg_function  */

function getAggFunc(type, accessor) {
  if (type === void 0) {
    type = 'sum';
  }

  if (accessor === void 0) {
    accessor = null;
  }

  if (type === 'count') {
    return function (arr) {
      return arr.length;
    };
  }

  var d3func;

  if (type in percentiles) {
    d3func = function d3func(arr, acc) {
      var sortedArr;

      if (accessor) {
        sortedArr = arr.sort(function (o1, o2) {
          return d3array.ascending(accessor(o1), accessor(o2));
        });
      } else {
        sortedArr = arr.sort(d3array.ascending);
      }

      return d3array.quantile(sortedArr, percentiles[type], acc);
    };
  } else {
    d3func = d3array[type];
  }

  if (!accessor) {
    return function (arr) {
      return d3func(arr);
    };
  }

  return function (arr) {
    return d3func(arr.map(function (x) {
      return accessor(x);
    }));
  };
}