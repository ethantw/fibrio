
import root from './root'

export default function( phase ) {
  if ( !phase.context ) {
    this.context = root( phase.html )
    return
  }
  this.root    = phase.root
  this.context = phase.context
}

