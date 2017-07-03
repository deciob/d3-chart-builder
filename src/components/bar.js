// @flow

import {
  select,
} from 'd3-selection';

import {
  scaleBand,
  scaleLinear,
} from 'd3-scale';

import helpers from '../helpers';

export default function(
  config: {[key: string]: any},
  container: Array<mixed>,
  transition: () => mixed,
  data: Array<{[key: string]: number | string},>
): Array<mixed> {
  const width = config.width;
  const height = config.height;
  const margin = config.margin;

  function xAccessor(d) {
    return d.x;
  }

  function yAccessor(d) {
    return d.y;
  }

  const xScale = scaleBand()
      .rangeRound([0, width], 0.1)
      .padding(0.1);

  const yScale = scaleLinear()
      .range([0, height])
      .domain([0, 40]);

  const max = helpers.nestedMax(data, yAccessor);

  console.log(max);


  //
  // // $FlowD3
  // let barsG = container.select('.bars-g');
  //
  // if (barsG.empty()) {
  //   // $FlowD3
  //   barsG = container.append('g')
  //     .attr('class', 'bars-g');
  // }
  //
  // const bars = barsG
  //   .selectAll('.bar')
  //   .data(data, yAccessor);
  // bars.exit()
  //   .remove();
  // bars.enter()
  //   .append('rect')
  //     .attr('class', 'bar')
  //     .attr('x', d => {
  //       console.log(xAccessor(d), xScale.bandwidth())
  //       return xScale.bandwidth()
  //     })
  //     .attr('y', d => yScale(yAccessor(d)))
  //     .attr('width', xScale.bandwidth())
  //     .attr('height', d => xScale(xAccessor(d)));
  //   // .merge(bars).transition(transition)
  //   //   .attr('x', d => xScale(xAccessor(d)))
  //   //   .attr('y', d => yScale(yAccessor(d)))
  //   //   .attr('width', xScale.bandwidth())
  //   //   .attr('height', d => xScale(xAccessor(d)))
  //   //   .delay(200);
  //
  // return container;
};
