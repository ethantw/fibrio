
import Finder from './core'
import ELMT   from './elmt'
import './init'

let Fibre = ( ...arg ) => new Finder( ...arg )

Object.assign( Fibre, {
  ELMT,
  fn:      Finder.prototype,
  matches: Finder.matches,
})

Fibre.Fibre = Fibre.version = '@VERSION'

// ES6 module
export default Fibre
// NPM (CommonJS) module
EXPORT = Fibre

