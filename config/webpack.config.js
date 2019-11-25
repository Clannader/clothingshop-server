const uglify = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
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
        filename: 'app-server.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('./' + env + '.env')
        }),
        new uglify(),
        new CopyPlugin([{
            from: resolve('certs'),
            to: 'certs'
        }, {
            from: resolve('config/config.ini'),
            to: 'config/config.ini'
        }]),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('server')],
                options: {
                    presets: ['env', 'stage-2']
                }
            }
        ]
    }
};
