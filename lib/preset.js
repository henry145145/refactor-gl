"use strict";

exports.__esModule = true;
exports.default = void 0;

var _core = require("@superset-ui/core");

var _Arc = _interopRequireDefault(require("./layers/Arc"));

var _Geojson = _interopRequireDefault(require("./layers/Geojson"));

var _Grid = _interopRequireDefault(require("./layers/Grid"));

var _Hex = _interopRequireDefault(require("./layers/Hex"));

var _Multi = _interopRequireDefault(require("./Multi"));

var _Path = _interopRequireDefault(require("./layers/Path"));

var _Polygon = _interopRequireDefault(require("./layers/Polygon"));

var _Scatter = _interopRequireDefault(require("./layers/Scatter"));

var _Screengrid = _interopRequireDefault(require("./layers/Screengrid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var DeckGLChartPreset = /*#__PURE__*/function (_Preset) {
  _inheritsLoose(DeckGLChartPreset, _Preset);

  function DeckGLChartPreset() {
    return _Preset.call(this, {
      name: 'deck.gl charts',
      plugins: [new _Arc.default().configure({
        key: 'deck_arc'
      }), new _Geojson.default().configure({
        key: 'deck_geojson'
      }), new _Grid.default().configure({
        key: 'deck_grid'
      }), new _Hex.default().configure({
        key: 'deck_hex'
      }), new _Multi.default().configure({
        key: 'deck_multi'
      }), new _Path.default().configure({
        key: 'deck_path'
      }), new _Polygon.default().configure({
        key: 'deck_polygon'
      }), new _Scatter.default().configure({
        key: 'deck_scatter'
      }), new _Screengrid.default().configure({
        key: 'deck_screengrid'
      })]
    }) || this;
  }

  return DeckGLChartPreset;
}(_core.Preset);

exports.default = DeckGLChartPreset;