
import Finder from './core'
import { type, first, next } from './fn/manipulate'

Object.assign( Finder.fn, {
  /**
   * Get the text aggregate of a node w/o resorting to
   * `$node.text()`
   *
   * @param {Cheerio}
   * @return {Array}
   *   The entire text aggregation of the instance’s
   *   context node w/o the avoided parts.
   */
  aggregate( node=this.context ) {
    // Found the text and return it.
    if ( node::type() === 'text' )  return [ node.data ]

    // Exclude unwanted elements.
    if ( this.filterFn && !this.filterFn( node ))  return []

    let ret = [ '' ]
    let i   = 0

    if ( node = node::first()) do {
      if ( node::type() === 'text' ) {
        ret[ i ] += node.data
        continue
      }

      let innerText = this.aggregate( node )

      if (
        /^(tag|script|style)$/i.test( node::type()) &&
        this.bdryFn && this.bdryFn( node )
      ) {
        ret[ ++i ] = innerText
        ret[ ++i ] = ''
      } else {
        if ( typeof innerText[0] === 'string' ) {
          ret[ i ] += innerText.shift()
        }
        if ( innerText.length > 0 ) {
          ret[ ++i ] = innerText
          ret[ ++i ] = ''
        }
      }
    } while ( node = node::next())
    return ret
  },
})

