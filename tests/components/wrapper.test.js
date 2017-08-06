import {
  select,
} from 'd3-selection';

import jsdom from 'jsdom';

import wrapper from '../../src/components/wrapper';


test('the svg wrapper component', () => {
  const { JSDOM } = jsdom;
  const state = {
    height: 100,
    width: 100,
  };
  const config = {
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
  };
  const dom = new JSDOM(
    '<div></div>',
  );
  const document = dom.window.document;
  const selection = document.querySelector('div');
  const d3Selection = select(selection);

  wrapper(config, state, d3Selection);

  const outerHtml = dom.window.document.documentElement.outerHTML;
  expect(outerHtml).toMatchSnapshot();
});
