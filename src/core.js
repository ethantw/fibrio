
import escapeReg from './fn/escapeReg'
import root      from './fn/root'
import { prop }  from './fn/manipulate'
import setAct    from './fn/setAct'
import revertTo  from './fn/revertTo'

// NPM modules:
const $ = IMPORT( 'cheerio' )

class Finder {
  /**
   * @constructor
   * Create a new Finder instance with an HTML
   * string to be processed.
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
   * Check if an element matches with the configured
   * selector(s).
   *
   * @param {CheerioDOMObject|HTMLString}
   *   The element to be checked with.
   * @param {String}
   *   The CSS selector(s) to test.
   */
  static matches( elmt, selector ) {
    elmt = $( elmt )

    if (
      typeof elmt === 'object' &&
      elmt.is &&
      typeof elmt.is === 'function'
    ) {
      return elmt.is( selector )
    }
    return false
  }

  /**
   * Return an array of the text aggregation
   * of the root element.
   *
   */
  get text() {
    if ( !this.root ) {
      return this.aggregate()
    }

    let i   = this.context.length
    let ret = []

    while ( i-- ) {
      ret.unshift( this.aggregate( this.context[ i ] ))
    }
    return ret
  }

  /**
   * Return an array of the matched text with their
   * metadata.
   *
   */
  get match() {
    if ( !this.root ) {
      return this.grep()
    }

    let i    = this.context.length
    let ret  = []

    while ( i-- ) {
      ret.unshift(
        this.grep(this.aggregate( this.context[ i ] ))
      )
    }
    return ret
  }

  /**
   * Return a string of the current HTML of the
   * root element.
   *
   */
  get html() {
    return ( this.root || this.context ).html()
      .replace( /<\/?fibrio\-text>/gi, '' )
  }

  /**
   * Get the descendants of the root element or
   * current set of matched elements—filtered by
   * CSS selector(s)—which are the effected context
   * for the next text-processing action.
   *
   * @param {String}
   *   CSS selector(s) to filter descendants.
   *
   */
  qsa( selector ) {
    if ( !this.root ) {
      this.root = this.context
    }
    this.context = this.context.find( selector )
    return this
  }

  /**
   * End all filtering operations and use the root
   * element as the effected context for the next
   * text-processing action.
   */
  end() {
    if ( this.root ) {
      this.context = this.root
      this.root    = null
    }
    return this
  }

  /**
   * Indicate whether to re-use the existing portions
   * while replacing a match with text or to place the
   * the entire replacement in the first found match
   * portion’s node.
   *
   * @param {String} [mode='retain']
   *   Either 'retain' or 'first'.
   */
  mode( mode ) {
    this.portionMode = /^first$/i.test( mode )
    ? 'first'
    : 'retain'
    return this
  }

  /**
   * The default function to be invoked during DOM
   * traversing. Once the function returns *false*,
   * the content of that element will be ignored.
   *
   * @param {CheerioDOMObject}
   * @return {Boolean}
   *   True if the node matches with CSS selectors in
   *   `this.avoid` set.
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
   * The default function to be invoked during DOM
   * traversing. Once the function returns *true*,
   * Finder will start a new context with the current
   * element; otherwise, the previous text aggregation
   * continues.
   *
   * @param {CheerioDOMObject}
   * @return {Boolean}
   *   True if the node matches with CSS selectors in
   *   `this.bdry` set.
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
   * Add CSS selector(s) to the avoiding set that,
   * when matched with certain elements during
   * text-processing, the content of these elements
   * will be ignored and remain the same.
   *
   * @param {String|Array} CSS selector(s)
   */
  addAvoid( selector ) {
    if ( !this.hasOwnProperty( 'avoid' )) {
      this.avoid = new Set( this.avoid )
    }

    this.avoid::setAct( 'add', selector )
    return this
  }

  /**
   * Remove certain avoiding CSS selector(s) or
   * clear the entire avoiding CSS selector set.
   *
   * @param {String|Array|null}
   *   CSS selector(s)
   *   Or, if left blank, the method clears the entire
   *   avoiding selector set.
   */
  removeAvoid( selector ) {
    if ( !this.hasOwnProperty( 'avoid' )) {
      this.avoid = new Set( this.avoid )
    }

    if ( typeof selector === 'undefined' ) {
      this.bdry.clear()
      return this
    }

    this.avoid::setAct( 'delete', selector )
    return this
  }

