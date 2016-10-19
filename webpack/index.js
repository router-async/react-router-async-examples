const { resolve } = require('path');

const env = process.argv.indexOf('-p', 2) !== -1;
const type = process.argv.indexOf('-s', 2) !== -1;

global.webpack = {
    context     : resolve(__dirname, '..'),
    dir         : __dirname,
    env         : process.env.NODE_ENV || (env ? 'production' : 'development'),
    type        : type ? 'server' : 'client',
    production  : env,
    // config      : process.env.CONFIG,
    development : !env,
    client      : !type,
    server      : type
};

module.exports = {
    context         : global.webpack.context,
    entry           : require('./entry'),
    devtool         : require('./devtool'),
    target          : require('./target'),
    externals       : require('./externals'),
    output          : require('./output'),
    module          : {
        preLoaders  : require('./module.preLoaders'),
        loaders     : require('./module.loaders')
    },
    resolve         : require('./resolve'),
    resolveLoader   : require('./resolveLoader'),
    plugins         : require(`./plugins/${global.webpack.type}`),
    postcss         : require('./postcss'),
    devServer       : require(`./devServer/${global.webpack.env}`),
    serverFileLoader: {
        // @TODO: https://github.com/webpack/file-loader/pull/81
        publicPath : url => url.replace('./../../public', '')
    }
};
