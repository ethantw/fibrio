
import root from './root'

const $ = IMPORT( 'cheerio' )

export default function revertTo( phase ) {
  if ( !phase.context ) {
    this.context = root( phase.html )
    return
  }
  this.root    = phase.root
  this.context = phase.context
}

