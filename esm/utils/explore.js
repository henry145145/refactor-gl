import "core-js/modules/es.array.for-each";
import "core-js/modules/es.array.includes";
import "core-js/modules/es.object.keys";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.regexp.exec";
import "core-js/modules/es.regexp.to-string";
import "core-js/modules/es.string.search";
import "core-js/modules/web.dom-collections.for-each";
import URI from 'urijs';
import { safeStringify } from './safeStringify';
var MAX_URL_LENGTH = 8000;
export function getURIDirectory(formData, endpointType) {
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
export function getExploreLongUrl(formData, endpointType, allowOverflow, extraSearch) {
  if (allowOverflow === void 0) {
    allowOverflow = true;
  }

  if (extraSearch === void 0) {
    extraSearch = {};
  }

  if (!formData.datasource) {
    return null;
  }

  var uri = new URI('/');
  var directory = getURIDirectory(formData, endpointType);
  var search = uri.search(true);
  Object.keys(extraSearch).forEach(function (key) {
    search[key] = extraSearch[key];
  });
  search.form_data = safeStringify(formData);

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