// @flow

import {
  max,
  min,
} from 'd3-array';

import {
  scaleLinear,
  scaleOrdinal,
  schemeCategory10,
} from 'd3-scale';

import {
  stack,
  stackOffsetDiverging,
  stackOrderAscending,
} from 'd3-shape';

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

import type {
  BarConfig,
  Layouts,
  BaseConfig,
  State,
} from '../config';


/**
 Example:
 const barChart = ntc.bar();
 const data = [...];
 const chartContainer = ntc.select('#chart');
 chartContainer.datum(data).call(barChart);
 */

export default function (): (Array<mixed>) => mixed {
  const config: BaseConfig & BarConfig = helpers.extend(baseConfig, barConfig);

  function exports(selection: Array<mixed>) {
    // $FlowNoD3
    const data = selection.datum();
    const height = config.height - config.margin.top - config.margin.bottom;
    const width = config.width - config.margin.left - config.margin.right;
    let barData;

    const state: State = ((layout: Layouts): State => {
      const xRange = [0, width];
      const yRange = [0, height];
      const tr = transition().duration(config.transitionDuration);
      const transitionDelay = (d, i) => i * config.transitionStepSeed;

      switch (layout) {
        case 'horizontal': {
          const quantitativeMax = max(data, config.xAccessor);
          const quantitativeMin = min(data, config.xAccessor);
          const xDomain = config.xDomain !== undefined ?
            config.xDomain : [
              quantitativeMin < 0 ? quantitativeMin : 0,
              quantitativeMax,
            ];
          const yDomain = config.yDomain !== undefined ?
            config.yDomain : data.map(config.yAccessor);
          const xScale = helpers.getQuantitativeScale(
            config.quantitativeScaleType,
            xDomain,
            xRange,
          );
          const yScale = helpers.getOrdinalBandScale(yDomain, yRange);
          const zScale = undefined;
          barData = data;
          return {
            height,
            transition: tr,
            transitionDelay,
            width,
            xDomain,
            xRange,
            xScale,
            yDomain,
            yRange,
            yScale,
            zScale,
          };
        }
        case 'vertical': {
          const quantitativeMax = max(data, config.yAccessor);
          const quantitativeMin = min(data, config.yAccessor);
          const xDomain = config.xDomain !== undefined ?
            config.xDomain : data.map(config.xAccessor);
          const yDomain = config.yDomain !== undefined ?
            config.yDomain : [
              quantitativeMax,
              quantitativeMin < 0 ? quantitativeMin : 0,
            ];
          const xScale = helpers.getOrdinalBandScale(xDomain, xRange);
          const yScale = helpers.getQuantitativeScale(
            config.quantitativeScaleType,
            yDomain,
            yRange,
          );
          const zScale = undefined;
          barData = data;
          return {
            height,
            transition: tr,
            transitionDelay,
            width,
            xDomain,
            xRange,
            xScale,
            yDomain,
            yRange,
            yScale,
            zScale,
          };
        }
        case 'verticalStacked': {
          const keys = config.stackedKeys ||
            helpers.getDefaultStackedKeys(config.layout, data);
          const offset = config.divergin ?
            stackOffsetDiverging :
            stackOrderAscending;
          const series = stack()
            .keys(keys)
            .offset(offset)(data);
          const xDomain = config.xDomain !== undefined ?
            config.xDomain : data.map(config.xAccessor);
          const yDomain = config.yDomain !== undefined ?
            config.yDomain : [
              min(series, helpers.stackMin),
              max(series, helpers.stackMax),
            ];
          const xScale = helpers.getOrdinalBandScale(xDomain, xRange);
          const yScale = scaleLinear()
            .domain(yDomain)
            .rangeRound([height, 0]);
          const zScale = scaleOrdinal(schemeCategory10);
          barData = series;
          return {
            height,
            transition: tr,
            transitionDelay,
            width,
            xDomain,
            xRange,
            xScale,
            yRange,
            yDomain,
            yScale,
            zScale,
          };
        }
        default:
          barData = data;
          return {
            height,
            transition: tr,
            transitionDelay,
            width,
            xDomain: [0, 0],
            xRange,
            xScale: () => undefined,
            yRange,
            yDomain: [0, 0],
            yScale: () => undefined,
            zScale: undefined,
          };
      }
    })(config.layout);

    const wrapperComponent = wrapper(config, state, selection);
    const barComponent = bar(config, state, wrapperComponent, barData);
    const xAxisComponent = xAxis(config, state, wrapperComponent);
    const yAxisComponent = yAxis(config, state, wrapperComponent);
  }

  helpers.getset(exports, config);

  return exports;
}
