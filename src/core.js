
import escapeReg from './fn/escapeReg'
import { prop }  from './fn/manipulate'
import setAct    from './fn/setAct'

// NPM modules:
const $   = IMPORT( 'cheerio' )
const $fn = $.prototype

class Finder {
  /**
   * Create a new finder with an HTML context.
   * @constructor
   *
   * @param {String} HTML string
   * @param {Boolean} [noPreset=false]
   * @return {Fibre} The instance itself
   */
  constructor( html, noPreset=false ) {
    this.ohtml   = html
    this.context = $( `<fibre-root>${html}</fibre-root>` )

    if ( noPreset === true ) {
      this.selector.avoid.clear()
      this.selector.bdry.clear()
    }
  }

  /**
   * Check if a node matches with the configured
   * selectors.
   *
   * @param {Cheerio|CheerioDOMObject|HTMLString}
   *   The node to be checked with.
   * @param {String}
   *   The Selectors to be matched.
   */
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

  /**
   * Indicates whether to re-use the existing portions
   * while replacing a match with text or to place the
   * the entire replacement in the first found match
   * portion’s node.
   *
   * @param {String} [mode='retain']
   *   Either 'retain' or 'first'
   */
  mode( mode ) {
    this.portionMode = /^first$/i.test( mode )
    ? 'first'
    : 'retain'
    return this
  }

  /**
   * The default function to be called on every element
   * encountered by the finder. Once the function returns
   * false, the element will be avoided.
   *
   * @param {Cheerio|CheerioDOMObject}
   */
  filterFn( node ) {
    const avoid = this.selector.avoid || new Set()
    if ( avoid.has( node::prop( 'name' )))  return false

    const selector = Array.from( avoid )
      .filter( s => !/^[\w\-]+$/i.test( s ))
      .join( ',' )
    return !Finder.matches( node, selector )
  }

  /**
   * The default function to be called on every element
   * encountered by the finder. Once the function returns
   * true, the finder will start a new text aggregation
   * context; otherwise the previous text continues.
   *
   * @param {Cheerio|CheerioDOMObject}
   */
  bdryFn( node ) {
    const bdry = this.selector.bdry || new Set()
    if ( bdry.has( node::prop( 'name' )))  return true

    const selector = Array.from( bdry )
      .filter( s => !/^[\w\-]+$/i.test( s ))
      .join( ',' )
    return Finder.matches( node, selector )
  }

  /**
   * Add new CSS selectors that, when matched with an
   * element in text processing, the element will be
   * avoided by the finder.
   *
   * @param {String|Array} CSS selectors
   */
  addAvoid( selector ) {
    this.selector.avoid
      ::setAct( 'add', selector )
    return this
  }

  /**
   * Remove the configured CSS selectors in the instance
   * avoid.
   *
   * @param {String|Array|null}
   *   CSS selectors
   *   Or, if not set, clear the entire avoid set.
   */
  removeAvoid( selector ) {
    this.selector.avoid
      ::setAct( 'delete', selector )

    if ( typeof selector === 'undefined' ) {
      this.selector.bdry.clear()
    }
    return this
  }

  /**
   * Add new CSS selectors that, when matched with an
   * element in text aggregating, the element will
   * start a new text aggregation context.
   *
   * @param {String|Array|null} CSS selectors
   */
  addBdry( selector ) {
    this.selector.bdry
      ::setAct( 'add', selector )
    return this
  }

  /**
   * Remove the assigned boundary CSS selectors
   * from the instance.
   *
   * @param {String|Array|null}
   *   CSS selectors
   *   Or, if not set, clear the entire boundary set.
   */
  removeBdry( selector ) {
    this.selector.bdry
      ::setAct( 'delete', selector )

    if ( typeof selector === 'undefined' ) {
      this.selector.bdry.clear()
    }
    return this
  }

  /**
   * Set actions to the instance without the actual
   * procedure for future processing.
   *
   * @param {Object} Actions
   * @return {Fibre} The instance
   */
  action( action ) {
    if ( typeof action !== 'object' )  return this
    if ( action.mode )    this.mode( action.mode )
    if ( action.find )    this.find( action.find )

    this.wrapper     = action.wrap    || null
    this.replacement = action.replace || null
    this.newActionProcessed = false
    return this
  }

  /**
   * Replace the matched text with configured
   * replacements.
   *
   * @arg {RegExp|String} [find=this.find]
   *   A pattern for the Finder to grep
   * @arg {String|Function}
   *   What to replace each match with
   * @return {Fibre}
   *   The instance
   */
  replace( ...arg ) {
    this.replacement = arg.pop()
    this.newActionProcessed = false

    if ( arg[0] )  this.find( arg[0] )
    return this.process()
  }

  /**
   * Wrap the matched text with configured
   * element/node.
   *
   * @arg {RegExp|String} [find=this.find]
   *   A pattern for the Finder to grep
   * @arg {String|Function}
   *   What to wrap each match with
   * @return {Fibre}
   *   The instance
   */
  wrap( ...arg ) {
    this.wrapper = arg.pop()
    this.newActionProcessed = false

    if ( arg[0] )  this.find( arg[0] )
    return this.process()
  }

  /**
   * Process (replace/wrap) the matched text.
   *
   * @return {Fibre} The instance
   */
  process() {
    if ( this.newActionProcessed === false ) {
      this.newActionProcessed = true
      this.processMatch()
    }
    return this
  }

  /**
   * Process (replace/wrap) the matched text and
   * return the processed HTML.
   *
   * @return {string}
   *   The processed HTML of the context
   */
  render() {
    this.process()
    return this.html
  }
}

Finder.version = '@VERSION'
Finder.fn      = Finder.prototype

export default Finder

