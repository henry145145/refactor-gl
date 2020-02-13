import "core-js/modules/es.array.includes";
import "core-js/modules/es.array.join";
import "core-js/modules/es.array.map";
import "core-js/modules/es.object.entries";
import "core-js/modules/es.object.keys";
import "core-js/modules/es.regexp.exec";
import "core-js/modules/es.string.includes";
import "core-js/modules/es.string.split";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-disable react/jsx-sort-default-props */

/* eslint-disable react/sort-prop-types */

/* eslint-disable jsx-a11y/anchor-is-valid */

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
import { formatNumber } from '@superset-ui/number-format';
import './Legend.css';
var categoryDelimiter = ' - ';
var propTypes = {
  categories: PropTypes.object,
  toggleCategory: PropTypes.func,
  showSingleCategory: PropTypes.func,
  format: PropTypes.string,
  position: PropTypes.oneOf([null, 'tl', 'tr', 'bl', 'br'])
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
    return formatNumber(this.props.format, numValue);
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
      return React.createElement("li", {
        key: k
      }, React.createElement("a", {
        href: "#",
        onClick: function onClick() {
          return _this.props.toggleCategory(k);
        },
        onDoubleClick: function onDoubleClick() {
          return _this.props.showSingleCategory(k);
        }
      }, React.createElement("span", {
        style: style
      }, icon), " ", _this.formatCategoryLabel(k)));
    });
    var vertical = this.props.position.charAt(0) === 't' ? 'top' : 'bottom';
    var horizontal = this.props.position.charAt(1) === 'r' ? 'right' : 'left';
    var style = (_style = {
      position: 'absolute'
    }, _style[vertical] = '0px', _style[horizontal] = '10px', _style);
    return React.createElement("div", {
      className: "legend",
      style: style
    }, React.createElement("ul", {
      className: "categories"
    }, categories));
  };

  return Legend;
}(React.PureComponent);

export { Legend as default };
Legend.propTypes = propTypes;
Legend.defaultProps = defaultProps;