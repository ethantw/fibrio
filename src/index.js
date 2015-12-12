
import Finder from './core'
import './elmt'
import './prop'
import './aggregate'
import './grep'
import './process'

let Fibrio = ( ...arg ) => new Finder( ...arg )

Object.assign( Fibrio, {
  preset:  Finder.preset,
  finder:  Finder,
  fn:      Finder.prototype,
  matches: Finder.matches,
})

Fibrio.fibrio = Fibrio.version = Fibrio.fn.fibrio = Fibrio.fn.version = '@VERSION'

// ES6 module:
export default Fibrio

