const { resolve } = require('path');

const common = [{
    test    : /\.pcss$/,
    loader  : 'postcss',
    include : [
        resolve(global.webpack.context, 'app'),
        resolve(global.webpack.context, 'dev_modules'),
        resolve(global.webpack.context, 'node_modules')
    ]
}, {
    test    : /\.(png|jpe?g|gif|ico|svg)$/,
    loader  : 'img',
    query   : {
        minimize            : global.webpack.production,
        progressive         : true,
        optimizationLevel   : 5
    }
}, {
    test    : /\.json/,
    loader  : 'json'
}];

const commonServer = [{
    test    : /\.(webapp|ico)$/,
    loader  : 'file',
    query   : {
        name    : './../../public/[hash].[ext]',
        config  : 'serverFileLoader'
    }
}];

const config = {
    client : {
        development : [
            ...common
        ],
        production  : [
            ...common
        ]
    },
    server : {
        development : [
            ...common,
            ...commonServer
        ],
        production  : [
            ...common,
            ...commonServer
        ]
    }
};

module.exports = config[global.webpack.type][global.webpack.env];
