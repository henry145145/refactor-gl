"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var propTypes = {
  label: _propTypes.default.string.isRequired,
  value: _propTypes.default.string.isRequired
};

var TooltipRow =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(TooltipRow, _React$PureComponent);

  function TooltipRow() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = TooltipRow.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        label = _this$props.label,
        value = _this$props.value;
    return _react.default.createElement("div", null, label, _react.default.createElement("strong", null, value));
  };

  return TooltipRow;
}(_react.default.PureComponent);

exports.default = TooltipRow;
TooltipRow.propTypes = propTypes;