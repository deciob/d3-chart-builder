// @flow

import {
  hsl,
} from 'd3-color';

import {
  select,
} from 'd3-selection';

import { actions } from '../state';

import type {
  BarConfig,
  BaseConfig,
  DerivedConfig,
  State,
  Store,
} from '../dataTypes';


export function fillBar(
  brushShow: boolean,
  domain: ?mixed[],
  accessor: (any) => any,
  fill: ?string,
  d: mixed[],
): ?string {
  const isInDomain = !brushShow ||
    (domain && domain.find(x => x === accessor(d))) !== undefined;
  if (fill && isInDomain) {
    return fill;
  } else if (fill && !isInDomain) {
    const hslColor = hsl(fill);
    hslColor.s = 0.1;
    hslColor.opacity = 0.5;
    return hslColor.toString();
  }
  return undefined;
}

export function fillNestedBar(
  key: string,
  zScale: void | (any) => any,
  config: BaseConfig & BarConfig,
  newState: State,
  d: any,
): ?string {
  const isInDomain = !config.brushShow || (newState.xDomain &&
    newState.xDomain.find(x => x === config.xAccessor(d.data))) !== undefined;
  const fillColour = zScale && zScale(key);
  if (isInDomain) {
    return fillColour;
  } else if (!isInDomain) {
    const hslColor = hsl(fillColour);
    hslColor.s = 0.5;
    hslColor.opacity = 0.5;
    return hslColor.toString();
  }
  return undefined;
}


// TODO data should be of type Array<{[key: string]: number | string}> or nested!
export default function (
  config: BaseConfig & BarConfig,
  derivedConfig: DerivedConfig,
  store: Store,
  container: Array<mixed>,
  data: any, // TODO data type
): Array<mixed> {
  const height = derivedConfig.height;
  const xAccessor = config.xAccessor;
  const yAccessor = config.yAccessor;
  const xScale = derivedConfig.xScale;
  const yScale = derivedConfig.yScale;
  const transition = derivedConfig.transition;
  const delay = derivedConfig.transitionDelay;
  const zScale = derivedConfig.zScale;
  const state = store.getState();

  // $FlowNoD3
  let barsG = container.select('.bars-g');

  if (barsG.empty()) {
    // $FlowNoD3
    barsG = container.append('g')
      .attr('class', 'bars-g');
  }

  /* eslint-disable indent */
  if (config.layout === 'horizontal') {
    const bindedFillBar = fillBar.bind(
      undefined, config.brushShow, state.yDomain, config.yAccessor, config.fill,
    );
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
        .attr('fill', bindedFillBar)
        .delay(delay);
  } else if (config.layout === 'vertical') {
    const bindedFillBar = fillBar.bind(
      undefined, config.brushShow, state.xDomain, config.xAccessor, config.fill,
    );
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
        .attr('fill', bindedFillBar)
        .delay(delay);
  } else if (config.layout === 'verticalStacked') {
    // TODO
    // const bindedFillBar = fillBar.bind(
    //   undefined, config.brushShow, state.xDomain, config.xAccessor, config.fill
    // );
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
        .attr('class', 'bar')
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

  store.subscribe(
    `${actions.UPDATE_X_DOMAIN}.components.bar`,
    (newState) => {
      if (config.layout === 'vertical') {
        if (!config.fill) return;
        barsG
          .selectAll('.bar')
          .attr('fill', fillBar.bind(
            undefined, config.brushShow, newState.xDomain, config.xAccessor, config.fill,
          ));
      } else if (config.layout === 'verticalStacked') {
        barsG
          .selectAll('.bars-g-nested')
          .each((d, i, nodes) => {
            select(nodes[i]).selectAll('.bar')
              .attr(
                'fill',
                fillNestedBar.bind(undefined, d.key, zScale, config, newState),
              );
          });
      }
    },
  );

  store.subscribe(
    `${actions.UPDATE_Y_DOMAIN}.components.bar`,
    (newState) => {
      if (config.layout === 'horizontal') {
        if (!config.fill) return;
        barsG
          .selectAll('.bar')
          .attr('fill', fillBar.bind(
            undefined, config.brushShow, newState.yDomain, config.yAccessor, config.fill,
          ));
      }
    },
  );

  return container;
}
