
import Finder from './core'

Object.assign( Finder.fn, {
  version:  '@VERSION',
  preset:   'prose',
  mode:     'retain',
  context:  undefined,
  phase:    [],
  selector: {
    avoid: new Set( Finder.ELMT.NON_TEXT ),
    bdry:  new Set( Finder.ELMT.BDRY ),
  },
})

