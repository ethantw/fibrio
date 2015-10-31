
module.exports = {
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
}

