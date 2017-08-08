import {
  select,
} from 'd3-selection';

import jsdom from 'jsdom';

import bar from '../../src/components/bar';


let chartContainer;
let state;

beforeAll(() => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(
    '<div></div>',
  );
  const document = dom.window.document;
  const selection = document.querySelector('div');
  chartContainer = select(selection);
  state = {};
});

afterAll(() => {
  chartContainer.remove();
});

test('should render a bar chart with minimal requirements', () => {
  // let utils = _utils();
  // let config = utils.extend(baseConfig, barConfig);
  // let dataset = [[
  //   {x: 'a', y: 10}, {x: 'b', y: 20}, {x: 'c', y: 30}, {x: 'd', y: 40}
  // ]];
  // let barComponent = _barComponent(config);
  // fixture.datum(dataset).call(barComponent);
  //
  // expect(fixture.selectAll('.nc-chart-group')[0].length).toBe(1);
});
