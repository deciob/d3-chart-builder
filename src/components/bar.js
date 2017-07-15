// @flow

import type {
  BaseConfig,
} from '../config';

export default function (
  config: BaseConfig,
  state: {[key: string]: any},
  container: Array<mixed>,
  data: Array<{[key: string]: number | string}>,
): Array<mixed> {
  const height = config.height;
  const xAccessor = config.xAccessor;
  const yAccessor = config.yAccessor;
  const xScale = state.xScale;
  const yScale = state.yScale;
  const transition = state.transition;
  const delay = state.transitionDelay;

  // $FlowNoD3
  let barsG = container.select('.bars-g');

  if (barsG.empty()) {
    // $FlowNoD3
    barsG = container.append('g')
      .attr('class', 'bars-g');
  }

  /* eslint-disable indent */
  // UPDATE
  const bars = barsG
      .selectAll('.bar')
      .data(data, config.horizontal ? yAccessor : xAccessor);
  // EXIT
  bars.exit()
      .remove();


  if (config.horizontal) {
    // Horizontal Bars
    // ENTER
    bars.enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => yScale(yAccessor(d)))
      // ENTER + UPDATE
      .merge(bars)
        .transition(transition)
        .attr('width', d => xScale(xAccessor(d)))
        .attr('y', d => yScale(yAccessor(d)))
        .attr('height', yScale.bandwidth())
        .delay(delay);
  } else {
    // Vertical bars
    // ENTER
    bars.enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(xAccessor(d)))
        .attr('width', xScale.bandwidth())
        .attr('y', height)
      // ENTER + UPDATE
      .merge(bars)
        .transition(transition)
        .attr('x', d => xScale(xAccessor(d)))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(yAccessor(d)))
        .attr('height', d => height - yScale(yAccessor(d)))
        .delay(delay);
  }
  /* eslint-enable indent */

  return container;
}
