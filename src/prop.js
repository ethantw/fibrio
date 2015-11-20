
import Finder from './core'

Object.assign( Finder.fn, {
  version:     '@VERSION',
  portionMode: 'retain',
  context:     undefined,

  avoid:       new Set( Finder.ELMT.NON_TEXT ),
  bdry:        new Set( Finder.ELMT.BDRY ),
})

