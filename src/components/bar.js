// @flow

import type {
  BarConfig,
  BarLayouts,
  BaseConfig,
  D3GenericDataAccessor,
} from '../config';

// TODO data should be of type Array<{[key: string]: number | string}> or nested!
export default function (
  config: BaseConfig & BarConfig,
  state: {[key: string]: any},
  container: Array<mixed>,
  data: any,
): Array<mixed> {
  const height = config.height;
  const xAccessor = config.xAccessor;
  const yAccessor = config.yAccessor;
  // const zAccessor = config.zAccessor;
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
  if (config.barLayout === 'horizontal') {
    // Horizontal Bars
    // UPDATE
    const bars = barsG
        .selectAll('.bar')
        .data(data, yAccessor);
    // EXIT
    bars.exit()
        .remove();
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
  } else if (config.barLayout === 'verticalStacked') {
    // UPDATE
    const nestedBarsG = barsG
        .selectAll('.bars-g-nested')
        .data(data);
    // EXIT
    nestedBarsG.exit()
        .remove();
    nestedBarsG.enter()
      .append('g')
        .attr('class', 'bars-g-nested')
        .attr('fill', d => zScale(d.key));



    const bars = nestedBarsG
        .selectAll('.bar')
        .data(d => d);

    console.log(nestedBarsG, bars);

    // EXIT
    bars.exit()
        .remove();
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
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]))
        .delay(delay);

        // .attr('class', 'bars-g-nested')
        // .attr('x', 0)
        // .attr('width', xScale.bandwidth())
        // .attr('y', d => yScale(d[1]))
        // .attr('height', d => height - yScale(yAccessor(d)));
  } else if (config.barLayout === 'vertical') {
    // Vertical bars
    // UPDATE
    const bars = barsG
        .selectAll('.bar')
        .data(data, xAccessor);
    // EXIT
    bars.exit()
        .remove();
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
