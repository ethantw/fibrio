
'use strict'

const fs     = require( 'fs' )
const Fibrio = require( '..' )

const log   = console.log
const url   = url => `${process.cwd()}/example/${url}`
const start = Date.now()

console.time( 'Fibrio' )
fs.readFile(
  url( 'index.html' ),
  'utf-8',
  ( err, html ) => {
    let fib = Fibrio( html )

    fib
    .qsa( 'body > div' )
    .action({
      find:    /lo+l/gi,
      wrap:    'u',
      replace: '($&)',
    })
    .addBdry( '.ignore' )
    .process()

    const control = fib.html

    fib
    .wrap( /\b[\w]+(?:ing|ed)\b/gi, 'u' )
    .removeBdry( 'a' )
    .wrap( /foobar/gi, 'match' )

    const end = Date.now()
    log( fib.render())

    console.time( 'Revert' )
    fib.revert( 2 ).render()

    log( `\n\nTotal time using Fibrio: ${end - start}ms` )
    console.timeEnd( 'Revert' )
    log( `Reversion went properly: ${ fib.html === control }` )
  }
)

