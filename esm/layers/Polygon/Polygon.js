import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.filter";
import "core-js/modules/es.array.flat-map";
import "core-js/modules/es.array.for-each";
import "core-js/modules/es.array.includes";
import "core-js/modules/es.array.index-of";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.array.map";
import "core-js/modules/es.array.splice";
import "core-js/modules/es.array.unscopables.flat-map";
import "core-js/modules/es.object.assign";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.string.includes";
import "core-js/modules/web.dom-collections.for-each";
import "core-js/modules/web.dom-collections.iterator";

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-disable react/sort-prop-types */

/* eslint-disable react/jsx-handler-names */

/* eslint-disable react/no-access-state-in-setstate */

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

/* eslint no-underscore-dangle: ["error", { "allow": ["", "__timestamp"] }] */
import React from 'react';
import PropTypes from 'prop-types';
import { PolygonLayer } from 'deck.gl';
import AnimatableDeckGLContainer from '../../AnimatableDeckGLContainer';
import Legend from '../../components/Legend';
import TooltipRow from '../../TooltipRow';
import { getBuckets, getBreakPointColorScaler } from '../../utils';
import { commonLayerProps, fitViewport } from '../common';
import { getPlaySliderParams } from '../../utils/time';
import sandboxedEval from '../../utils/sandbox';
var DOUBLE_CLICK_TRESHOLD = 250; // milliseconds

function getPoints(features) {
  return features.flatMap(function (d) {
    return d.polygon;
  });
}

function _getElevation(d, colorScaler) {
  /* in deck.gl 5.3.4 (used in Superset as of 2018-10-24), if a polygon has
   * opacity zero it will make everything behind it have opacity zero,
   * effectively showing the map layer no matter what other polygons are
   * behind it.
   */
  return colorScaler(d)[3] === 0 ? 0 : d.elevation;
}

function setTooltipContent(formData) {
  return function (o) {
    var metricLabel = formData.metric.label || formData.metric;
    return React.createElement("div", {
      className: "deckgl-tooltip"
    }, React.createElement(TooltipRow, {
      label: formData.line_column + ": ",
      value: "" + o.object[formData.line_column]
    }), formData.metric && React.createElement(TooltipRow, {
      label: metricLabel + ": ",
      value: "" + o.object[metricLabel]
    }));
  };
}

