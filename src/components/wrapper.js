// @flow

import type {
  BaseConfig,
  DerivedConfig,
} from '../config';

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

  return svg;
}
