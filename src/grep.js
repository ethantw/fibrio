
import Finder from './core'

Object.assign( Finder.fn, {
  set replacee( regex ) {
    this.regex = typeof regex === 'string' ?
      new RegExp(escapeReg( regex ), 'g' )
    :
    regex
  },

  get replacee() {
    return this.regex
  },

  find( regex ) {
    this.replacee = regex
    return this
  },

  grep() {
    const aggr    = this.text
    const regex   = this.replacee
    const prepMat = this.prepMat

    let mat
    let matIdx = 0
    let offset = 0
    let match  = []

    void function matchAggr( aggr ) {
      for ( let i = 0, l = aggr.length; i < l; ++i ) {
        let text = aggr[ i ]

        if ( typeof text !== 'string' ) {
          // Deal with nested contexts
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

  prepMat( mat, matIdx, offset ) {
    if ( !mat[0] )  throw new Error( 'Fibre cannot handle zero-length matches' )

    mat.idx      = mat.index
    mat.endIdx   = offset + mat.idx + mat[0].length
    mat.startIdx = offset + mat.idx

    mat.idx = mat.index = matIdx
    return mat
  },
})

