// @flow

import type {
  BarConfig,
  BaseConfig,
  State,
} from '../config';


// TODO data should be of type Array<{[key: string]: number | string}> or nested!
export default function (
  config: BaseConfig & BarConfig,
  state: State,
  container: Array<mixed>,
  data: any, // TODO data type
): Array<mixed> {
  const height = state.height;
  const xAccessor = config.xAccessor;
  const yAccessor = config.yAccessor;
  const xScale = state.xScale;
  const yScale = state.yScale;
  const transition = state.transition;
  const delay = state.transitionDelay;
  const zScale = state.zScale;

  // $FlowNoD3
  let barsG = container.select('.bars-g');

  if (barsG.empty()) {
    // $FlowNoD3
    barsG = container.append('g')
      .attr('class', 'bars-g');
  }

  /* eslint-disable indent */
  if (config.layout === 'horizontal') {
    const zeroLevel = xScale(0);
    // UPDATE
    const bars = barsG.selectAll('.bar').data(data, yAccessor);
    // EXIT
    bars.exit().remove();
    // ENTER
    bars.enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', zeroLevel)
        .attr('y', d => yScale(yAccessor(d)))
      // ENTER + UPDATE
      .merge(bars)
        .transition(transition)
        .attr('x', (d) => {
          const value = xAccessor(d);
          const scaledValue = xScale(value);
          if (value >= 0) {
            return zeroLevel;
          }
          return scaledValue;
        })
        .attr('width', (d) => {
          const value = xAccessor(d);
          const scaledValue = xScale(value);
          if (value >= 0) {
            return scaledValue - zeroLevel;
          }
          return scaledValue + zeroLevel;
        })
        .attr('y', d => yScale(yAccessor(d)))
        .attr('height', yScale.bandwidth())
        .delay(delay);
  } else if (config.layout === 'vertical') {
    const zeroLevel = yScale(0);
    // UPDATE
    const bars = barsG.selectAll('.bar').data(data, xAccessor);
    // EXIT
    bars.exit().remove();
    // ENTER
    bars.enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(xAccessor(d)))
        .attr('y', zeroLevel)
      // ENTER + UPDATE
      .merge(bars)
        .transition(transition)
        .attr('x', d => xScale(xAccessor(d)))
        .attr('width', xScale.bandwidth())
        .attr('y', (d) => {
          const value = yAccessor(d);
          const scaledValue = yScale(value);
          if (value >= 0) {
            return scaledValue;
          }
          return scaledValue - (height - zeroLevel);
        })
        .attr('height', (d) => {
          const value = yAccessor(d);
          const scaledValue = yScale(value);
          if (value >= 0) {
            return (height - scaledValue) - (height - zeroLevel);
          }
          return (height - scaledValue) + (height - zeroLevel);
          })
        .delay(delay);
  } else if (config.layout === 'verticalStacked') {
    const zeroLevel = yScale(0);
    // UPDATE
    // https://github.com/d3/d3-selection#selection_data
    // Joins the specified array of data with the selected elements,
    // returning a new selection that represents the update selection:
    // the elements successfully bound to data.
    // Also defines the enter and exit selections on the returned selection...
    const dataJoin = barsG.selectAll('.bars-g-nested').data(data);
    // EXIT
    dataJoin.exit().remove();
    // ENTER + UPDATE
    const nestedBarsG = dataJoin.enter()
      .append('g')
        .attr('class', 'bars-g-nested')
        .attr('fill', d => zScale && zScale(d.key))
      .merge(dataJoin);

    // UPDATE
    const bars = nestedBarsG.selectAll('rect').data(d => d);
    // EXIT
    bars.exit().remove();
    // ENTER + UPDATE
    bars.enter()
      .append('rect')
        .attr('x', d => xScale(xAccessor(d.data)))
        .attr('width', xScale.bandwidth)
        .attr('y', zeroLevel)
      .merge(bars)
        .transition(transition)
        .attr('x', d => xScale(xAccessor(d.data)))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]))
        .delay(delay);
  }
  /* eslint-enable indent */

  return container;
}
