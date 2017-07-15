// @flow

import {
  max,
} from 'd3-array';

import {
  transition,
} from 'd3-transition';

import {
  baseConfig,
  barConfig,
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

export default function (): (Array<mixed>) => mixed {
  const config = helpers.extend(baseConfig, barConfig);

  function exports(selection: Array<mixed>) {
    const wrapperComponent = wrapper(config, selection);
    // $FlowNoD3
    const data = selection.datum();
    const state = {};
    const quantitativeMax = max(
      data,
      config.horizontal ? config.xAccessor : config.yAccessor,
    );

    state.xRange = [0, config.width];
    state.yRange = [0, config.height];

    if (config.horizontal) {
      state.xDomain = config.xDomain !== undefined ?
        config.xDomain : [0, quantitativeMax];
      state.yDomain = config.yDomain !== undefined ?
        config.yDomain : data.map(config.yAccessor);
      state.xScale = helpers.getQuantitativeScale(
        config.quantitativeScaleType,
        state.xDomain,
        state.xRange,
      );
      state.yScale = helpers.getOrdinalScale(state.yDomain, state.yRange);
    } else {
      state.xDomain = config.xDomain !== undefined ?
        config.xDomain : data.map(config.xAccessor);
      state.yDomain = config.yDomain !== undefined ?
        config.yDomain : [quantitativeMax, 0];
      state.xScale = helpers.getOrdinalScale(state.xDomain, state.xRange);
      state.yScale = helpers.getQuantitativeScale(
        config.quantitativeScaleType,
        state.yDomain,
        state.yRange,
      );
    }

    state.transition = transition().duration(config.transitionDuration);
    state.transitionDelay = (d, i) => i * config.transitionStepSeed;

    const xAxisComponent = xAxis(config, state, wrapperComponent);
    const yAxisComponent = yAxis(config, state, wrapperComponent);
    const barComponent = bar(config, state, wrapperComponent, data);
  }

  helpers.getset(exports, config);

  return exports;
}
