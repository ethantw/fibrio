
import Finder from './core'

// HTML5 elements categorised by function:
// http://www.w3.org/TR/html-markup/elements-by-function.html

const NON_TEXT = [
  // Outside `<body>`:
  'head', 'title',
  // Line-breaks and rules:
  'br', 'hr',
  // Embeded content (media) and scripting:
  'script', 'style', 'img', 'video', 'audio', 'canvas', 'svg', 'map', 'object',
  // Forms:
  'input', 'textarea', 'select', 'option', 'optgroup', 'button',
]

const BDRY = [
  // Grouping content and sections:
  'body',
  'address', 'article', 'aside', 'blockquote', 'dd', 'div',
  'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'noscript', 'ol',
  'output', 'p', 'pre', 'section', 'ul',
  // Other misc. elements:
  'br', 'li', 'summary', 'dt', 'details', 'rp', 'rt', 'rtc',
  // Embeded content (media) and scripting:
  'script', 'style', 'img', 'video', 'audio', 'canvas', 'svg', 'map', 'object',
  // Forms:
  'input', 'textarea', 'select', 'option', 'optgroup', 'button',
  // Tables:
  'table', 'tbody', 'thead', 'th', 'tr', 'td', 'caption', 'col', 'tfoot', 'colgroup',
]

let preset = { HTML5: {
  NON_TEXT,
  BDRY,
}}

Object.assign( Finder, { preset })

export default preset
