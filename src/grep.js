
import Finder    from './core'
import escapeReg from './fn/escapeReg'

Object.assign( Finder.fn, {
  /**
   * Gre(p) using the text aggregation.
   *
   * @param {Array}
   *   Text aggragation.
   * @return {Array}
   *   The matches and their metadata.
   */
  grep( aggr=this.text ) {
    const prepMat = this.prepMat
    const regex   = typeof this.pattern === 'string'
    ? new RegExp(escapeReg( this.pattern ), 'g' )
    : this.pattern

    let mat
    let matIdx = 0
    let offset = 0
    let match  = []

    void function matchAggr( aggr ) {
      for ( let i = 0, l = aggr.length; i < l; ++i ) {
        let text = aggr[ i ]

        if ( typeof text !== 'string' ) {
          // Deal with nested contexts:
          matchAggr( text )
          continue
        }

        if ( regex.global ) {
          while ( mat = regex.exec( text )) {
            match.push(prepMat( mat, matIdx++, offset ))
          }
        } else {
          if ( mat = text.match( regex )) {
            match.push(prepMat( mat, 0, offset ))
          }
        }
        offset += text.length
      }
    }( aggr )

    return match
  },

  /**
   * Prepare metadata for single match array (returned
   * by `RegExp.fn.exec` or `String.fn.match`).
   *
   * @param {Array}  Match
   * @param {Number} Index of the match
   * @param {Number} Offset of the match
   *
   * @return {Array}
   *   The original match array with addtional metadata.
   */
  prepMat( mat, matIdx, offset ) {
    if ( !mat[0] )  throw new Error( 'Fibrio cannot handle zero-length matches.' )

    mat.idx      = mat.index
    mat.startIdx = offset + mat.idx
    mat.endIdx   = offset + mat.idx + mat[0].length

    mat.idx = mat.index = matIdx
    return mat
  },
})

