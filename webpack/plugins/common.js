const webpack               = require('webpack');
const ExtractTextPlugin     = require("extract-text-webpack-plugin");

module.exports = [
    new webpack.DefinePlugin({
        __CLIENT__              : global.webpack.client,
        __SERVER__              : global.webpack.server,
        __PRODUCTION__          : global.webpack.production,
        __DEVELOPMENT__         : global.webpack.development,
        'process.env.NODE_ENV'  : JSON.stringify(global.webpack.env)
    }),
    new ExtractTextPlugin('[name]-[contenthash].css', {
        allChunks   : true,
        disable     : global.webpack.server || global.webpack.development
    })
];
