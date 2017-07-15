// @flow

import {
  axisBottom,
  axisLeft,
} from 'd3-axis';


function drawAxis(
  config: {[key: string]: any},
  state: {[key: string]: any},
  container: Array<mixed>,
  cssClass: string,
  axis: (Array<mixed>) => mixed,
): Array<mixed> {
  // $FlowNoD3
  let axisG = container.select(`.${cssClass}`);

  if (axisG.empty()) {
    // $FlowNoD3
    axisG = container.append('g');
    switch (cssClass) {
      case 'x-axis-g':
        axisG.attr('transform', `translate(0, ${config.height})`).attr('class', cssClass);
        break;
      case 'y-axis-g':
        axisG.attr('class', cssClass);
        break;
      default:
        break;
    }
  }

  /* eslint-disable indent */
  axisG.transition(state.transition)
      .call(axis)
    .selectAll('g')
      .delay(state.transitionDelay);
  /* eslint-enable indent */

  return axisG;
}

export function xAxis(
  config: {[key: string]: any},
  state: {[key: string]: any},
  container: Array<mixed>,
): Array<mixed> {
  if (config.xAxisShow) {
    let axis;

    if (config.xAxis) {
      axis = config.xAxis;
    } else {
      axis = axisBottom(state.xScale);
    }

    return drawAxis(config, state, container, 'x-axis-g', axis);
  }

  return [];
}

export function yAxis(
  config: {[key: string]: any},
  state: {[key: string]: any},
  container: Array<mixed>,
): Array<mixed> {
  if (config.yAxisShow) {
    let axis;

    if (config.yAxis) {
      axis = config.yAxis;
    } else {
      axis = axisLeft(state.yScale);
    }

    return drawAxis(config, state, container, 'y-axis-g', axis);
  }

  return [];
}
