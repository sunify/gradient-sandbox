import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.js',
  output: {
    file: 'public/assets/index.js',
    name: 'gradi',
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonjs(),
    isProduction && terser(),
    !isProduction && serve('public'),
    svelte({
      css: function (css) {
        css.write('public/assets/index.css');
      },

      onwarn: (warning, handler) => {
        if (warning.code === 'a11y-distracting-elements') return;

        handler(warning);
      }
    })
  ]
}