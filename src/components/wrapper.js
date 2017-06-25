import {
  select
} from "d3-selection";

export default function(config) {
  const svgContainer = d3.select(this);
  const width = config.width;
  const heigh = config.height;
  const margin = confi.margin;

  let svg = svgContainer.select('svg');

  if (svg.empty()) {
    svg = svgContainer.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
  }

  return svg;
};
