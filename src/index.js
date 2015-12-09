
import Finder from './core'
import './elmt'
import './prop'
import './aggregate'
import './grep'
import './process'

let Fibrio = ( ...arg ) => new Finder( ...arg )

Object.assign( Fibrio, {
  ELMT:    Finder.ELMT,
  finder:  Finder,
  fn:      Finder.prototype,
  matches: Finder.matches,
})

Fibrio.fibrio = Fibrio.version = '@VERSION'

// ES6 module
export default Fibrio

// NPM (CommonJS) module
EXPORT_ONCE( Fibrio )

