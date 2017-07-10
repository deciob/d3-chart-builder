// @flow

export default function (
  config: {[key: string]: any},
  state: {[key: string]: any},
  container: Array<mixed>,
  data: Array<{[key: string]: number | string}>,
): Array<mixed> {
  const width = config.width;
  const height = config.height;
  const margin = config.margin;
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

  return container;
}
