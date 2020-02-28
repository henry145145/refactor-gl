"use strict";

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.getLayer = getLayer;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _deck = require("deck.gl");

var _translation = require("@superset-ui/translation");

var _AnimatableDeckGLContainer = _interopRequireDefault(require("../../AnimatableDeckGLContainer"));

var _time = require("../../utils/time");

var _sandbox = _interopRequireDefault(require("../../utils/sandbox"));

var _common = require("../common");

var _TooltipRow = _interopRequireDefault(require("../../TooltipRow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function getPoints(data) {
  return data.map(function (d) {
    return d.position;
  });
}

function setTooltipContent(o) {
  return _react.default.createElement("div", {
    className: "deckgl-tooltip"
  }, _react.default.createElement(_TooltipRow.default, {
    label: (0, _translation.t)('Longitude and Latitude') + ": ",
    value: o.coordinate[0] + ", " + o.coordinate[1]
  }), _react.default.createElement(_TooltipRow.default, {
    label: (0, _translation.t)('Weight') + ": ",
    value: "" + o.object.weight
  }));
}

function getLayer(formData, payload, onAddFilter, setTooltip, selected, onSelect, filters) {
  var fd = formData;
  var c = fd.color_picker;
  var data = payload.data.features.map(function (d) {
    return Object.assign({}, d, {
      color: [c.r, c.g, c.b, 255 * c.a]
    });
  });

  if (fd.js_data_mutator) {
    // Applying user defined data mutator if defined
    var jsFnMutator = (0, _sandbox.default)(fd.js_data_mutator);
    data = jsFnMutator(data);
  }

  if (filters != null) {
    filters.forEach(function (f) {
      data = data.filter(function (x) {
        return f(x);
      });
    });
  } // Passing a layer creator function instead of a layer since the
  // layer needs to be regenerated at each render


  return new _deck.ScreenGridLayer(Object.assign({
    id: "screengrid-layer-" + fd.slice_id,
    data: data,
    pickable: true,
    cellSizePixels: fd.grid_size,
    minColor: [c.r, c.g, c.b, 0],
    maxColor: [c.r, c.g, c.b, 255 * c.a],
    outline: false,
    getWeight: function getWeight(d) {
      return d.weight || 0;
    }
  }, (0, _common.commonLayerProps)(fd, setTooltip, setTooltipContent)));
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

var DeckGLScreenGrid = /*#__PURE__*/function (_React$PureComponent) {
  _inheritsLoose(DeckGLScreenGrid, _React$PureComponent);

  function DeckGLScreenGrid(props) {
    var _this;

    _this = _React$PureComponent.call(this, props) || this;
    _this.state = DeckGLScreenGrid.getDerivedStateFromProps(props);
    _this.getLayers = _this.getLayers.bind(_assertThisInitialized(_this));
    _this.onValuesChange = _this.onValuesChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  DeckGLScreenGrid.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
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

  var _proto = DeckGLScreenGrid.prototype;

  _proto.onValuesChange = function onValuesChange(values) {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      values: Array.isArray(values) ? values : [values, values + this.state.getStep(values)]
    });
  };

  _proto.getLayers = function getLayers(values) {
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

    var layer = getLayer(this.props.formData, this.props.payload, this.props.onAddFilter, this.props.setTooltip, filters);
    return [layer];
  };

  _proto.render = function render() {
    var _this$props = this.props,
        formData = _this$props.formData,
        payload = _this$props.payload,
        setControlValue = _this$props.setControlValue;
    return _react.default.createElement("div", null, _react.default.createElement(_AnimatableDeckGLContainer.default, {
      aggregation: true,
      getLayers: this.getLayers,
      start: this.state.start,
      end: this.state.end,
      getStep: this.state.getStep,
      values: this.state.values,
      disabled: this.state.disabled,
      viewport: this.state.viewport,
      width: this.props.width,
      height: this.props.height,
      mapboxApiAccessToken: payload.data.mapboxApiKey,
      mapStyle: formData.mapbox_style,
      setControlValue: setControlValue,
      onValuesChange: this.onValuesChange,
      onViewportChange: this.onViewportChange
    }));
  };

  return DeckGLScreenGrid;
}(_react.default.PureComponent);

DeckGLScreenGrid.propTypes = propTypes;
DeckGLScreenGrid.defaultProps = defaultProps;
var _default = DeckGLScreenGrid;
exports.default = _default;