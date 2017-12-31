import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'

import { version } from './package.json'

const banner = (
`/*!
 * Fibrio v${version}
 * Chen Yijun (@ethantw) | MIT License
 * https://github.com/ethantw/fibrio
 *
 * Original algorithms from:
 * https://github.com/padolsey/findAndReplaceDOMText
 */\n
`)

export default {
  input: 'src/index.js',

  output: {
    file: 'dist/fibrio.js',
    format: 'umd',
    name: 'Fibrio',
    sourcemap: true,
    banner,
  },

  plugins: [
    resolve(),
    json(),
    babel({ exclude: 'node_modules/**' }),
  ],

  external: [
    'cheerio',
    'normalize-selector',
    'split-css-selector',
    'lodash',
  ],

  watch: {
    exclude: 'node_modules/**',
    clearScreen: false,
  }
}
