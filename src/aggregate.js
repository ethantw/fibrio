
import Finder from './core'
import { type, first, next } from './fn/manipulate'

Object.assign( Finder.fn, {
  /**
   * Get the text aggregation of a node w/o being
   * normalized and resorting to `$node.text()`.
   *
   * @param {CheerioDOMObject}
   * @return {Array}
   *   An array of the text aggregation of the given node,
   *   divided by boundaries, w/o the content of the
   *   ignored elements.
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

