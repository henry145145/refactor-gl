"use strict";

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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function getPoints(data) {
  return data.map(d => d.position);
}

function setTooltipContent(o) {
  return _react.default.createElement("div", {
    className: "deckgl-tooltip"
  }, _react.default.createElement(_TooltipRow.default, {
    label: (0, _translation.t)('Longitude and Latitude') + ": ",
    value: o.object.position[0] + ", " + o.object.position[1]
  }), _react.default.createElement(_TooltipRow.default, {
    label: (0, _translation.t)('Weight') + ": ",
    value: "" + o.object.weight
  }));
}

function getLayer(formData, payload, onAddFilter, setTooltip, selected, onSelect, filters) {
  const fd = formData;
  const c = fd.color_picker;
  let data = payload.data.features.map(d => _extends({}, d, {
    color: [c.r, c.g, c.b, 255 * c.a]
  }));

  if (fd.js_data_mutator) {
    // Applying user defined data mutator if defined
    const jsFnMutator = (0, _sandbox.default)(fd.js_data_mutator);
    data = jsFnMutator(data);
  } // eslint-disable-next-line no-eq-null


  if (filters != null) {
    filters.forEach(f => {
      data = data.filter(f);
    });
  } // Passing a layer creator function instead of a layer since the
  // layer needs to be regenerated at each render


  return new _deck.ScreenGridLayer(_extends({
    id: "screengrid-layer-" + fd.slice_id,
    data,
    pickable: true,
    cellSizePixels: fd.grid_size,
    minColor: [c.r, c.g, c.b, 0],
    maxColor: [c.r, c.g, c.b, 255 * c.a],
    outline: false,
    getWeight: d => d.weight || 0
  }, (0, _common.commonLayerProps)(fd, setTooltip, setTooltipContent)));
}

const propTypes = {
  formData: _propTypes.default.object.isRequired,
  payload: _propTypes.default.object.isRequired,
  setControlValue: _propTypes.default.func.isRequired,
  viewport: _propTypes.default.object.isRequired,
  onAddFilter: _propTypes.default.func,
  setTooltip: _propTypes.default.func
};
const defaultProps = {
  onAddFilter() {},

  setTooltip() {}

};

class DeckGLScreenGrid extends _react.default.PureComponent {
  constructor(props) {
    super(props);
    this.state = DeckGLScreenGrid.getDerivedStateFromProps(props);
    this.getLayers = this.getLayers.bind(this);
    this.onValuesChange = this.onValuesChange.bind(this);
    this.onViewportChange = this.onViewportChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    // the state is computed only from the payload; if it hasn't changed, do
    // not recompute state since this would reset selections and/or the play
    // slider position due to changes in form controls
    if (state && props.payload.form_data === state.formData) {
      return null;
    }

    const features = props.payload.data.features || [];
    const timestamps = features.map(f => f.__timestamp); // the granularity has to be read from the payload form_data, not the
    // props formData which comes from the instantaneous controls state

    const granularity = props.payload.form_data.time_grain_sqla || props.payload.form_data.granularity || 'P1D';
    const {
      start,
      end,
      getStep,
      values,
      disabled
    } = (0, _time.getPlaySliderParams)(timestamps, granularity);
    const viewport = props.formData.autozoom ? (0, _common.fitViewport)(props.viewport, getPoints(features)) : props.viewport;
    return {
      start,
      end,
      getStep,
      values,
      disabled,
      viewport,
      selected: [],
      lastClick: 0,
      formData: props.payload.form_data
    };
  }

  onValuesChange(values) {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      values: Array.isArray(values) ? values : [values, values + this.state.getStep(values)]
    });
  }

  onViewportChange(viewport) {
    this.setState({
      viewport
    });
  }

  getLayers(values) {
    const filters = []; // time filter

    if (values[0] === values[1] || values[1] === this.end) {
      filters.push(d => d.__timestamp >= values[0] && d.__timestamp <= values[1]);
    } else {
      filters.push(d => d.__timestamp >= values[0] && d.__timestamp < values[1]);
    }

    const layer = getLayer(this.props.formData, this.props.payload, this.props.onAddFilter, this.props.setTooltip, filters);
    return [layer];
  }

  render() {
    const {
      formData,
      payload,
      setControlValue
    } = this.props;
    return _react.default.createElement("div", null, _react.default.createElement(_AnimatableDeckGLContainer.default, {
      getLayers: this.getLayers,
      start: this.state.start,
      end: this.state.end,
      getStep: this.state.getStep,
      values: this.state.values,
      onValuesChange: this.onValuesChange,
      disabled: this.state.disabled,
      viewport: this.state.viewport,
      onViewportChange: this.onViewportChange,
      mapboxApiAccessToken: payload.data.mapboxApiKey,
      mapStyle: formData.mapbox_style,
      setControlValue: setControlValue,
      aggregation: true
    }));
  }

}

DeckGLScreenGrid.propTypes = propTypes;
DeckGLScreenGrid.defaultProps = defaultProps;
var _default = DeckGLScreenGrid;
exports.default = _default;