export function getLayer(formData, payload, onAddFilter, setTooltip, selected, onSelect, filters) {
  var fd = formData;
  var fc = fd.fill_color_picker;
  var sc = fd.stroke_color_picker;
  var data = [].concat(payload.data.features);

  if (filters != null) {
    filters.forEach(function (f) {
      data = data.filter(function (x) {
        return f(x);
      });
    });
  }

  if (fd.js_data_mutator) {
    // Applying user defined data mutator if defined
    var jsFnMutator = sandboxedEval(fd.js_data_mutator);
    data = jsFnMutator(data);
  }

  var metricLabel = fd.metric ? fd.metric.label || fd.metric : null;

  var accessor = function accessor(d) {
    return d[metricLabel];
  }; // base color for the polygons


  var baseColorScaler = fd.metric === null ? function () {
    return [fc.r, fc.g, fc.b, 255 * fc.a];
  } : getBreakPointColorScaler(fd, data, accessor); // when polygons are selected, reduce the opacity of non-selected polygons

  var colorScaler = function colorScaler(d) {
    var baseColor = baseColorScaler(d);

    if (selected.length > 0 && !selected.includes(d[fd.line_column])) {
      baseColor[3] /= 2;
    }

    return baseColor;
  };

  var tooltipContentGenerator = fd.line_column && fd.metric && ['geohash', 'zipcode'].includes(fd.line_type) ? setTooltipContent(fd) : undefined;
  return new PolygonLayer(Object.assign({
    id: "path-layer-" + fd.slice_id,
    data: data,
    pickable: true,
    filled: fd.filled,
    stroked: fd.stroked,
    getPolygon: function getPolygon(d) {
      return d.polygon;
    },
    getFillColor: colorScaler,
    getLineColor: [sc.r, sc.g, sc.b, 255 * sc.a],
    getLineWidth: fd.line_width,
    extruded: fd.extruded,
    getElevation: function getElevation(d) {
      return _getElevation(d, colorScaler);
    },
    elevationScale: fd.multiplier,
    fp64: true
  }, commonLayerProps(fd, setTooltip, tooltipContentGenerator, onSelect)));
}
var propTypes = {
  formData: PropTypes.object.isRequired,
  payload: PropTypes.object.isRequired,
  setControlValue: PropTypes.func.isRequired,
  viewport: PropTypes.object.isRequired,
  onAddFilter: PropTypes.func,
  setTooltip: PropTypes.func,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
var defaultProps = {
  onAddFilter: function onAddFilter() {},
  setTooltip: function setTooltip() {}
};

var DeckGLPolygon = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DeckGLPolygon, _React$Component);

  function DeckGLPolygon(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = DeckGLPolygon.getDerivedStateFromProps(props);
    _this.getLayers = _this.getLayers.bind(_assertThisInitialized(_this));
    _this.onSelect = _this.onSelect.bind(_assertThisInitialized(_this));
    _this.onValuesChange = _this.onValuesChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  DeckGLPolygon.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
    // the state is computed only from the payload; if it hasn't changed, do
    // not recompute state since this would reset selections and/or the play
    // slider position due to changes in form controls
    if (state && props.payload.form_data === state.formData) {
      return null;
    }

    var features = props.payload.data.features || [];
    var timestamps = features.map(function (f) {
      return f.__timestamp;
    }); // the granularity has to be read from the payload form_data, not the
    // props formData which comes from the instantaneous controls state

    var granularity = props.payload.form_data.time_grain_sqla || props.payload.form_data.granularity || 'P1D';

    var _getPlaySliderParams = getPlaySliderParams(timestamps, granularity),
        start = _getPlaySliderParams.start,
        end = _getPlaySliderParams.end,
        getStep = _getPlaySliderParams.getStep,
        values = _getPlaySliderParams.values,
        disabled = _getPlaySliderParams.disabled;

    var viewport = props.formData.autozoom ? fitViewport(props.viewport, getPoints(features)) : props.viewport;
    return {
      start: start,
      end: end,
      getStep: getStep,
      values: values,
      disabled: disabled,
      viewport: viewport,
      selected: [],
      lastClick: 0,
      formData: props.payload.form_data
    };
  };

  var _proto = DeckGLPolygon.prototype;

  _proto.onSelect = function onSelect(polygon) {
    var _this$props = this.props,
        formData = _this$props.formData,
        onAddFilter = _this$props.onAddFilter;
    var now = new Date();
    var doubleClick = now - this.state.lastClick <= DOUBLE_CLICK_TRESHOLD; // toggle selected polygons

    var selected = [].concat(this.state.selected);

    if (doubleClick) {
      selected.splice(0, selected.length, polygon);
    } else if (formData.toggle_polygons) {
      var i = selected.indexOf(polygon);

      if (i === -1) {
        selected.push(polygon);
      } else {
        selected.splice(i, 1);
      }
    } else {
      selected.splice(0, 1, polygon);
    }

    this.setState({
      selected: selected,
      lastClick: now
    });

    if (formData.table_filter) {
      onAddFilter(formData.line_column, selected, false, true);
    }
  };

  _proto.onValuesChange = function onValuesChange(values) {
    this.setState({
      values: Array.isArray(values) ? values : [values, values + this.state.getStep(values)]
    });
  };

  _proto.getLayers = function getLayers(values) {
    if (this.props.payload.data.features === undefined) {
      return [];
    }

    var filters = []; // time filter

    if (values[0] === values[1] || values[1] === this.end) {
      filters.push(function (d) {
        return d.__timestamp >= values[0] && d.__timestamp <= values[1];
      });
    } else {
      filters.push(function (d) {
        return d.__timestamp >= values[0] && d.__timestamp < values[1];
      });
    }

    var layer = getLayer(this.props.formData, this.props.payload, this.props.onAddFilter, this.props.setTooltip, this.state.selected, this.onSelect, filters);
    return [layer];
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        payload = _this$props2.payload,
        formData = _this$props2.formData,
        setControlValue = _this$props2.setControlValue;
    var _this$state = this.state,
        start = _this$state.start,
        end = _this$state.end,
        getStep = _this$state.getStep,
        values = _this$state.values,
        disabled = _this$state.disabled,
        viewport = _this$state.viewport;
    var fd = formData;
    var metricLabel = fd.metric ? fd.metric.label || fd.metric : null;

    var accessor = function accessor(d) {
      return d[metricLabel];
    };

    var buckets = getBuckets(formData, payload.data.features, accessor);
    return React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, React.createElement(AnimatableDeckGLContainer, {
      aggregation: true,
      getLayers: this.getLayers,
      start: start,
      end: end,
      getStep: getStep,
      values: values,
      disabled: disabled,
      viewport: viewport,
      width: this.props.width,
      height: this.props.height,
      mapboxApiAccessToken: payload.data.mapboxApiKey,
      mapStyle: formData.mapbox_style,
      setControlValue: setControlValue,
      onValuesChange: this.onValuesChange,
      onViewportChange: this.onViewportChange
    }, formData.metric !== null && React.createElement(Legend, {
      categories: buckets,
      position: formData.legend_position,
      format: formData.legend_format
    })));
  };

  return DeckGLPolygon;
}(React.Component);

DeckGLPolygon.propTypes = propTypes;
DeckGLPolygon.defaultProps = defaultProps;
export default DeckGLPolygon;