// @flow

import {
  select
} from 'd3-selection';

export default function(
  config: {[key: string]: any},
  container: Array<mixed>
): Array<mixed> {
  const width = config.width;
  const height = config.height;
  const margin = config.margin;

  // $FlowNoD3
  let svg = container.select('svg');

  if (svg.empty()) {
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    // $FlowNoD3
    svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
  }

  return svg;
};
