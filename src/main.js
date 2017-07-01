import {
  select
} from 'd3-selection';

import bar from './charts/bar';
import helpers from './helpers';
import wrapper from './components/wrapper';

const ntc = {
  bar,
  components: {},
  helpers,
  select,
};

ntc.components.wrapper = wrapper;

export default ntc;
