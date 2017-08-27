// @flow

import type {
  BaseConfig,
  DerivedConfig,
} from '../dataTypes';

export default function (
  config: BaseConfig,
  derivedConfig: DerivedConfig,
  container: Array<mixed>,
): Array<mixed> {
  const width = derivedConfig.width;
  const height = derivedConfig.height;
  const margin = config.margin;

  // $FlowNoD3
  let svg = container.select('svg');

  if (svg.empty()) {
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    /* eslint-disable indent */
    // $FlowNoD3
    svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    /* eslint-enable indent */
  }

  if (config.xLinearGradient) {
    // TODO, work in progress
    // inspired from: http://bl.ocks.org/nbremer/b1fbcc0ff00abe8893a087d85fc8005b
    /* eslint-disable indent */
    // const linearGradient = svg
    //   .append('defs')
    //   .append('linearGradient')
    //     .attr('gradientUnits', 'userSpaceOnUse')
    //     .attr('x1', 0)
    //     .attr('y1', 0)
    //     .attr('x2', derivedConfig.width)
    //     .attr('y2', 0)
    //     .attr('id', 'x-linear-gradient');
    //
    // linearGradient.append('stop')
    //     .attr('class', 'left').attr('offset', '40%').attr('stop-color', '#D6D6D6');
    // linearGradient.append('stop')
    //     .attr('class', 'left').attr('offset', '40%').attr('stop-color', '#BD2E86');
    // linearGradient.append('stop')
    //     .attr('class', 'right').attr('offset', '60%').attr('stop-color', '#BD2E86');
    // linearGradient.append('stop')
    //     .attr('class', 'right').attr('offset', '60%').attr('stop-color', '#D6D6D6');
    /* eslint-enable indent */
  }

  return svg;
}
