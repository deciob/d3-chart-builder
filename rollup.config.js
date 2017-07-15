import babel from 'rollup-plugin-babel';
import flow from 'rollup-plugin-flow';
import nodeResolve from 'rollup-plugin-node-resolve';


export default {
  dest: 'dist/ntc.js',
  entry: 'src/main.js',
  format: 'umd',
  moduleName: 'ntc',
  plugins: [
    // order counts!
    // first remove flow annotatins, then babel!
    flow(),
    babel({
      babelrc: false,
      exclude: [
        'node_modules/**',
        'src/js/**/*.test.js',
      ],
      presets: [['es2015', { modules: false }]],
      plugins: [
        'external-helpers',
        'syntax-object-rest-spread',
        'transform-object-rest-spread',
      ],
    }),
    nodeResolve({
      // use 'jsnext:main' if possible
      // – see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true,
    }),
  ],
  sourceMap: 'inline',
};
