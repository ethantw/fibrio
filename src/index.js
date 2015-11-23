
import Finder from './core'
import ELMT   from './elmt'
import './init'

let Fibrio = ( ...arg ) => new Finder( ...arg )

Object.assign( Fibrio, {
  ELMT,
  fn:      Finder.prototype,
  matches: Finder.matches,
})

Fibrio.Fibrio = Fibrio.version = '@VERSION'

// ES6 module
export default Fibrio

// NPM (CommonJS) module
EXPORT_ONCE( Fibrio )

