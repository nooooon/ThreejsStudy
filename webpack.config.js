var webpack = require('webpack');
var path = require('path');

module.exports = {
  cache: true,
  watch: true,
  entry: {
    'js/index': './src/js/index.js',
    'boxes/js/index': './src/boxes/js/index.js',
    'particle_normal/js/index': './src/particle_normal/js/index.js',
    'particle_text/js/index': './src/particle_text/js/index.js',
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /(node_modules|web_modules)/, use: {loader: 'babel-loader', options: {compact: true}}}
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, "src/js"), "node_modules"],
    extensions: ['*', '.js', '.coffee', '.babel.js']
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    }),
    //new webpack.optimize.UglifyJsPlugin(),
  ],
  devtool: 'sourcemap'
};