import rollupBase from './rollup-base';

export default Object.assign({
  dest: 'dist/no-dependencies/d3-chart-builder.js',
  external: [
    'd3-array',
    'd3-axis',
    'd3-collection',
    'd3-selection',
    'd3-scale',
    'd3-shape',
    'd3-transition',
  ],
  globals: {
    'd3-array': 'd3',
    'd3-axis': 'd3',
    'd3-collection': 'd3',
    'd3-scale': 'd3',
    'd3-selection': 'd3',
    'd3-shape': 'd3',
    'd3-transition': 'd3',
  },
}, rollupBase);
