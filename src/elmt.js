
import Finder from './core'

const NON_PROSE_ELMT = new Set([
  'br', 'hr',
  // Media and Source elmtents
  'script', 'style', 'img', 'video', 'audio', 'canvas', 'svg', 'map', 'object',
  // Input elmtents
  'input', 'textarea', 'select', 'option', 'optgroup', 'button',
])

const NON_CONTIGUOUS_PROSE_ELMT = new Set([
  // Block elmtents
  'address', 'article', 'aside', 'blockquote', 'dd', 'div',
  'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'noscript', 'ol',
  'output', 'p', 'pre', 'section', 'ul',
  // Other misc. elmtents that are not part of continuous inline prose
  'br', 'li', 'summary', 'dt', 'details', 'rp', 'rt', 'rtc',
  // Media and Source elmtents
  'script', 'style', 'img', 'video', 'audio', 'canvas', 'svg', 'map', 'object',
  // Input elmtents
  'input', 'textarea', 'select', 'option', 'optgroup', 'button',
  // Table related elmtents
  'table', 'tbody', 'thead', 'th', 'tr', 'td', 'caption', 'col', 'tfoot', 'colgroup',
])

const NON_INLINE_PROSE = ( elmt ) => {
  return NON_CONTIGUOUS_PROSE_ELMT.has( elmt.tagName )
}

const PRESET = {
  prose: {
    forceContext: NON_INLINE_PROSE,
    elmtFilter: ( elmt ) => {
      return !NON_PROSE_ELMT.has( elmt.tagName )
    },
  },
}

const assignee = {
  NON_PROSE_ELMT,
  NON_CONTIGUOUS_PROSE_ELMT,
  NON_INLINE_PROSE,
  PRESET,
}

Object.assign( Finder, assignee )
export default assignee

