
const gulp    = require( 'gulp' )
const util    = require( 'gulp-util' )
const concat  = require( 'gulp-concat-util' )
const server  = require( 'gulp-connect' ).server
const webpack = require( 'webpack' )
const mocha   = require( 'gulp-mocha' )

const pkg     = require( './package.json' )
const banner  = (
`/*!
 * Fibrio v${pkg.version}
 * Chen Yijun (@ethantw) | MIT License
 * https://github.com/ethantw/fibrio
 *
 * Original algorithms from:
 * https://github.com/padolsey/findAndReplaceDOMText
 */\n
` )

// Unified tasks
gulp.task( 'default', [ 'build' ])
gulp.task( 'build',   [ 'index.js', 'test' ])
gulp.task( 'dev',     [ 'default', 'server', 'watch' ])

gulp.task( 'server', function() {
  server({ port: 3333 })
})

gulp.task( 'watch', function() {
  gulp.watch( './src/**/*.js', [ 'build' ])
  gulp.watch( './test/**/*.js', [ 'test' ])
})

gulp.task( 'test', [ 'index.js' ], () => {
  return gulp.src( './test/index.js', { read: false })
  .pipe(mocha())
})

gulp.task( 'index.js', [ 'pack' ], function() {
  return gulp.src( './dist/fibrio.js' )
  .pipe(concat( 'fibrio.js', {
    process: function( src ) {
      return (
        banner + src
        .replace( /IMPORT/g, 'require' )
        .replace( /@VERSION/g, pkg.version )
      )
    }
  }))
  .pipe(gulp.dest( './dist' ))
})

gulp.task( 'pack', function( callback ) {
  webpack({
    entry: './src/index.js',
    output: {
      path: './dist',
      filename: 'fibrio.js',
      libraryTarget: 'umd',
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }]
    },
    babel: {
      loose: 'all',
    },
    devtool: '#source-map',
  }, function( error, stat ) {
    if ( error )  throw new util.PluginError( 'webpack', error )
    util.log( '[webpack]', stat.toString())
    callback()
  })
})

