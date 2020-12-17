const uglify = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: './mongoCLI/mongo-export.js',
  target: 'node',
  output: {
    path: resolve('dist/export'),
    filename: 'mongo-export.js'
  },
  plugins: [
    new webpack.DefinePlugin({}),
    new uglify(),
    new CopyPlugin([
      {
        from: resolve('config/export.bat'),
        to: 'export.bat'
      }
    ]),
  ],
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   include: resolve(),
      //   options: {
      //     presets: ['env', 'stage-2']
      //   }
      // }
    ]
  }
}
