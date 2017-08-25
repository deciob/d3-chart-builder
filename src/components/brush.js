// @flow

import {
  brushX,
} from 'd3-brush';

import {
  event,
  select,
} from 'd3-selection';

import helpers from '../helpers';

import type {
  BaseConfig,
  DerivedConfig,
} from '../dataTypes';


export default function (
  config: BaseConfig,
  derivedConfig: DerivedConfig,
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
    if (!event.selection) return; // Ignore empty selections.

    const newExtent = helpers
      .snapBrushToXBandScale(event.selection, derivedConfig.xScale);

    select(this).transition().call(event.target.move, newExtent);
  }

  brushG.call(
    brushX()
      .extent([[0, 0], [width, height]])
      .on('end', brushended),
  );

  return brushG;
}
