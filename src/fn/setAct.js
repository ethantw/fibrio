
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
export default function ( action, selector ) {
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

