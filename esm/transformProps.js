function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
const NOOP = () => {};

export default function transformProps(chartProps) {
  const {
    width,
    height,
    rawFormData,
    queryData,
    hooks
  } = chartProps;
  const {
    onAddFilter = NOOP,
    setControlValue = NOOP,
    setTooltip = NOOP
  } = hooks;
  return {
    formData: rawFormData,
    height,
    onAddFilter,
    payload: queryData,
    setControlValue,
    setTooltip,
    viewport: _extends({}, rawFormData.viewport, {
      height,
      width
    }),
    width
  };
}