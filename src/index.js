
import Finder from './core'
import ELMT   from './elmt'
import './init'

const Fibre = ( ...arg ) => new Finder( ...arg )

Object.assign( Fibre, {
  ELMT,
  fn:      Finder.prototype,
  matches: Finder.matches,
})

Fibre.Fibre = Fibre.version = '@VERSION'
export default Fibre

