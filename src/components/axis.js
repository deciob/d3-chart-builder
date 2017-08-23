// @flow

import {
  axisBottom,
  axisLeft,
} from 'd3-axis';

import type {
  BaseConfig,
  DerivedConfig,
} from '../config';

// TODO:
// Axis positioning, see: https://bl.ocks.org/mbostock/b5935342c6d21928111928401e2c8608


function drawAxis(
  config: BaseConfig,
  derivedConfig: DerivedConfig,
  container: Array<mixed>,
  cssClass: string,
  axis: (Array<mixed>) => mixed,
): Array<mixed> {
  // $FlowNoD3
  let axisG = container.select(`.${cssClass}`);

  if (axisG.empty()) {
    // $FlowNoD3
    axisG = container.append('g');
  }

  switch (cssClass) {
    case 'x-axis-g': {
      let zeroLevel = 0;
      if (config.fixedAxis || config.layout.includes('horizontal')) {
        zeroLevel = derivedConfig.height;
      } else if (config.layout.includes('vertical')) {
        zeroLevel = derivedConfig.yScale(0);
      }
      axisG.attr('transform', `translate(0, ${zeroLevel})`)
        .attr('class', `axis-g ${cssClass}`);
      break;
    }
    case 'y-axis-g':
      if (config.fixedAxis || config.layout.includes('vertical')) {
        axisG.attr('class', `axis-g ${cssClass}`);
      } else if (config.layout.includes('horizontal')) {
        const zeroLevel = derivedConfig.xScale(0);
        axisG.attr('transform', `translate(${zeroLevel}, 0)`)
          .attr('class', `axis-g ${cssClass}`);
      }
      break;
    default:
      break;
  }

  /* eslint-disable indent */
  axisG.transition(derivedConfig.transition)
      .call(axis)
    .selectAll('g')
      .delay(derivedConfig.transitionDelay);
  /* eslint-enable indent */

  return axisG;
}

export function xAxis(
  config: BaseConfig,
  derivedConfig: DerivedConfig,
  container: Array<mixed>,
): Array<mixed> {
  if (config.xAxisShow) {
    let axis;

    if (config.xAxis) {
      axis = config.xAxis;
      axis.scale(derivedConfig.xScale);
    } else {
      axis = axisBottom(derivedConfig.xScale);
    }

    return drawAxis(config, derivedConfig, container, 'x-axis-g', axis);
  }

  return [];
}

export function yAxis(
  config: BaseConfig,
  derivedConfig: DerivedConfig,
  container: Array<mixed>,
): Array<mixed> {
  if (config.yAxisShow) {
    let axis;

    if (config.yAxis) {
      axis = config.yAxis;
      axis.scale(derivedConfig.yScale);
    } else {
      axis = axisLeft(derivedConfig.yScale);
    }

    return drawAxis(config, derivedConfig, container, 'y-axis-g', axis);
  }

  return [];
}
