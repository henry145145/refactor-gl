"use strict";

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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const PADDING = 0.25;
const GEO_BOUNDS = {
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
  const latMin = latExt[0] - PADDING < GEO_BOUNDS.LAT_MIN ? GEO_BOUNDS.LAT_MIN : latExt[0] - PADDING;
  const latMax = latExt[1] + PADDING > GEO_BOUNDS.LAT_MAX ? GEO_BOUNDS.LAT_MAX : latExt[1] + PADDING;
  return [latMin, latMax];
}
/**
 * Get the longitude bounds if longitude is a single coordinate
 * @param lngExt Longitude range
 */


function getLngBoundsForSingleCoordinate(lngExt) {
  const lngMin = lngExt[0] - PADDING < GEO_BOUNDS.LNG_MIN ? GEO_BOUNDS.LNG_MIN : lngExt[0] - PADDING;
  const lngMax = lngExt[1] + PADDING > GEO_BOUNDS.LNG_MAX ? GEO_BOUNDS.LNG_MAX : lngExt[1] + PADDING;
  return [lngMin, lngMax];
}

function getBounds(points) {
  const latExt = d3array.extent(points, d => d[1]);
  const lngExt = d3array.extent(points, d => d[0]);
  const latBounds = latExt[0] === latExt[1] ? getLatBoundsForSingleCoordinate(latExt) : latExt;
  const lngBounds = lngExt[0] === lngExt[1] ? getLngBoundsForSingleCoordinate(lngExt) : lngExt;
  return [[lngBounds[0], latBounds[0]], [lngBounds[1], latBounds[1]]];
}

function fitViewport(viewport, points, padding = 10) {
  try {
    const bounds = getBounds(points);
    return _extends({}, viewport, {}, (0, _viewportMercatorProject.fitBounds)({
      bounds,
      height: viewport.height,
      padding,
      width: viewport.width
    }));
  } catch (e) {
    /* eslint no-console: 0 */
    console.error('Could not auto zoom', e);
    return viewport;
  }
}

function commonLayerProps(formData, setTooltip, setTooltipContent, onSelect) {
  const fd = formData;
  let onHover;
  let tooltipContentGenerator = setTooltipContent;

  if (fd.js_tooltip) {
    tooltipContentGenerator = (0, _sandbox.default)(fd.js_tooltip);
  }

  if (tooltipContentGenerator) {
    onHover = o => {
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

  let onClick;

  if (fd.js_onclick_href) {
    onClick = o => {
      const href = (0, _sandbox.default)(fd.js_onclick_href)(o);
      window.open(href);
    };
  } else if (fd.table_filter && onSelect !== undefined) {
    onClick = o => onSelect(o.object[fd.line_column]);
  }

  return {
    onClick,
    onHover,
    pickable: Boolean(onHover)
  };
}

const percentiles = {
  p1: 0.01,
  p5: 0.05,
  p95: 0.95,
  p99: 0.99
};
/* Get an a stat function that operates on arrays, aligns with control=js_agg_function  */

function getAggFunc(type = 'sum', accessor = null) {
  if (type === 'count') {
    return arr => arr.length;
  }

  let d3func;

  if (type in percentiles) {
    d3func = (arr, acc) => {
      let sortedArr;

      if (accessor) {
        sortedArr = arr.sort((o1, o2) => d3array.ascending(accessor(o1), accessor(o2)));
      } else {
        sortedArr = arr.sort(d3array.ascending);
      }

      return d3array.quantile(sortedArr, percentiles[type], acc);
    };
  } else {
    d3func = d3array[type];
  }

  if (!accessor) {
    return arr => d3func(arr);
  }

  return arr => d3func(arr.map(accessor));
}