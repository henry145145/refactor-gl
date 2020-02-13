"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.search");

require("core-js/modules/web.dom-collections.for-each");

exports.__esModule = true;
exports.getURIDirectory = getURIDirectory;
exports.getExploreLongUrl = getExploreLongUrl;

var _urijs = _interopRequireDefault(require("urijs"));

var _safeStringify = require("./safeStringify");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_URL_LENGTH = 8000;

function getURIDirectory(formData, endpointType) {
  if (endpointType === void 0) {
    endpointType = 'base';
  }

  // Building the directory part of the URI
  var directory = '/superset/explore/';

  if (['json', 'csv', 'query', 'results', 'samples'].includes(endpointType)) {
    directory = '/superset/explore_json/';
  }

  return directory;
}

function getExploreLongUrl(formData, endpointType, allowOverflow, extraSearch) {
  if (allowOverflow === void 0) {
    allowOverflow = true;
  }

  if (extraSearch === void 0) {
    extraSearch = {};
  }

  if (!formData.datasource) {
    return null;
  }

  var uri = new _urijs.default('/');
  var directory = getURIDirectory(formData, endpointType);
  var search = uri.search(true);
  Object.keys(extraSearch).forEach(function (key) {
    search[key] = extraSearch[key];
  });
  search.form_data = (0, _safeStringify.safeStringify)(formData);

  if (endpointType === 'standalone') {
    search.standalone = 'true';
  }

  var url = uri.directory(directory).search(search).toString();

  if (!allowOverflow && url.length > MAX_URL_LENGTH) {
    var minimalFormData = {
      datasource: formData.datasource,
      viz_type: formData.viz_type
    };
    return getExploreLongUrl(minimalFormData, endpointType, false, {
      URL_IS_TOO_LONG_TO_SHARE: null
    });
  }

  return url;
}