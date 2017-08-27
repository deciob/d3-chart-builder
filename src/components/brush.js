// @flow

import {
  brushX,
  brushY,
} from 'd3-brush';

import {
  event,
  select,
} from 'd3-selection';

import helpers from '../helpers';

import {
  actionHandlers,
} from '../state';

import type {
  BaseConfig,
  DerivedConfig,
  Store,
} from '../dataTypes';


export default function (
  config: BaseConfig,
  derivedConfig: DerivedConfig,
  store: Store,
  container: Array<mixed>,
): Array<mixed> {
  const width = derivedConfig.width;
  const height = derivedConfig.height;

  // $FlowNoD3
  let brushG = container.select('.brush-g');

  if (brushG.empty()) {
    // $FlowNoD3
    brushG = container.append('g').attr('class', 'brush-g');
  }

  function brushended() {
    const scale = config.layout === 'horizontal' ?
      derivedConfig.yScale : derivedConfig.xScale;

    if (!event.sourceEvent) return; // Only transition after input.
    if (!event.selection) {
      store.dispatch(actionHandlers.updateBrushExtent(event.selection));
      if (config.layout === 'horizontal') {
        store.dispatch(actionHandlers.updateYDomain(derivedConfig.yDomain));
      } else {
        store.dispatch(actionHandlers.updateXDomain(derivedConfig.xDomain));
      }
      return;
    } // Ignore empty selections.

    const newDomainExtent: {newDomain: [number, number], newExtent: [number, number]} =
      helpers.snapBrushToBandScale(event.selection, scale);

    store.dispatch(actionHandlers.updateBrushExtent(newDomainExtent.newExtent));
    if (config.layout === 'horizontal') {
      store.dispatch(actionHandlers.updateYDomain(newDomainExtent.newDomain));
    } else {
      store.dispatch(actionHandlers.updateXDomain(newDomainExtent.newDomain));
    }

    select(this).transition().call(event.target.move, newDomainExtent.newExtent);
  }

  if (config.layout === 'horizontal') {
    brushG.call(
      brushY()
        .extent([[0, 0], [width, height]])
        .on('end', brushended),
    );
  } else {
    brushG.call(
      brushX()
        .extent([[0, 0], [width, height]])
        .on('end', brushended),
    );
  }

  return brushG;
}
