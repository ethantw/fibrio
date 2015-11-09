
import Finder from './core'

Object.assign( Finder.fn, {
  version:  '@VERSION',
  preset:   'prose',
  mode:     'retain',
  context:  undefined,
  revert:   [],
  selector: {
    filter:   [],
    avoid:    [],
    boundary: [],
  },
})

