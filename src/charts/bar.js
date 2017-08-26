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
  ConfigError,
} from '../config';

import {
  xAxis,
  yAxis,
} from '../components/axis';

import brush from '../components/brush';

import bar from '../components/bar';
import helpers from '../helpers';
import { createStore } from '../state';
import wrapper from '../components/wrapper';

import type {
  BarConfig,
  BaseConfig,
  DerivedConfig,
  Store,
} from '../dataTypes';


function setup(
  config: BaseConfig & BarConfig,
  data: any, // TODO data type
): { derivedConfig: DerivedConfig, barData: any } {
  const height = config.height - config.margin.top - config.margin.bottom;
  const width = config.width - config.margin.left - config.margin.right;
  const xRange = [0, width];
  const yRange = [0, height];
  const tr = transition().duration(config.transitionDuration);
  const transitionDelay = (d, i) => i * config.transitionStepSeed;

  switch (config.layout) {
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
      return {
        barData: data,
        derivedConfig: {
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
        },
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
      return {
        barData: data,
        derivedConfig: {
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
        },
      };
    }
    case 'verticalStacked': {
      const keys = config.stackedKeys;
      if (keys.length === 0) {
        throw new ConfigError('A stacked barchart needs a list of stackedKeys');
      }
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
      const zScale = scaleOrdinal(config.schemeCategory || schemeCategory10);
      return {
        barData: series,
        derivedConfig: {
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
        },
      };
    }
    default:
      return {
        barData: data,
        derivedConfig: {
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
        },
      };
  }
}


/**
 Example:
 const barChart = ntc.bar();
 const data = [...];
 const chartContainer = ntc.select('#chart');
 chartContainer.datum(data).call(barChart);
 */

export default function (): (Array<mixed>) => mixed {
  const config: BaseConfig & BarConfig = helpers.extend(baseConfig, barConfig);
  const store: Store = createStore({});

  function exports(selection: Array<mixed>) {
    // Concept:
    // data
    // config
    // derivedConfig
    // store

    // $FlowNoD3
    const data = selection.datum();
    const { derivedConfig, barData } = setup(config, data);

    // store.subscribe(
    //   `${actions.UPDATE_X_DOMAIN}.charts.bar`,
    //   state => console.log('state.xDomain', state.xDomain),
    // );

    const wrapperComponent = wrapper(config, derivedConfig, selection);
    bar(config, derivedConfig, wrapperComponent, barData);
    if (config.xAxisShow) {
      xAxis(config, derivedConfig, wrapperComponent);
    }
    if (config.yAxisShow) {
      yAxis(config, derivedConfig, wrapperComponent);
    }
    if (config.brushShow) {
      brush(config, derivedConfig, store, wrapperComponent);
    }
  }

  helpers.getset(exports, config);
  exports.subscribe = store.subscribe;

  return exports;
}
