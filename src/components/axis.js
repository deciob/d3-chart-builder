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

  axisG.transition(state.transition)
      .call(axis)
    .selectAll('g')
      .delay(state.transitionDelay);

  return axisG;
}

export const xAxis = function (
  config: {[key: string]: any},
  state: {[key: string]: any},
  container: Array<mixed>
): Array<mixed> {
  const height = config.height;

  if (config.xAxisShow) {
    if (config.xAxis) {
      return drawAxis(config, state, container, 'x-axis-g', config.xAxis);
    } else {
      const axis = axisBottom(state.xScale);
      return drawAxis(config, state, container, 'x-axis-g', axis);
    }
  }

  return [];
};

export const yAxis = function (
  config: {[key: string]: any},
  state: {[key: string]: any},
  container: Array<mixed>,
): Array<mixed> {
  const height = config.height;

  if (config.yAxisShow) {
    if (config.yAxis) {
      return drawAxis(config, state, container, 'y-axis-g', config.yAxis);
    }
    const axis = axisLeft(state.yScale);
    return drawAxis(config, state, container, 'y-axis-g', axis);
  }

  return [];
};