  /**
   * Add CSS selector(s) to the boundary set that,
   * when matched with certain elements during
   * text-processing, the content of these elements
   * will form a new self-contained context that are
   * not an aggregating entity with its previous
   * sibling(s).
   *
   * @param {String|Array|null} CSS selector(s)
   */
  addBdry( selector ) {
    if ( !this.hasOwnProperty( 'bdry' )) {
      this.bdry = new Set( this.bdry )
    }

    this.bdry::setAct( 'add', selector )
    return this
  }

  /**
   * Remove certain boundary CSS selector(s) or
   * clear the entire boundary CSS selector set.
   *
   * @param {String|Array|null}
   *   CSS selector(s)
   *   Or, if left blank, the method clears the entire
   *   boundary selector set.
   */
  removeBdry( selector ) {
    if ( !this.hasOwnProperty( 'bdry' )) {
      this.bdry = new Set( this.bdry )
    }

    if ( typeof selector === 'undefined' ) {
      this.bdry.clear()
      return this
    }

    this.bdry::setAct( 'delete', selector )
    return this
  }

  /**
   * Set up the searching text pattern (regular expression),
   * portion mode, text replacement and/or wrapper at once
   * that will be later processed.
   *
   * @param {Object} Actions
   * @return {Fibrio} The instance
   */
  action( action ) {
    if ( typeof action !== 'object' )  return this
    if ( action.mode )  this.mode( action.mode )
    if ( action.find )  this.find( action.find )

    this.wrapper     = action.wrap    || null
    this.replacement = action.replace || null
    this.newActionProcessed = false
    return this
  }

  /**
   * Set up the searching text pattern for text-processing.
   *
   * @param {String|RegExp}
   * @param {Boolean} [returnMatch=false]
   * @return {Fibrio|Array}
   *   The instance or the matches (array) depends on
   *   the second @param, `returnMatch`
   */
  find( regex, returnMatch=false ) {
    this.pattern = regex
    return returnMatch === true ? this.match : this
  }

  /**
   * Replace the matched text with a configured replacement.
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
   * Wrap each matched text with a clone of
   * the configured stencil element.
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
   * Process the previously defined text-processing
   * (replacing/wrapping) actions in the instance.
   *
   * @return {Fibrio} The instance
   */
  process() {
    if ( this.newActionProcessed === true )  return this

    {
      const cloned = this.root
        ? this.root.clone()
        : null
      this.phase.push({
        html:    this.html,
        root:    cloned,
        context: cloned
          ? cloned.find( this.context )
          : null,
      })
    }

    if ( !this.root ) {
      this.processMatch()
    } else {
      const context = this.context
      let i = context.length

      while ( i-- ) {
        this.processMatch({
          context: context.eq( i ),
          match:   this.grep(this.aggregate( context[ i ] )),
        })
      }
    }
    this.newActionProcessed = true
    return this
  }

  /**
   * Process the previously defined text-processing
   * (replacing/wrapping) actions in the instance
   * and return the rendered HTML.
   *
   * @return {string}
   *   The processed HTML of the context
   */
  render() {
    this.process()
    return this.html
  }

  /**
   * Revert to the original state or a certain
   * text-processing phase of the instance.
   *
   * @param {Number|String} [level=1]
   *   The level — a number or a string of `all` —
   *   to be reverted.
   * @return {Fibrio}
   *   The instance.
   *
   */
  revert( level=1 ) {
    level = typeof level === 'string' && level === 'all'
    ? 'all'
    : Number.parseInt( level, 10 )

    if ( level === 1 ) {
      this::revertTo( this.phase.pop() )
      return this
    }

    let length  = this.phase.length

    // If we’re to revert back to the original state.
    if (
      level === 'all' ||
      level >= length ||
      Number.isNaN( level )
    ) {
      this::revertTo( this.phase[0] )
      this.phase = []
      return this
    }

    this::revertTo( this.phase.splice( length - level, length )[0] )
    return this
  }
}

Finder.version = '@VERSION'
Finder.fn      = Finder.prototype

Finder.fn.filter = Finder.fn.query = Finder.fn.$ = Finder.fn.qsa

export default Finder

