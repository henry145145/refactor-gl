import "core-js/modules/es.object.to-string";
import "core-js/modules/es.promise";

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
import { t } from '@superset-ui/translation';
import { ChartMetadata, ChartPlugin } from '@superset-ui/chart';
import thumbnail from './images/thumbnail.png';
import transformProps from '../../transformProps';
var metadata = new ChartMetadata({
  credits: ['https://uber.github.io/deck.gl'],
  description: '',
  name: t('deck.gl Path'),
  thumbnail: thumbnail,
  useLegacyApi: true
});

var PathChartPlugin = /*#__PURE__*/function (_ChartPlugin) {
  _inheritsLoose(PathChartPlugin, _ChartPlugin);

  function PathChartPlugin() {
    return _ChartPlugin.call(this, {
      loadChart: function loadChart() {
        return import('./Path');
      },
      metadata: metadata,
      transformProps: transformProps
    }) || this;
  }

  return PathChartPlugin;
}(ChartPlugin);

export { PathChartPlugin as default };