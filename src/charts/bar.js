// @flow

import {
  select
} from 'd3-selection';

import {
  transition
} from 'd3-transition';

import {
  baseConfig,
  barConfig
} from '../config';

import bar from '../components/bar';
import helpers from '../helpers';
import wrapper from '../components/wrapper';



/**
 Example:
 const barChart = ntc.bar();
 const data = [[...]];
 const chartContainer = ntc.select('#chart');
 chartContainer.datum(data).call(barChart);
 */

export default function(): (Array<mixed>) => mixed  {
  const config = helpers.extend(baseConfig, barConfig);
  const t = transition().duration(config.transitionDuration);

  function exports(selection: Array<mixed>) {
    const wrapperComponent = wrapper(config, selection);
    // $FlowD3
    const data = selection.datum();

    const barComponent = bar(config, wrapperComponent, transition, data);
  }

  helpers.getset(exports, config);

  return exports;
};
