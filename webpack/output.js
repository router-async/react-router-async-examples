const { resolve } = require('path');

const result = {
    client : {
        development : {
            path            : resolve(global.webpack.context, 'public'),
            publicPath      : `http://0.0.0.0:8080/`,
            pathinfo        : true,
            chunkFilename   : '[name].js',
            filename        : '[name].js'
        },
        production  : {
            path            : resolve(global.webpack.context, 'public'),
            chunkFilename   : '[name]-[chunkhash].js',
            filename        : '[name]-[chunkhash].js'
        }
    },
    server : {
        development : {
            path            : resolve(global.webpack.context, 'server'),
            filename        : '[name].js',
            pathinfo        : true,
            publicPath      : `http://0.0.0.0:8080/build/`,
            libraryTarget   : 'commonjs2'
        },
        production  : {
            path            : resolve(global.webpack.context, 'server'),
            filename        : '[name].js',
            publicPath      : '/build/',
            libraryTarget   : 'commonjs2'
        }
    }
};

module.exports = result[global.webpack.type][global.webpack.env];
