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

  // $FlowD3
  let svg = container.select('svg');

  if (svg.empty()) {
    // $FlowD3
    svg = container.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
  }

  return svg;
};
