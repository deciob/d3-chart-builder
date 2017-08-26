// @flow

import {
  brushX,
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
  let brushG = container.select('brush-g');

  if (brushG.empty()) {
    // $FlowNoD3
    brushG = container.append('g').attr('class', 'brush-g');
  }

  function brushended() {
    if (!event.sourceEvent) return; // Only transition after input.
    if (!event.selection) {
      store.dispatch(actionHandlers.updateBrushExtent(event.selection));
      store.dispatch(actionHandlers.updateXDomain(derivedConfig.xDomain));
      return;
    } // Ignore empty selections.

    const newDomainExtent: {newDomain: [number, number], newExtent: [number, number]} =
      helpers.snapBrushToXBandScale(event.selection, derivedConfig.xScale);

    store.dispatch(actionHandlers.updateBrushExtent(newDomainExtent.newExtent));
    store.dispatch(actionHandlers.updateXDomain(newDomainExtent.newDomain));

    select(this).transition().call(event.target.move, newDomainExtent.newExtent);
  }

  brushG.call(
    brushX()
      .extent([[0, 0], [width, height]])
      .on('end', brushended),
  );

  return brushG;
}
