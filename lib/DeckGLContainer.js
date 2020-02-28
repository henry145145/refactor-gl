"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactMapGl = require("react-map-gl");

var _deck = _interopRequireDefault(require("deck.gl"));

require("mapbox-gl/dist/mapbox-gl.css");

require("./css/deckgl.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
const TICK = 250; // milliseconds

const propTypes = {
  viewport: _propTypes.default.object.isRequired,
  layers: _propTypes.default.array.isRequired,
  setControlValue: _propTypes.default.func,
  onViewportChange: _propTypes.default.func,
  mapStyle: _propTypes.default.string,
  mapboxApiAccessToken: _propTypes.default.string.isRequired,
  children: _propTypes.default.node,
  bottomMargin: _propTypes.default.number,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired
};
const defaultProps = {
  mapStyle: 'light',
  setControlValue: () => {},
  children: null,
  bottomMargin: 0
};

class DeckGLContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this); // This has to be placed after this.tick is bound to this

    this.state = {
      timer: setInterval(this.tick, TICK),
      viewState: this.props.viewport
    };
    this.onViewStateChange = this.onViewStateChange.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  onViewStateChange({
    viewState
  }) {
    this.setState({
      viewState,
      lastUpdate: Date.now()
    });
  }

  tick() {
    // Rate limiting updating viewport controls as it triggers lotsa renders
    const {
      lastUpdate
    } = this.state;

    if (lastUpdate && Date.now() - lastUpdate > TICK) {
      const setCV = this.props.setControlValue;

      if (setCV) {
        setCV('viewport', this.state.viewState);
      }

      this.setState({
        lastUpdate: null
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      viewport
    } = nextProps;
    this.setState({
      viewState: viewport
    });
  }

  layers() {
    // Support for layer factory
    if (this.props.layers.some(l => typeof l === 'function')) {
      return this.props.layers.map(l => typeof l === 'function' ? l() : l);
    }

    return this.props.layers;
  }

  render() {
    const {
      children,
      bottomMargin,
      height,
      width
    } = this.props;
    const {
      viewState
    } = this.state;
    const adjustedHeight = height - bottomMargin;
    const layers = this.layers();
    return _react.default.createElement("div", {
      style: {
        position: 'relative',
        width,
        height: adjustedHeight
      }
    }, _react.default.createElement(_deck.default, {
      initWebGLParameters: true,
      controller: true,
      width: width,
      height: adjustedHeight,
      layers: layers,
      viewState: viewState,
      onViewStateChange: this.onViewStateChange
    }, _react.default.createElement(_reactMapGl.StaticMap, {
      mapStyle: this.props.mapStyle,
      mapboxApiAccessToken: this.props.mapboxApiAccessToken
    })), children);
  }

}

exports.default = DeckGLContainer;
DeckGLContainer.propTypes = propTypes;
DeckGLContainer.defaultProps = defaultProps;