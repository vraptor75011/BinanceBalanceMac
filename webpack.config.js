const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: ['./index4.ts'],
  output: {
    filename: 'binance-balance.2m.sh',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false,
  },
  // file resolutions
  resolve: {
    extensions: ['.ts', '.js'],
  },

  // loaders
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    /*     new webpack.ProvidePlugin({
      //      Promise: 'es6-promise', // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      //      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),
 */
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env /usr/local/bin/node',
      raw: true,
    }),
  ],
};
