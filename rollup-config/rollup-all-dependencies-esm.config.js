import rollupBase from './rollup-base';

export default Object.assign(rollupBase,
  {
    dest: 'dist/all-dependencies-esm/d3-chart-builder.js',
    format: 'es',
  },
);
