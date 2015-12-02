
import escapeReg from './fn/escapeReg'
import root      from './fn/root'
import { prop }  from './fn/manipulate'
import setAct    from './fn/setAct'
import revertTo  from './fn/revertTo'

// NPM modules:
const $ = IMPORT( 'cheerio' )

class Finder {
  /**
   * Create a new finder with an HTML context.
   * @constructor
   *
   * @param {String} HTML string
   * @param {Boolean} [noPreset=false]
   * @return {Fibrio} The instance itself
   */
  constructor( html, noPreset=false ) {
    this.ohtml   = html
    this.context = root( html )
    this.phase   = []

    if ( noPreset === true ) {
      this.avoid = new Set()
      this.bdry  = new Set()
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
    node = $( node )

    if (
      typeof node === 'object' &&
      node.is &&
      typeof node.is === 'function'
    ) {
      return node.is( selector )
    }
    return false
  }

  get text() {
    if ( typeof this.root === 'undefined' ) {
      return this.aggregate()
    }

    let i   = this.context.length
    let ret = []

    while ( i-- ) {
      ret.unshift( this.aggregate( this.context[ i ] ))
    }
    return ret
  }

  get match() {
    if ( typeof this.root === 'undefined' ) {
      return this.grep()
    }

    let i   = this.text.length
    let ret = []

    while ( i-- ) {
      ret.unshift( this.grep( this.text[ i ] ))
    }
    return ret
  }

  get html() {
    return ( this.root || this.context ).html()
      .replace( /<\/?fibrio\-text>/gi, '' )
  }

  qsa( selector ) {
    if ( !this.root ) {
      this.root = this.context
    }
    this.context = this.context.find( selector )
    return this
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
    const avoid = this.avoid || new Set()
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
    const bdry = this.bdry || new Set()
    if ( bdry.has( '*' ))                  return true
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
    if ( !this.hasOwnProperty( 'avoid' )) {
      this.avoid = new Set( Finder.ELMT.NON_TEXT )
    }

    this.avoid::setAct( 'add', selector )
    return this
  }

  /**
   * Remove the avoiding CSS selectors
   *
   * @param {String|Array|null}
   *   CSS selectors
   *   Or, if left blank, the method clears the entire
   *   avoiding selector set.
   */
  removeAvoid( selector ) {
    if ( !this.hasOwnProperty( 'avoid' )) {
      this.avoid = new Set( Finder.ELMT.NON_TEXT )
    }

    if ( typeof selector === 'undefined' ) {
      this.bdry.clear()
      return this
    }

    this.avoid::setAct( 'delete', selector )
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
    if ( !this.hasOwnProperty( 'bdry' )) {
      this.bdry = new Set( Finder.ELMT.BDRY )
    }

    this.bdry::setAct( 'add', selector )
    return this
  }

  /**
   * Remove the boundary CSS selectors
   *
   * @param {String|Array|null}
   *   CSS selectors
   *   Or, if left blank, the method clears the entire
   *   boundary selector set.
   */
  removeBdry( selector ) {
    if ( !this.hasOwnProperty( 'bdry' )) {
      this.bdry = new Set( Finder.ELMT.BDRY )
    }

    if ( typeof selector === 'undefined' ) {
      this.bdry.clear()
      return this
    }

    this.bdry::setAct( 'delete', selector )
    return this
  }

  /**
   * Set actions to the instance without the actual
   * procedure for future processing.
   *
   * @param {Object} Actions
   * @return {Fibrio} The instance
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
   * @return {Fibrio}
   *   The instance
   */
  replace( ...arg ) {
    this.replacement = arg.pop()
    this.wrapper     = null
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
   * @return {Fibrio}
   *   The instance
   */
  wrap( ...arg ) {
    this.wrapper     = arg.pop()
    this.replacement = null
    this.newActionProcessed = false

    if ( arg[0] )  this.find( arg[0] )
    return this.process()
  }

  /**
   * Process (replace/wrap) the matched text.
   *
   * @return {Fibrio} The instance
   */
  process() {
    if ( this.newActionProcessed === true )  return this

    {
      const cloned = typeof this.root !== 'undefined'
        ? this.root.clone()
        : null
      let phase = {
        html: this.html,
        root: cloned,
        context: cloned
          ? cloned.find( this.context )
          : null,
      }
      this.phase.push( phase )
    }

    if ( typeof this.root === 'undefined' ) {
      this.processMatch()
    } else {
      let i = this.context.length

      while ( i-- ) {
        const context = this.context.eq( i )
        const match   = this.match[ i ]
        this.processMatch({ context, match })
      }
    }
    this.newActionProcessed = true
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

  revert( level=1 ) {
    level = typeof level === 'string' && level === 'all'
    ? 'all'
    : Number.parseInt( level, 10 )

    if ( level === 1 ) {
      this::revertTo( this.phase.pop() )
      return this
    }

    let length  = this.phase.length
    let all = (
      level === 'all' ||
      level >= length ||
      Number.isNaN( level )
    ) ? true : false

    if ( all ) {
      this::revertTo( this.phase[0] )
      this.phase = []
      return this
    }

    let which = this.phase.splice( length - level, length )[0]
    this::revertTo( which )
    return this
  }
}

Finder.version = '@VERSION'
Finder.fn      = Finder.prototype

Finder.fn.filter = Finder.fn.query = Finder.fn.$ = Finder.fn.qsa

export default Finder

