const { resolve }           = require('path');
const webpack               = require('webpack');
const AssetsPlugin          = require('webpack-assets-plugin');
const CleanPlugin           = require('clean-webpack-plugin');
const Md5HashPlugin         = require('webpack-md5-hash');
const HtmlWebpackPlugin     = require('html-webpack-plugin');

const common = require('./common');

const base = [
    new webpack.NoErrorsPlugin(),
    new AssetsPlugin()
];

const config = {
    development : [
        ...common,
        ...base,
        new HtmlWebpackPlugin({
            title: 'Main Page',
            filename: 'index.html',
            template: 'index.ejs',
            inject: false
        }),
        new HtmlWebpackPlugin({
            title: 'Simple Example',
            filename: 'simple/index.html',
            template: 'simple/index.ejs',
            inject: false
        })
    ],
    production  : [
        ...common,
        ...base,
        new CleanPlugin([
            resolve(global.webpack.context, 'public')
        ]),
        new Md5HashPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendors', '[name]-[chunkhash].js'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};

module.exports = config[global.webpack.env];
