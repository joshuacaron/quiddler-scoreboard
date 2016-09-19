var webpack = require('webpack')
var path = require('path')

module.exports = {
  output: {
    path: __dirname + '/dist/',
    filename: '[name]',
  },
  devtool: 'cheap-module-eval-source-map',
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
          plugins: ['react-hot-loader/babel'],
        },
      },
      {
        test: /\.scss?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['style', 'css', 'sass'],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  sassLoader: {
    includePaths: [
      require('bourbon').includePaths,
      require('bourbon-neat').includePaths,
      path.resolve(path.join(__dirname, 'src', 'theme')),
    ],
  },
}
