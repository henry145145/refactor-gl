function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

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
import React from 'react';
import PropTypes from 'prop-types';
var propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
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
    return React.createElement("div", null, label, React.createElement("strong", null, value));
  };

  return TooltipRow;
}(React.PureComponent);

export { TooltipRow as default };
TooltipRow.propTypes = propTypes;