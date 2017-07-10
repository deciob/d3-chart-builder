// @flow

import {
  max,
  min,
} from 'd3-array';

import {
  select
} from 'd3-selection';

import {
  transition
} from 'd3-transition';

import {
  baseConfig,
  barConfig
} from '../config';

import {
  xAxis,
  yAxis,
} from '../components/axis';

import bar from '../components/bar';
import helpers from '../helpers';
import wrapper from '../components/wrapper';


/**
 Example:
 const barChart = ntc.bar();
 const data = [...];
 const chartContainer = ntc.select('#chart');
 chartContainer.datum(data).call(barChart);
 */

export default function(): (Array<mixed>) => mixed  {
  const config = helpers.extend(baseConfig, barConfig);
  const t = transition().duration(config.transitionDuration);

  function exports(selection: Array<mixed>) {
    const wrapperComponent = wrapper(config, selection);
    // $FlowNoD3
    const data = selection.datum();
    const state = {};
    const minX = min(data, config.xAccessor);
    const maxX = max(data, config.xAccessor);
    const minY = min(data, config.yAccessor);
    const maxY = max(data, config.yAccessor);

    switch (config.xScaleType) {
      case 'ordinal':
        state.xDomain = config.xDomain !== undefined ? config.xDomain : data.map(config.xAccessor);
        state.xScale = helpers.getOrdinalScale(config, state.xDomain);
        break;
    }

    state.yDomain = config.yDomain !== undefined ? config.yDomain : [0, maxY];
    state.yScale = helpers.getQuantitativeScale(config, [0, maxY], [config.height, 0], data);

    state.transition = transition().duration(config.transitionDuration);
    state.transitionDelay = (d, i) => i * config.transitionStepSeed;

    const xAxisComponent = xAxis(config, state, wrapperComponent);
    const yAxisComponent = yAxis(config, state, wrapperComponent);
    const barComponent = bar(config, state, wrapperComponent, data);
  }

  helpers.getset(exports, config);

  return exports;
};
