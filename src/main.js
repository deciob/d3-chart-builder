import {
  axisBottom,
  axisLeft,
} from 'd3-axis';

import {
  max,
  min,
} from 'd3-array';

import {
  select,
} from 'd3-selection';

import barChart from './charts/bar';
import helpers from './helpers';
import wrapper from './components/wrapper';

const d3 = {
  axisBottom,
  axisLeft,
  barChart,
  components: {},
  helpers,
  max,
  min,
  select,
};

d3.components.wrapper = wrapper;

export default d3;
