
'use strict'

const fs    = require( 'fs' )
const jsdom = require( 'jsdom' )

const log   = console.log
const url   = url => `${process.cwd()}/example/${url}`
const start = Date.now()

fs.readFile(
  url( 'index.html' ),
  'utf-8',
  ( err, html ) => {
    if ( err )  throw err

    jsdom.env(
      html,
      [ url( 'findAndReplaceDOMText.js') ],
      ( _, win ) => {
        const finder  = win.findAndReplaceDOMText
        const root    = win.document.documentElement
        const body    = win.document.body
        const wrapper = win.document.createElement( 'u' )
        const control = root.outerHTML

        wrapper.classList.add( 'laughter' )

        let revertee = []
        let div = body

        Array.from(body.querySelectorAll( 'body > div' ))
        .map( div => {
          revertee.push(
            finder( div, {
              find:    /lo+l/gi,
              wrap:    wrapper,
              replace: '($&)',
              preset:  'prose',
            }),
            finder( div, {
              find:    /\b([\w]+(ing|ed))\b/gi,
              wrap:    'b',
              replace: '[$1[$2]]',
              preset:  'prose',
            }),
            finder( div, {
              find:    /foobar/gi,
              wrap:   'match',
              preset: 'prose',
            })
          )
          return div
        })

        const end = Date.now()
        log( root.outerHTML )

        console.time( 'Revert' )
        let i = revertee.length
        while( i-- ) {
          revertee[ i ].revert()
        }
        log( `\n\nTotal time using jsdom: ${end - start}ms` )
        console.timeEnd( 'Revert' )
        log( `Reversion went properly: ${ root.outerHTML === control }` )
      }
    )
  }
)

