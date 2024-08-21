import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: './lib/index.cjs',
      format: 'cjs',
      sourcemap: false,
      name: 'react-route-cache',
    },
    {
      file: './es/index.js',
      format: 'esm',
      sourcemap: false,
    },
  ],
  context: 'window',
  onwarn(warning, warn) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
      return;
    }
    warn(warning);
  },
  plugins: [nodeResolve(), commonjs(), typescript(), postcss(), terser()],
  external: ['react', 'react-dom', 'react-router-dom'],
};
