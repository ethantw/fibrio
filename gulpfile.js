
const gulp    = require( 'gulp' )
const util    = require( 'gulp-util' )
const concat  = require( 'gulp-concat-util' )
const server  = require( 'gulp-connect' ).server
const webpack = require( 'webpack' )

const pkg     = require( './package.json' )
const banner  = '' +
  '/*!\n' +
  ' * Fibre-node v' + pkg.version + '\n' +
  ' * Chen Yijun (@ethantw) | MIT License\n' +
  ' * https://github.com/ethantw/fibre-node\n' +
  ' *\n' +
  ' * Original algorithm from:\n' +
  ' * https://github.com/padolsey/findAndReplaceDOMText\n' +
  ' */\n\n'

// Unified tasks
gulp.task( 'default', [ 'build' ])
gulp.task( 'build',   [ 'index.js' ])
gulp.task( 'dev',     [ 'default', 'server', 'watch' ])

gulp.task( 'server', function() {
  server({ port: 3333 })
})

gulp.task( 'watch', function() {
  gulp.watch( './src/**/*.js', [ 'index.js' ])
})

gulp.task( 'index.js', [ 'pack' ], function() {
  gulp.src( './index.js' )
  .pipe(concat( 'index.js', {
    process: function( src ) {
      return (
        banner + src
        .replace( /IMPORT/g, 'require' )
        .replace( /@VERSION/g, pkg.version ) + '\n' +
        'function IMPORT( mod ) { return require( mod ) }\n' +
        'function EXPORT_ONCE( mod ) { module.exports = mod }\n'
      )
    }
  }))
  .pipe(gulp.dest( './' ))
})

gulp.task( 'pack', function( callback ) {
  webpack({
    entry: './src/index.js',
    output: {
      path: __dirname,
      filename: 'index.js'
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }]
    }
  }, function( error, stat ) {
    if ( error )  throw new util.PluginError( 'webpack', error )
    util.log( '[webpack]', stat.toString())
    callback()
  })
})

