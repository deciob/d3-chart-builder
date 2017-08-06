import {
  select,
} from 'd3-selection';

import jsdom from 'jsdom';

import barChart from '../../src/charts/bar';


test('an horizontal bar chart', () => {
  const { JSDOM } = jsdom;
  const data = [
    { x: 'a', y: -10 },
    { x: 'b', y: 20 },
    { x: 'c', y: 30 },
    { x: 'd', y: 40 },
  ];
  const chart = barChart();
  chart
    .width(800)
    .height(600)
    .transitionDuration(0)
    .transitionStepSeed(0)
    .layout('horizontal')
    .xAccessor(d => d.y)
    .yAccessor(d => d.x)
    .margin({ top: 0, left: 20, right: 10, bottom: 20 });

  const dom = new JSDOM(
    '<div></div>',
  );
  const document = dom.window.document;
  const selection = document.querySelector('div');
  const chartContainer = select(selection);

  const outerHtmlPromise = new Promise((resolve) => {
    chartContainer.datum(data).call(chart);
    setTimeout(() => {
      resolve(dom.window.document.documentElement.outerHTML);
    }, 250);
  });

  return outerHtmlPromise.then(outerHtml => expect(outerHtml).toMatchSnapshot());
});
