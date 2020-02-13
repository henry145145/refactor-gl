import "core-js/modules/es.array.map";
import "core-js/modules/es.array.some";

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-disable react/jsx-sort-default-props */

/* eslint-disable react/sort-prop-types */

/* eslint-disable react/jsx-handler-names */

/* eslint-disable react/forbid-prop-types */

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
import { StaticMap } from 'react-map-gl';
import DeckGL from 'deck.gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './css/deckgl.css';
var TICK = 250; // milliseconds

var propTypes = {
  viewport: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  setControlValue: PropTypes.func,
  mapStyle: PropTypes.string,
  mapboxApiAccessToken: PropTypes.string.isRequired,
  children: PropTypes.node,
  bottomMargin: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
var defaultProps = {
  mapStyle: 'light',
  setControlValue: function setControlValue() {},
  children: null,
  bottomMargin: 0
};

var DeckGLContainer =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(DeckGLContainer, _React$Component);

  function DeckGLContainer(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.tick = _this.tick.bind(_assertThisInitialized(_this));
    _this.onViewStateChange = _this.onViewStateChange.bind(_assertThisInitialized(_this)); // This has to be placed after this.tick is bound to this

    _this.state = {
      timer: setInterval(_this.tick, TICK),
      viewState: props.viewport
    };
    return _this;
  }

  var _proto = DeckGLContainer.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    clearInterval(this.state.timer);
  };

  _proto.onViewStateChange = function onViewStateChange(_ref) {
    var viewState = _ref.viewState;
    this.setState({
      viewState: viewState,
      lastUpdate: Date.now()
    });
  };

  _proto.tick = function tick() {
    // Rate limiting updating viewport controls as it triggers lotsa renders
    var lastUpdate = this.state.lastUpdate;

    if (lastUpdate && Date.now() - lastUpdate > TICK) {
      var setCV = this.props.setControlValue;

      if (setCV) {
        setCV('viewport', this.state.viewState);
      }

      this.setState({
        lastUpdate: null
      });
    }
  };

  _proto.layers = function layers() {
    // Support for layer factory
    if (this.props.layers.some(function (l) {
      return typeof l === 'function';
    })) {
      return this.props.layers.map(function (l) {
        return typeof l === 'function' ? l() : l;
      });
    }

    return this.props.layers;
  };

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        bottomMargin = _this$props.bottomMargin,
        height = _this$props.height,
        width = _this$props.width;
    var viewState = this.state.viewState;
    var adjustedHeight = height - bottomMargin;
    var layers = this.layers();
    return React.createElement("div", {
      style: {
        position: 'relative',
        width: width,
        height: adjustedHeight
      }
    }, React.createElement(DeckGL, {
      initWebGLParameters: true,
      controller: true,
      width: width,
      height: adjustedHeight,
      layers: layers,
      viewState: viewState,
      onViewStateChange: this.onViewStateChange
    }, React.createElement(StaticMap, {
      mapStyle: this.props.mapStyle,
      mapboxApiAccessToken: this.props.mapboxApiAccessToken
    })), children);
  };

  return DeckGLContainer;
}(React.Component);

export { DeckGLContainer as default };
DeckGLContainer.propTypes = propTypes;
DeckGLContainer.defaultProps = defaultProps;