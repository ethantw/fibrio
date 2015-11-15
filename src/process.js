
import Finder from './core'
import {
  prop, content, type, html,
  parent, first, prev, next,
  before, replaceWith,
  createText,
} from './fn/manipulate'

const $ = IMPORT( 'cheerio' )

Object.assign( Finder.fn, {
  processMatch() {
    let match   = this.match
    let context = this.context

    let startPortion
    let endPortion
    let innerPortion = []
    let current      = context
    let mat          = match.shift()
    let atIdx        = 0
    let matIdx       = 0
    let portionIdx   = 0
    let nodeStack    = [ context ]
    let doAvoidNode

    this.phase.push( context.html())

    out: while ( true ) {
      if ( current::type() === 'text' ) {
        // The match end
        if (
          !endPortion &&
          current.data.length + atIdx >= mat.endIdx
        ) {
          endPortion = {
            node:         current,
            idx:          portionIdx++,
            index:        portionIdx++,
            text:         current.data.substring( mat.startIdx - atIdx, mat.endIdx - atIdx ),
            idxInMat:     atIdx - mat.startIdx,
            endIdxInNode: mat.endIdx - atIdx,
            isEnd:        true,
            // always zero for end-portions
            idxInNode:    mat.startIdx - atIdx,
          }

        // Intersecting node
        } else if ( startPortion ) {
          innerPortion.push({
            node:      current,
            idx:       portionIdx++,
            index:     portionIdx++,
            text:      current.data,
            idxInMat:  atIdx - mat.startIdx,
            // always zero for inner-portions
            idxInNode: 0,
          })
        }

        // The match start
        if (
          !startPortion &&
          current.data.length + atIdx > mat.startIdx
        ) {
          startPortion = {
            node:         current,
            idx:          portionIdx++,
            index:        portionIdx++,
            idxInMat:     0,
            idxInNode:    mat.startIdx - atIdx,
            endIdxInNode: mat.endIdx - atIdx,
            text:         current.data.substring( mat.startIdx - atIdx, mat.endIdx - atIdx ),
          }
        }

        atIdx += current.data.length
      }

      doAvoidNode = (
        current::type() === 'tag' &&
        this.filterFn &&
        !this.filterFn( current )
      )

      if ( startPortion && endPortion ) {
        // Method `replaceMat` returns the end portion node,
        // and then we continue the recursion from its next
        // node.
        atIdx -= ( endPortion.node.data.length - endPortion.endIdxInNode )

        current = this.replaceMat(
          mat, startPortion, innerPortion, endPortion
        )

        startPortion = null
        endPortion   = null
        innerPortion = []
        mat          = match.shift()
        portionIdx   = 0
        matIdx++

        // No more matches.
        if ( !mat )  break

        // Whilst the element of the end portion has been
        // completely re-rendered and nowhere to be found.
        if ( current.rerendered && !current::next()) {
          nodeStack.pop()
          nodeStack.push(
            this.context.find( current::parent())
          )
        }

      // Move down
      } else if ( !doAvoidNode && current::first()) {
        nodeStack.push( current )
        current = current::first()
        continue
      // Move forward
      } else if ( !doAvoidNode && current::next()) {
        current = current::next()
        continue
      }

      // Move forward or move up
      while ( true ) {
        if ( current::next()) {
          current = current::next()
          break
        }

        current = nodeStack.pop()

        // Done with the Finder context
        if ( current === context )  break out
      }
    }
  },

  replaceMat( mat, startPortion, innerPortion, endPortion ) {
    let matStartNode = startPortion.node
    let matEndNode   = endPortion.node

    let preceeding = ''
    let following  = ''
    let label      = [
      `{{fibre-replacement: ${Date.now()}}}`,
      `{{fibre-replacement: ${Date.now()}}}[[end]]`,
    ]

    if ( matStartNode === matEndNode ) {
      let matNode = matStartNode
      let data    = matNode.data
      let matElmt = this.context.find( matNode::parent() )

      if ( !matElmt[0] )  matElmt = this.context

      let idx = matElmt[0].children.indexOf( matNode )
      let replacement

      // Grab the text before the match
      if ( startPortion.idxInNode > 0 ) {
        preceeding = data.substring( 0, startPortion.idxInNode )
      }

      // Get the replacement
      replacement = this.getPortionReplacementElmt(
        endPortion, mat
      )::html()

      // Grab the text after the match
      if ( endPortion.endIdxInNode < data.length ) {
        following = data.substring( endPortion.endIdxInNode )
      }

      matNode.data = label[0]

      matElmt.html(
        matElmt.html().replace(
          label[0],
          preceeding + replacement + following
        )
      )

      // Return the new node
      return matElmt.contents()[ preceeding ? idx+1 : idx ]
    } else {
      // matStartNode -> matInnerNode -> matEndNode

      let matStartElmt = this.context.find( matStartNode::parent() )
      let matEndElmt   = this.context.find( matEndNode::parent() )
      let areNotEqual  = true

      if ( !matStartElmt[0] )  matStartElmt = this.context
      if ( !matEndElmt[0] )    matEndElmt   = this.context

      preceeding = matStartNode.data.substring( 0, startPortion.idxInNode )
      following  = matEndNode.data.substring( endPortion.endIdxInNode )

      let first = this.getPortionReplacementElmt(
        startPortion, mat
      )::html()

      for ( let i = 0 , l = innerPortion.length; i < l; ++i ) {
        let portion = innerPortion[ i ]
        portion.node::replaceWith(
          this.getPortionReplacementElmt( portion, mat )
        )
      }

      let last = this.getPortionReplacementElmt(
        endPortion, mat
      ).attr( 'data-fibre-mat-elmt', 'last' )::html()

      matStartNode.data = label[0]
      matEndNode.data   = label[1]

      matStartElmt.html(
        matStartElmt.html()
        .replace( label[0], preceeding + first )
        .replace( label[1], () => {
          areNotEqual = false
          return last + following
        })
      )

      matEndElmt.html(
        ( matEndElmt.html() || '' )
        .replace( label[1], last + following )
      )

      let ret = ( areNotEqual ? matEndElmt : matStartElmt )
        .find( '[data-fibre-mat-elmt="last"]' )
        .removeAttr( 'data-fibre-mat-elmt' )[0]

      if ( !ret::next())  ret.rerendered = true
      return ret
    }
  },

  getPortionReplacementElmt( portion, mat, matIdx ) {
    let replacement = this.replacement || '$&'
    let wrapper     = this.wrapper

    if (
      wrapper &&
      wrapper::prop( 'type' ) &&
      wrapper::prop( 'type' ) !== 'text'
    ) {
      // Clone the element from its HTML
      wrapper = $( $.html( wrapper ))
    }

    if ( typeof replacement === 'function' ) {
      replacement = replacement( portion, mat, matIdx )

      if ( replacement && replacement::prop( 'type' )) {
        return replacement
      }

      return createText( replacement )
    }

    let elmt = typeof wrapper === 'string' ?
      $( `<${wrapper}></${wrapper}>` ) : wrapper

    replacement = createText(
      this.prepReplacementString(
        replacement, portion, mat, matIdx
      )
    )

    if ( !replacement::first()::prop( 'data' )) {
      return replacement
    }
    if ( !elmt ) {
      return replacement
    }

    elmt.append( replacement )
    return elmt
  },

  prepReplacementString( string, portion, mat, matIdx ) {
    let mode = this.mode

    if (
      mode === 'first' &&
      portion.idxInMat > 0
    ) {
      return ''
    }

    string = string.replace(
      /\$(\d+|&|`|')/g,
      ( $0, t ) => {
        let replacement

        switch ( t ) {
          case '&':
            replacement = mat[0]
            break
          case '`':
            replacement = mat.input.substring( 0, mat.startIdx )
            break
          case '\'':
            replacement = mat.input.substring( mat.endIdx )
            break
          default:
            replacement = mat[ +t ]
        }
        return replacement
      }
    )

    if ( mode === 'first' )  return string
    if ( portion.isEnd ) {
      return string.substring( portion.idxInMat )
    }
    return string.substring( portion.idxInMat, portion.idxInMat + portion.text.length )
  },
})

