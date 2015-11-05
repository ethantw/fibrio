
import Finder from './core'

Object.assign( Finder.prototype, {
  version:  '@VERSION',
  preset:   'prose',
  mode:     'retain',
  context:  undefined,
  selector: {
    filter:   [],
    avoid:    [],
    boundary: [],
  },
})

