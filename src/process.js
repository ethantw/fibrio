
import Finder from './core'
import {
  prop, content, type, html,
  parent, first, prev, next,
  before, replaceWith,
  createText,
} from './fn/manipulate'

const $ = IMPORT( 'cheerio' )

Object.assign( Finder.fn, {
  /**
   * Process (wrap/replace) the matched text with the
   * instance’s previous set wrapper/replacement.
   *
   * @return {Fibrio} The instance
   */
  processMatch( item={
    match:   this.match,
    context: this.context,
  }) {
    let match   = item.match
    let context = item.context

    if ( match.length === 0 )  return this

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
            index:        portionIdx,
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
            index:     portionIdx,
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
            index:        portionIdx,
            idxInMat:     0,
            idxInNode:    mat.startIdx - atIdx,
            endIdxInNode: mat.endIdx - atIdx,
            text:         current.data.substring( mat.startIdx - atIdx, mat.endIdx - atIdx ),
          }
        }
        atIdx += current.data.length
      }

      doAvoidNode = (
        /^(tag|style|script)$/i.test( current::type()) &&
        this.filterFn &&
        !this.filterFn( current )
      )

      if ( startPortion && endPortion ) {
        let old = Object.assign( {}, current )

        // Method `replaceMat` returns the end portion node,
        // and then we continue the recursion from its next
        // node.
        atIdx -= ( endPortion.node.data.length - endPortion.endIdxInNode )

        current = this.replaceMat(
          context, mat, startPortion, innerPortion, endPortion
        )

        startPortion = null
        endPortion   = null
        innerPortion = []
        mat          = match.shift()
        portionIdx   = 0
        matIdx++

        // No more matches.
        if ( !mat )  break

        // We have to update `nodeStack` once the current
        // element is re-rendered from its parental side via
        // `$parent.html( newHTML )` method.
        if ( current.rerendered && !current::next()) {
          // The `rerenderedLevel` variable here is to
          // indicate how many level we have to go back.
          let rerenderedLevel = 1
          {
            let cloned = Array.from( nodeStack )

            cloned.shift() // Omit the root element
            cloned.pop()   // Omit current text node’s parent element

            while ( $.contains( cloned.pop(), old )) {
              rerenderedLevel++
            }
          }

          let len    = nodeStack.length
          let last   = context.find( current )
          let update = []

          for ( let i = 0, l = rerenderedLevel; i < l; i++ ) {
            last = last.parent()
            update.unshift( last )
          }

          nodeStack.splice( len - rerenderedLevel, len )
          nodeStack = nodeStack.concat( update )
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

      while ( true ) {
        // Move forward
        if ( current::next()) {
          current = current::next()
          break
        }
        // Move up (and move forward again)
        current = nodeStack.pop()

        // Done with the assigned context from the Finder
        if ( current === context )  break out
      }
    }
    return this
  },

  /**
   * Replace the matched text portion(s) with the configured
   * replacement (node/element) and return the endPortion
   * node for `processMatch` to iterate.
   *
   * @return {CheerioDOMObject}
   */
  replaceMat( context, mat, startPortion, innerPortion, endPortion ) {
    let matStartNode = startPortion.node
    let matEndNode   = endPortion.node

    let preceeding = ''
    let following  = ''
    let label      = [
      `{{fibrio-replacement: ${Date.now()}}}`,
      `{{fibrio-replacement: ${Date.now()}}}[[end]]`,
    ]

    if ( matStartNode === matEndNode ) {
      let matNode = matStartNode
      let data    = matNode.data
      let matElmt = context.find( matNode::parent() )

      if ( !matElmt[0] )  matElmt = context

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

      let matStartElmt = context.find( matStartNode::parent() )
      let matEndElmt   = context.find( matEndNode::parent() )
      let areNotEqual  = true

      if ( !matStartElmt[0] )  matStartElmt = context
      if ( !matEndElmt[0] )    matEndElmt   = context

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
      ).attr( 'data-fibrio-mat-elmt', 'last' )::html()

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
        .find( '[data-fibrio-mat-elmt="last"]' )
        .removeAttr( 'data-fibrio-mat-elmt' )[0]

      if ( !ret::next())  ret.rerendered = true
      return ret
    }
  },

  /**
   * Get the replacement node/element according to the
   * given portion.
   *
   * @return {CheerioDOMNode}
   */
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

    let elmt = typeof wrapper === 'string'
    ? /^<([\w\-]+)\s?.*>.*<\/\1>$/gi.test( wrapper )
      ? $( wrapper )
      : $( `<${wrapper}></${wrapper}>` )
    : wrapper

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

  /**
   * Prepare the replacement text according to the given
   * portion.
   *
   * @return {String}
   */
  prepReplacementString( string, portion, mat, matIdx ) {
    let mode = this.portionMode

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

