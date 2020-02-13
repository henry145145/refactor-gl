"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

exports.__esModule = true;
exports.default = sandboxedEval;

var _vm = _interopRequireDefault(require("vm"));

var _underscore = _interopRequireDefault(require("underscore"));

var d3array = _interopRequireWildcard(require("d3-array"));

var colors = _interopRequireWildcard(require("./colors"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// A safe alternative to JS's eval
// Objects exposed here should be treated like a public API
// if `underscore` had backwards incompatible changes in a future release, we'd
// have to be careful about bumping the library as those changes could break user charts
var GLOBAL_CONTEXT = {
  console: console,
  _: _underscore.default,
  colors: colors,
  d3array: d3array
}; // Copied/modified from https://github.com/hacksparrow/safe-eval/blob/master/index.js

function sandboxedEval(code, context, opts) {
  var sandbox = {};
  var resultKey = "SAFE_EVAL_" + Math.floor(Math.random() * 1000000);
  sandbox[resultKey] = {};
  var codeToEval = resultKey + "=" + code;
  var sandboxContext = Object.assign({}, GLOBAL_CONTEXT, {}, context);
  Object.keys(sandboxContext).forEach(function (key) {
    sandbox[key] = sandboxContext[key];
  });

  try {
    _vm.default.runInNewContext(codeToEval, sandbox, opts);

    return sandbox[resultKey];
  } catch (error) {
    return function () {
      return error;
    };
  }
}