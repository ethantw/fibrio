
import escapeReg from './fn/escapeReg'
import { prop }  from './fn/manipulate'

// NPM modules:
const $   = IMPORT( 'cheerio' )
const $fn = $.prototype

function selectorAction( action, selector ) {
  if ( /^(add|delete)$/i.test( action )) {
    return this
  }

  if ( typeof selector === 'string' ) {
    selector = selector
      .replace( /\,\s*/, ',' )
      .split( ',' )
  }
  if ( Array.isArray( selector )) {
    selector.map( s => this[ action ]( s ))
  }
  return this
}

class Finder {
  constructor( html, noPreset ) {
    if ( noPreset === true ) {
      this.selector.avoid.clear()
      this.selector.bdry.clear()
    }

    this.ohtml   = html
    this.context = $( `<fibre-root>${html}</fibre-root>` )
  }

  static matches( node, selector ) {
    if ( typeof node === 'string' ) {
      node = $( node )
    }
    if ( typeof node === 'object' ) {
      return node::$fn.is( selector )
    }
    return false
  }

  get text() {
    return this.aggregate()
  }

  get match() {
    return this.grep()
  }

  get html() {
    return this.context.html()
      .replace( /<\/?fibre\-text>/gi, '' )
  }

  setMode( mode ) {
    this.mode = /first/i.test( mode )
    ? 'first'
    : 'retain'
  }

  filterFn( node ) {
    const avoid = this.selector.avoid || new Set()
    if ( avoid.has( node::prop( 'name' )))  return false

    const selector = Array.from( avoid )
      .filter( s => !/^[\w\-]+$/i.test( s ))
      .join( ',' )
    return !Finder.matches( node, selector )
  }

  bdryFn( node ) {
    const bdry = this.selector.bdry || new Set()
    if ( bdry.has( node::prop( 'name' )))  return true

    const selector = Array.from( bdry )
      .filter( s => !/^[\w\-]+$/i.test( s ))
      .join( ',' )
    return Finder.matches( node, selector )
  }

  addAvoid( selector ) {
    this.selector.avoid
      ::selectorAction( 'add', selector )
    return this
  }

  removeAvoid( selector ) {
    this.selector.avoid
      ::selectorAction( 'delete', selector )

    if ( typeof selector === 'undefined' ) {
      this.selector.bdry.clear()
    }
    return this
  }

  addBdry( selector ) {
    this.selector.bdry
      ::selectorAction( 'add', selector )
    return this
  }

  removeBdry( selector ) {
    this.selector.bdry
      ::selectorAction( 'delete', selector )

    if ( typeof selector === 'undefined' ) {
      this.selector.bdry.clear()
    }
    return this
  }
}

Finder.version = '@VERSION'
Finder.fn      = Finder.prototype

export default Finder

