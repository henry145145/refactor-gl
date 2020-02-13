"use strict";

require("core-js/modules/es.object.assign");

exports.__esModule = true;
exports.default = transformProps;

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
var NOOP = function NOOP() {};

function transformProps(chartProps) {
  var width = chartProps.width,
      height = chartProps.height,
      rawFormData = chartProps.rawFormData,
      queryData = chartProps.queryData,
      hooks = chartProps.hooks;
  var _hooks$onAddFilter = hooks.onAddFilter,
      onAddFilter = _hooks$onAddFilter === void 0 ? NOOP : _hooks$onAddFilter,
      _hooks$setControlValu = hooks.setControlValue,
      setControlValue = _hooks$setControlValu === void 0 ? NOOP : _hooks$setControlValu,
      _hooks$setTooltip = hooks.setTooltip,
      setTooltip = _hooks$setTooltip === void 0 ? NOOP : _hooks$setTooltip;
  return {
    formData: rawFormData,
    height: height,
    onAddFilter: onAddFilter,
    payload: queryData,
    setControlValue: setControlValue,
    setTooltip: setTooltip,
    viewport: Object.assign({}, rawFormData.viewport, {
      height: height,
      width: width
    }),
    width: width
  };
}