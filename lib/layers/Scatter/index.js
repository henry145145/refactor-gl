"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.weak-map");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.default = void 0;

var _translation = require("@superset-ui/translation");

var _chart = require("@superset-ui/chart");

var _thumbnail = _interopRequireDefault(require("./images/thumbnail.png"));

var _transformProps = _interopRequireDefault(require("../../transformProps"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var metadata = new _chart.ChartMetadata({
  credits: ['https://uber.github.io/deck.gl'],
  description: '',
  name: (0, _translation.t)('deck.gl Scatterplot'),
  thumbnail: _thumbnail.default,
  useLegacyApi: true
});

var ScatterChartPlugin = /*#__PURE__*/function (_ChartPlugin) {
  _inheritsLoose(ScatterChartPlugin, _ChartPlugin);

  function ScatterChartPlugin() {
    return _ChartPlugin.call(this, {
      loadChart: function loadChart() {
        return Promise.resolve().then(function () {
          return _interopRequireWildcard(require('./Scatter'));
        });
      },
      metadata: metadata,
      transformProps: _transformProps.default
    }) || this;
  }

  return ScatterChartPlugin;
}(_chart.ChartPlugin);

exports.default = ScatterChartPlugin;