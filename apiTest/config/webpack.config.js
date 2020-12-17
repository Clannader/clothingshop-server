const uglify = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const env = process.env.NODE_ENV || 'prod'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: './apiTest/exec-app.js',
  target: 'node',
  output: {
    path: resolve('dist'),
    filename: 'exec-app.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('./' + env + '.env')
    }),
    new uglify(),
    new CopyPlugin([{
      from: resolve('config/run.bat'),
      to: 'run.bat'
    }]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('api'), resolve('../node_modules/inquirer')],
        options: {
          presets: ['env', 'stage-2']
        }
      }
    ]
  }
}
