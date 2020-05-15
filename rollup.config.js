import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.js',
  output: {
    file: 'public/bundle.js',
    name: 'gradi',
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonjs(),
    isProduction && terser(),
    svelte({
      css: function (css) {
        css.write('public/main.css');
      },

      onwarn: (warning, handler) => {
        if (warning.code === 'a11y-distracting-elements') return;

        handler(warning);
      }
    })
  ]
}