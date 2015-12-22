
import normalize from 'normalize-selector'
import split     from 'split-css-selector'

/**
 * Add or delete elements of a set using CSS selectors.
 *
 * @this {Set}
 *   The set to be manipulate.
 * @param {String}
 *   Action to apply on the set, either 'add' or 'delete'.
 * @param {String|Array}
 *   CSS selector to be added to or deleted from the set.
 */
export default function( action, selector ) {
  if ( !/^(add|delete)$/i.test( action )) {
    return this
  }

  action = action.toLowerCase()

  if ( typeof selector === 'string' ) {
    selector = split( selector )
  }
  if ( selector && Array.isArray( selector )) {
    selector.forEach( sel => this[ action ](normalize( sel )))
  }
  return this
}

