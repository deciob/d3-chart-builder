import {
  select,
} from 'd3-selection';

import barChart from './charts/bar';
import helpers from './helpers';
import wrapper from './components/wrapper';

const d3 = {
  barChart,
  components: {},
  helpers,
  select,
};

d3.components.wrapper = wrapper;

export default d3;
