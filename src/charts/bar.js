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

    state.xMin = config.xMin !== undefined ?
      config.xMin :
      min(data, config.xAccessor);

    state.yMin = config.yMin !== undefined ?
      config.yMin :
      min(data, config.yAccessor);

    state.xMax = config.xMax !== undefined ?
      config.xMax :
      max(data, config.xAccessor);

    state.yMax = config.yMax !== undefined ?
      config.yMax :
      max(data, config.yAccessor);

    state.transition = transition().duration(config.transitionDuration);

    state.transitionDelay = (d, i) => i * 40;

    if (config.xScale) {
      state.xScale = config.xScale;
    } else {
      switch (config.xScaleType) {
        case 'ordinal':
          state.xScale = helpers.getOrdinalScale(config, data);
          break;
        default:
          state.xScale = helpers.getOrdinalScale(config, data);
      }
    }

    if (config.yScale) {
      state.yScale = config.yScale;
    } else {
      state.yScale = helpers.getQuantitativeScale(config, [state.yMin, state.yMax], data);
    }

    const barComponent = bar(config, state, wrapperComponent, data);
  }

  helpers.getset(exports, config);

  return exports;
};
