
import Finder from './core'

Object.assign( Finder.fn, {
  portionMode: 'retain',
  context:     undefined,
  avoid:       new Set( Finder.preset.HTML5.NON_TEXT ),
  bdry:        new Set( Finder.preset.HTML5.BDRY ),
})

