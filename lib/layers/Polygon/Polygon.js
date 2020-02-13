"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.flat-map");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.array.unscopables.flat-map");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.getLayer = getLayer;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _deck = require("deck.gl");

var _AnimatableDeckGLContainer = _interopRequireDefault(require("../../AnimatableDeckGLContainer"));

var _Legend = _interopRequireDefault(require("../../components/Legend"));

var _TooltipRow = _interopRequireDefault(require("../../TooltipRow"));

var _utils = require("../../utils");

var _common = require("../common");

var _time = require("../../utils/time");

var _sandbox = _interopRequireDefault(require("../../utils/sandbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

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
    return _react.default.createElement("div", {
      className: "deckgl-tooltip"
    }, _react.default.createElement(_TooltipRow.default, {
      label: formData.line_column + ": ",
      value: "" + o.object[formData.line_column]
    }), formData.metric && _react.default.createElement(_TooltipRow.default, {
      label: metricLabel + ": ",
      value: "" + o.object[metricLabel]
    }));
  };
}

function getLayer(formData, payload, onAddFilter, setTooltip, selected, onSelect, filters) {
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
    var jsFnMutator = (0, _sandbox.default)(fd.js_data_mutator);
    data = jsFnMutator(data);
  }

  var metricLabel = fd.metric ? fd.metric.label || fd.metric : null;

  var accessor = function accessor(d) {
    return d[metricLabel];
  }; // base color for the polygons


  var baseColorScaler = fd.metric === null ? function () {
    return [fc.r, fc.g, fc.b, 255 * fc.a];
  } : (0, _utils.getBreakPointColorScaler)(fd, data, accessor); // when polygons are selected, reduce the opacity of non-selected polygons

  var colorScaler = function colorScaler(d) {
    var baseColor = baseColorScaler(d);

    if (selected.length > 0 && !selected.includes(d[fd.line_column])) {
      baseColor[3] /= 2;
    }

    return baseColor;
  };

  var tooltipContentGenerator = fd.line_column && fd.metric && ['geohash', 'zipcode'].includes(fd.line_type) ? setTooltipContent(fd) : undefined;
  return new _deck.PolygonLayer(Object.assign({
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
  }, (0, _common.commonLayerProps)(fd, setTooltip, tooltipContentGenerator, onSelect)));
}

var propTypes = {
  formData: _propTypes.default.object.isRequired,
  payload: _propTypes.default.object.isRequired,
  setControlValue: _propTypes.default.func.isRequired,
  viewport: _propTypes.default.object.isRequired,
  onAddFilter: _propTypes.default.func,
  setTooltip: _propTypes.default.func,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired
};
var defaultProps = {
  onAddFilter: function onAddFilter() {},
  setTooltip: function setTooltip() {}
};

var DeckGLPolygon =
/*#__PURE__*/
function (_React$Component) {
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

    var _getPlaySliderParams = (0, _time.getPlaySliderParams)(timestamps, granularity),
        start = _getPlaySliderParams.start,
        end = _getPlaySliderParams.end,
        getStep = _getPlaySliderParams.getStep,
        values = _getPlaySliderParams.values,
        disabled = _getPlaySliderParams.disabled;

    var viewport = props.formData.autozoom ? (0, _common.fitViewport)(props.viewport, getPoints(features)) : props.viewport;
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

    var buckets = (0, _utils.getBuckets)(formData, payload.data.features, accessor);
    return _react.default.createElement("div", {
      style: {
        position: 'relative'
      }
    }, _react.default.createElement(_AnimatableDeckGLContainer.default, {
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
    }, formData.metric !== null && _react.default.createElement(_Legend.default, {
      categories: buckets,
      position: formData.legend_position,
      format: formData.legend_format
    })));
  };

  return DeckGLPolygon;
}(_react.default.Component);

DeckGLPolygon.propTypes = propTypes;
DeckGLPolygon.defaultProps = defaultProps;
var _default = DeckGLPolygon;
exports.default = _default;