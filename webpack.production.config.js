var webpack = require('webpack')
var path = require('path')

module.exports = {
  output: {
    path: __dirname + '/dist/',
    filename: '[name]',
  },
  devtool: 'source-map',
  entry: {
    'index.js': './src/main.jsx',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          compact: false,
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.scss?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['style', 'css', 'sass'],
      },
    ],
  },
  sassLoader: {
    includePaths: [
      require('bourbon').includePaths,
      require('bourbon-neat').includePaths,
      path.resolve(path.join(__dirname, 'src', 'theme')),
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      comments: false,
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
  ],
}
