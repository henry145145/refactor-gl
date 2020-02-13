"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.every");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.object.values");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _color = require("@superset-ui/color");

var _AnimatableDeckGLContainer = _interopRequireDefault(require("./AnimatableDeckGLContainer"));

var _Legend = _interopRequireDefault(require("./components/Legend"));

var _colors = require("./utils/colors");

var _time = require("./utils/time");

var _sandbox = _interopRequireDefault(require("./utils/sandbox"));

var _common = require("./layers/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var getScale = _color.CategoricalColorNamespace.getScale;

function getCategories(fd, data) {
  var c = fd.color_picker || {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  };
  var fixedColor = [c.r, c.g, c.b, 255 * c.a];
  var colorFn = getScale(fd.color_scheme);
  var categories = {};
  data.forEach(function (d) {
    if (d.cat_color != null && !categories.hasOwnProperty(d.cat_color)) {
      var color;

      if (fd.dimension) {
        color = (0, _colors.hexToRGB)(colorFn(d.cat_color), c.a * 255);
      } else {
        color = fixedColor;
      }

      categories[d.cat_color] = {
        color: color,
        enabled: true
      };
    }
  });
  return categories;
}

var propTypes = {
  formData: _propTypes.default.object.isRequired,
  mapboxApiKey: _propTypes.default.string.isRequired,
  setControlValue: _propTypes.default.func.isRequired,
  viewport: _propTypes.default.object.isRequired,
  getLayer: _propTypes.default.func.isRequired,
  getPoints: _propTypes.default.func.isRequired,
  payload: _propTypes.default.object.isRequired,
  onAddFilter: _propTypes.default.func,
  setTooltip: _propTypes.default.func,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired
};

var CategoricalDeckGLContainer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(CategoricalDeckGLContainer, _React$PureComponent);

  /*
   * A Deck.gl container that handles categories.
   *
   * The container will have an interactive legend, populated from the
   * categories present in the data.
   */
  function CategoricalDeckGLContainer(props) {
    var _this;

    _this = _React$PureComponent.call(this, props) || this;
    _this.state = _this.getStateFromProps(props);
    _this.getLayers = _this.getLayers.bind(_assertThisInitialized(_this));
    _this.onValuesChange = _this.onValuesChange.bind(_assertThisInitialized(_this));
    _this.toggleCategory = _this.toggleCategory.bind(_assertThisInitialized(_this));
    _this.showSingleCategory = _this.showSingleCategory.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = CategoricalDeckGLContainer.prototype;

  _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.payload.form_data !== this.state.formData) {
      this.setState(Object.assign({}, this.getStateFromProps(nextProps)));
    }
  };

  _proto.onValuesChange = function onValuesChange(values) {
    this.setState({
      values: Array.isArray(values) ? values : [values, values + this.state.getStep(values)]
    });
  } // eslint-disable-next-line class-methods-use-this
  ;

  _proto.getStateFromProps = function getStateFromProps(props, state) {
    var features = props.payload.data.features || [];
    var timestamps = features.map(function (f) {
      return f.__timestamp;
    });
    var categories = getCategories(props.formData, features); // the state is computed only from the payload; if it hasn't changed, do
    // not recompute state since this would reset selections and/or the play
    // slider position due to changes in form controls

    if (state && props.payload.form_data === state.formData) {
      return Object.assign({}, state, {
        categories: categories
      });
    } // the granularity has to be read from the payload form_data, not the
    // props formData which comes from the instantaneous controls state


    var granularity = props.payload.form_data.time_grain_sqla || props.payload.form_data.granularity || 'P1D';

    var _getPlaySliderParams = (0, _time.getPlaySliderParams)(timestamps, granularity),
        start = _getPlaySliderParams.start,
        end = _getPlaySliderParams.end,
        getStep = _getPlaySliderParams.getStep,
        values = _getPlaySliderParams.values,
        disabled = _getPlaySliderParams.disabled;

    var viewport = props.formData.autozoom ? (0, _common.fitViewport)(props.viewport, props.getPoints(features)) : props.viewport;
    return {
      start: start,
      end: end,
      getStep: getStep,
      values: values,
      disabled: disabled,
      viewport: viewport,
      selected: [],
      lastClick: 0,
      formData: props.payload.form_data,
      categories: categories
    };
  };

  _proto.getLayers = function getLayers(values) {
    var _this$props = this.props,
        getLayer = _this$props.getLayer,
        payload = _this$props.payload,
        fd = _this$props.formData,
        onAddFilter = _this$props.onAddFilter,
        setTooltip = _this$props.setTooltip;
    var features = payload.data.features ? [].concat(payload.data.features) : []; // Add colors from categories or fixed color

    features = this.addColor(features, fd); // Apply user defined data mutator if defined

    if (fd.js_data_mutator) {
      var jsFnMutator = (0, _sandbox.default)(fd.js_data_mutator);
      features = jsFnMutator(features);
    } // Filter by time


    if (values[0] === values[1] || values[1] === this.end) {
      features = features.filter(function (d) {
        return d.__timestamp >= values[0] && d.__timestamp <= values[1];
      });
    } else {
      features = features.filter(function (d) {
        return d.__timestamp >= values[0] && d.__timestamp < values[1];
      });
    } // Show only categories selected in the legend


    var cats = this.state.categories;

    if (fd.dimension) {
      features = features.filter(function (d) {
        return cats[d.cat_color] && cats[d.cat_color].enabled;
      });
    }

    var filteredPayload = Object.assign({}, payload, {
      data: Object.assign({}, payload.data, {
        features: features
      })
    });
    return [getLayer(fd, filteredPayload, onAddFilter, setTooltip)];
  } // eslint-disable-next-line class-methods-use-this
  ;

  _proto.addColor = function addColor(data, fd) {
    var c = fd.color_picker || {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    };
    var colorFn = getScale(fd.color_scheme);
    return data.map(function (d) {
      var color;

      if (fd.dimension) {
        color = (0, _colors.hexToRGB)(colorFn(d.cat_color), c.a * 255);
        return Object.assign({}, d, {
          color: color
        });
      }

      return d;
    });
  };

  _proto.toggleCategory = function toggleCategory(category) {
    var _Object$assign;

    var categoryState = this.state.categories[category];
    var categories = Object.assign({}, this.state.categories, (_Object$assign = {}, _Object$assign[category] = Object.assign({}, categoryState, {
      enabled: !categoryState.enabled
    }), _Object$assign)); // if all categories are disabled, enable all -- similar to nvd3

    if (Object.values(categories).every(function (v) {
      return !v.enabled;
    })) {
      /* eslint-disable no-param-reassign */
      Object.values(categories).forEach(function (v) {
        v.enabled = true;
      });
    }

    this.setState({
      categories: categories
    });
  };

  _proto.showSingleCategory = function showSingleCategory(category) {
    var categories = Object.assign({}, this.state.categories);
    /* eslint-disable no-param-reassign */

    Object.values(categories).forEach(function (v) {
      v.enabled = false;
    });
    categories[category].enabled = true;
    this.setState({
      categories: categories
    });
  };

  _proto.render = function render() {
    return _react.default.createElement("div", {
      style: {
        position: 'relative'
      }
    }, _react.default.createElement(_AnimatableDeckGLContainer.default, {
      getLayers: this.getLayers,
      start: this.state.start,
      end: this.state.end,
      getStep: this.state.getStep,
      values: this.state.values,
      disabled: this.state.disabled,
      viewport: this.state.viewport,
      mapboxApiAccessToken: this.props.mapboxApiKey,
      mapStyle: this.props.formData.mapbox_style,
      setControlValue: this.props.setControlValue,
      width: this.props.width,
      height: this.props.height
    }, _react.default.createElement(_Legend.default, {
      categories: this.state.categories,
      toggleCategory: this.toggleCategory,
      showSingleCategory: this.showSingleCategory,
      position: this.props.formData.legend_position,
      format: this.props.formData.legend_format
    })));
  };

  return CategoricalDeckGLContainer;
}(_react.default.PureComponent);

exports.default = CategoricalDeckGLContainer;
CategoricalDeckGLContainer.propTypes = propTypes;