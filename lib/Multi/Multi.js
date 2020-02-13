"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.values");

require("core-js/modules/web.dom-collections.for-each");

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

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var propTypes = {
  formData: _propTypes.default.object.isRequired,
  payload: _propTypes.default.object.isRequired,
  setControlValue: _propTypes.default.func.isRequired,
  viewport: _propTypes.default.object.isRequired,
  onAddFilter: _propTypes.default.func,
  setTooltip: _propTypes.default.func,
  onSelect: _propTypes.default.func
};
var defaultProps = {
  onAddFilter: function onAddFilter() {},
  setTooltip: function setTooltip() {},
  onSelect: function onSelect() {}
};

var DeckMulti =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(DeckMulti, _React$PureComponent);

  function DeckMulti(props) {
    var _this;

    _this = _React$PureComponent.call(this, props) || this;
    _this.state = {
      subSlicesLayers: {}
    };
    _this.onViewportChange = _this.onViewportChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = DeckMulti.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$props = this.props,
        formData = _this$props.formData,
        payload = _this$props.payload;
    this.loadLayers(formData, payload);
  };

  _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    var formData = nextProps.formData,
        payload = nextProps.payload;
    var hasChanges = !_lodash.default.isEqual(this.props.formData.deck_slices, nextProps.formData.deck_slices);

    if (hasChanges) {
      this.loadLayers(formData, payload);
    }
  };

  _proto.onViewportChange = function onViewportChange(viewport) {
    this.setState({
      viewport: viewport
    });
  };

  _proto.loadLayers = function loadLayers(formData, payload, viewport) {
    var _this2 = this;

    this.setState({
      subSlicesLayers: {},
      viewport: viewport
    });
    payload.data.slices.forEach(function (subslice) {
      // Filters applied to multi_deck are passed down to underlying charts
      // note that dashboard contextual information (filter_immune_slices and such) aren't
      // taken into consideration here
      var filters = [].concat(subslice.form_data.filters || [], formData.filters || [], formData.extra_filters || []);
      var subsliceCopy = Object.assign({}, subslice, {
        form_data: Object.assign({}, subslice.form_data, {
          filters: filters
        })
      });

      _connection.SupersetClient.get({
        endpoint: (0, _explore.getExploreLongUrl)(subsliceCopy.form_data, 'json')
      }).then(function (_ref) {
        var _Object$assign;

        var json = _ref.json;

        var layer = _layers.default[subsliceCopy.form_data.viz_type](subsliceCopy.form_data, json, _this2.props.onAddFilter, _this2.props.setTooltip, [], _this2.props.onSelect);

        _this2.setState({
          subSlicesLayers: Object.assign({}, _this2.state.subSlicesLayers, (_Object$assign = {}, _Object$assign[subsliceCopy.slice_id] = layer, _Object$assign))
        });
      }).catch(function () {});
    });
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        payload = _this$props2.payload,
        formData = _this$props2.formData,
        setControlValue = _this$props2.setControlValue;
    var subSlicesLayers = this.state.subSlicesLayers;
    var layers = Object.values(subSlicesLayers);
    return _react.default.createElement(_DeckGLContainer.default, {
      mapboxApiAccessToken: payload.data.mapboxApiKey,
      viewport: this.state.viewport || this.props.viewport,
      layers: layers,
      mapStyle: formData.mapbox_style,
      setControlValue: setControlValue,
      onViewportChange: this.onViewportChange
    });
  };

  return DeckMulti;
}(_react.default.PureComponent);

DeckMulti.propTypes = propTypes;
DeckMulti.defaultProps = defaultProps;
var _default = DeckMulti;
exports.default = _default;