// const uglify = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const env = process.env.NODE_ENV || 'prod';
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: './app.js',
    target: 'node',
    output: {
        path: resolve('dist'),
        // filename: 'app-server.[chunkhash:8].js',
        filename: 'app-server.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('./' + env + '.env')
        }),
        new CleanWebpackPlugin(),
        // new uglify(),
        new CopyPlugin([{
            from: resolve('certs'),
            to: 'certs'
        }, {
            from: resolve('config/config.ini'),
            to: 'config/config.ini'
        }, {
            from: resolve('template'),
            to: 'template'
        }]),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('server')],
                options: {
                    plugins: ['transform-runtime'],
                    presets: ['env', 'stage-2']
                }
            }
        ]
    },
    mode: 'production' // development 默认不压缩, production 压缩的
};
