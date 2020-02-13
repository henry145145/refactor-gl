"use strict";

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.split");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _numberFormat = require("@superset-ui/number-format");

require("./Legend.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var categoryDelimiter = ' - ';
var propTypes = {
  categories: _propTypes.default.object,
  toggleCategory: _propTypes.default.func,
  showSingleCategory: _propTypes.default.func,
  format: _propTypes.default.string,
  position: _propTypes.default.oneOf([null, 'tl', 'tr', 'bl', 'br'])
};
var defaultProps = {
  categories: {},
  toggleCategory: function toggleCategory() {},
  showSingleCategory: function showSingleCategory() {},
  format: null,
  position: 'tr'
};

var Legend =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Legend, _React$PureComponent);

  function Legend() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = Legend.prototype;

  _proto.format = function format(value) {
    if (!this.props.format) {
      return value;
    }

    var numValue = parseFloat(value);
    return (0, _numberFormat.formatNumber)(this.props.format, numValue);
  };

  _proto.formatCategoryLabel = function formatCategoryLabel(k) {
    if (!this.props.format) {
      return k;
    }

    if (k.includes(categoryDelimiter)) {
      var values = k.split(categoryDelimiter);
      return this.format(values[0]) + categoryDelimiter + this.format(values[1]);
    }

    return this.format(k);
  };

  _proto.render = function render() {
    var _this = this,
        _style;

    if (Object.keys(this.props.categories).length === 0 || this.props.position === null) {
      return null;
    }

    var categories = Object.entries(this.props.categories).map(function (_ref) {
      var k = _ref[0],
          v = _ref[1];
      var style = {
        color: "rgba(" + v.color.join(', ') + ")"
      };
      var icon = v.enabled ? "\u25FC" : "\u25FB";
      return _react.default.createElement("li", {
        key: k
      }, _react.default.createElement("a", {
        href: "#",
        onClick: function onClick() {
          return _this.props.toggleCategory(k);
        },
        onDoubleClick: function onDoubleClick() {
          return _this.props.showSingleCategory(k);
        }
      }, _react.default.createElement("span", {
        style: style
      }, icon), " ", _this.formatCategoryLabel(k)));
    });
    var vertical = this.props.position.charAt(0) === 't' ? 'top' : 'bottom';
    var horizontal = this.props.position.charAt(1) === 'r' ? 'right' : 'left';
    var style = (_style = {
      position: 'absolute'
    }, _style[vertical] = '0px', _style[horizontal] = '10px', _style);
    return _react.default.createElement("div", {
      className: "legend",
      style: style
    }, _react.default.createElement("ul", {
      className: "categories"
    }, categories));
  };

  return Legend;
}(_react.default.PureComponent);

exports.default = Legend;
Legend.propTypes = propTypes;
Legend.defaultProps = defaultProps;