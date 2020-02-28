"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _connection = require("@superset-ui/connection");

var _DeckGLContainer = _interopRequireDefault(require("../DeckGLContainer"));

var _explore = require("../utils/explore");

var _layers = _interopRequireDefault(require("../layers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const propTypes = {
  formData: _propTypes.default.object.isRequired,
  payload: _propTypes.default.object.isRequired,
  setControlValue: _propTypes.default.func.isRequired,
  viewport: _propTypes.default.object.isRequired,
  onAddFilter: _propTypes.default.func,
  setTooltip: _propTypes.default.func,
  onSelect: _propTypes.default.func
};
const defaultProps = {
  onAddFilter() {},

  setTooltip() {},

  onSelect() {}

};

class DeckMulti extends _react.default.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subSlicesLayers: {}
    };
    this.onViewportChange = this.onViewportChange.bind(this);
  }

  componentDidMount() {
    const {
      formData,
      payload
    } = this.props;
    this.loadLayers(formData, payload);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      formData,
      payload
    } = nextProps;
    const hasChanges = !_lodash.default.isEqual(this.props.formData.deck_slices, nextProps.formData.deck_slices);

    if (hasChanges) {
      this.loadLayers(formData, payload);
    }
  }

  onViewportChange(viewport) {
    this.setState({
      viewport
    });
  }

  loadLayers(formData, payload, viewport) {
    this.setState({
      subSlicesLayers: {},
      viewport
    });
    payload.data.slices.forEach(subslice => {
      // Filters applied to multi_deck are passed down to underlying charts
      // note that dashboard contextual information (filter_immune_slices and such) aren't
      // taken into consideration here
      const filters = [...(subslice.form_data.filters || []), ...(formData.filters || []), ...(formData.extra_filters || [])];

      const subsliceCopy = _extends({}, subslice, {
        form_data: _extends({}, subslice.form_data, {
          filters
        })
      });

      _connection.SupersetClient.get({
        endpoint: (0, _explore.getExploreLongUrl)(subsliceCopy.form_data, 'json')
      }).then(({
        json
      }) => {
        const layer = _layers.default[subsliceCopy.form_data.viz_type](subsliceCopy.form_data, json, this.props.onAddFilter, this.props.setTooltip, [], this.props.onSelect);

        this.setState({
          subSlicesLayers: _extends({}, this.state.subSlicesLayers, {
            [subsliceCopy.slice_id]: layer
          })
        });
      }).catch(() => {});
    });
  }

  render() {
    const {
      payload,
      formData,
      setControlValue
    } = this.props;
    const {
      subSlicesLayers
    } = this.state;
    const layers = Object.values(subSlicesLayers);
    return _react.default.createElement(_DeckGLContainer.default, {
      mapboxApiAccessToken: payload.data.mapboxApiKey,
      viewport: this.state.viewport || this.props.viewport,
      layers: layers,
      mapStyle: formData.mapbox_style,
      setControlValue: setControlValue,
      onViewportChange: this.onViewportChange
    });
  }

}

DeckMulti.propTypes = propTypes;
DeckMulti.defaultProps = defaultProps;
var _default = DeckMulti;
exports.default = _default;