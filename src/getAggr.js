
import Finder from './core'

Object.assign( Finder.prototype, {
  /**
   * Get the text aggregate of a node w/o resorting to
   * `$node.text()`
   */
  getAggr( node=this.context ) {
    if ( node.type === 'text' )  return [ node.data ]
    if ( this.filterFn && !this.filterFn( node ))  return []

    let ret = [ '' ]
    let i    = 0
    let first = typeof node.children === 'function' ? node.children()[0] : node.children[0]

    if ( node = first ) do {
      if ( node.type === 'text' ) {
        ret[ i ] += node.data
        continue
      }

      let innerText = this.getAggr( node )

      if (
        this.boundaryFn &&
        node.type === 'tag' &&
        ( this.boundaryFn === true || this.boundaryFn( node ))
      ) {
        ret[ ++i ] = innerText
        ret[ ++i ] = ''
      } else {
        if (typeof innerText[0] === 'string' ) {
          ret[ i ] += innerText.shift()
        }
        if ( innerText.length > 0 ) {
          ret[ ++i ] = innerText
          ret[ ++i ] = ''
        }
      }
    } while ( node = node.next )
    return ret
  },
})

