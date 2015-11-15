
import Finder from './core'

Object.assign( Finder.fn, {
  version:  '@VERSION',
  preset:   'prose',
  mode:     'retain',
  context:  undefined,
  phase:    [],
  selector: {
    filter:   [],
    avoid:    [],
    boundary: [],
  },
})

