const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = [{
    test    : /\.(png|jpe?g|gif|ico|svg)$/,
    loader  : 'url',
    exclude : [
        resolve(global.webpack.context, 'dev_modules'),
        resolve(global.webpack.context, 'node_modules')
    ],
    query   : {
        limit   : 10240,
        emitFile: global.webpack.client
    }
}];

const commonClient = [{
    test    : /\.(eot|woff|ttf)$/,
    loader  : 'file',
    query   : {
        name : '[name].[hash].[ext]'
    }
}, {
    test    : /\.(webm|mp4)$/,
    loader  : 'file'
}];

const commonServer = [{
    test    : /\.(webm|mp4|eot|woff|ttf)$/,
    loader  : 'webpack-assets'
}, {
    test    : /\.(png|jpe?g|gif|svg)$/,
    loader  : 'file',
    include : [
        resolve(global.webpack.context, 'app', 'pages', 'html'),
    ],
    query   : {
        name    : './../../public/[name].[ext]',
        config  : 'serverFileLoader'
    }
}, {
    test    : /\.jsx?$/,
    exclude : [
        resolve(global.webpack.context, 'dev_modules'),
        resolve(global.webpack.context, 'node_modules')
    ],
    loader  : 'babel',
    query   : {
        cacheDirectory: global.webpack.development,
        presets: [
            'react',
            'latest-node6'
        ]
    }
}];

const config = {
    client : {
        development : [
            ...common,
            ...commonClient, {
            test    : /\.jsx?$/,
            exclude : [
                resolve(global.webpack.context, 'dev_modules'),
                resolve(global.webpack.context, 'node_modules')
            ],
            loader  : 'babel',
            query   : {
                sourceMaps : true,
                cacheDirectory: global.webpack.development,
                presets : [
                    'react',
                    'latest'
                ],
                plugins : [
                    [
                        'react-transform',
                        {
                            'transforms': [{
                                'transform' : 'react-transform-hmr',
                                'imports'   : [
                                    'react'
                                ],
                                'locals'    : [
                                    'module'
                                ]
                            }, {
                                'transform' : 'react-transform-catch-errors',
                                'imports'   : [
                                    'react',
                                    'redbox-react'
                                ]
                            }]
                        }
                    ]
                ]
            }
        }, {
            test    : /\.pcss$/,
            loader  : ExtractTextPlugin.extract('style', 'css?-autoprefixer&-minimize&sourceMap&localIdentName=[local]-[hash:hex:5]'),
            exclude : [
                resolve(global.webpack.context, 'dev_modules'),
                resolve(global.webpack.context, 'node_modules')
            ]
        }],
        production  : [
            ...common,
            ...commonClient, {
            test    : /\.jsx?$/,
            include : [
                resolve(global.webpack.context, 'app'),
                resolve(global.webpack.context, 'configs')
            ],
            loader  : 'babel',
            query   : {
                sourceMaps : true,
                cacheDirectory: global.webpack.development,
                presets: [
                    'react',
                    'es2015',
                    'stage-1'
                ],
                plugins: [
                    'transform-decorators-legacy'
                ]
            }
        }, {
            test    : /(lib|booker|core)-ui__[a-zA-Z0-9-_\/.]+\.jsx?$/,
            include : [
                resolve(global.webpack.context, 'dev_modules'),
                resolve(global.webpack.context, 'node_modules')
            ],
            loader  : 'babel',
            query   : {
                sourceMaps : true,
                cacheDirectory: global.webpack.development,
                presets: [
                    'react',
                    'es2015',
                    'stage-1'
                ],
                plugins: [
                    'transform-decorators-legacy'
                ]
            }
        }, {
            test    : /\.pcss$/,
            loader  : ExtractTextPlugin.extract('style', 'css?sourceMap&localIdentName=[hash:hex]'),
            include : [
                resolve(global.webpack.context, 'app'),
                resolve(global.webpack.context, 'dev_modules'),
                resolve(global.webpack.context, 'node_modules')
            ]
        }]
    },
    server : {
        development : [
            ...common,
            ...commonServer,
            {
                test    : /\.pcss$/,
                loader  : 'css/locals?localIdentName=[local]-[hash:hex:5]',
                include : [
                    resolve(global.webpack.context, 'app'),
                    resolve(global.webpack.context, 'dev_modules'),
                    resolve(global.webpack.context, 'node_modules')
                ]
            }
        ],
        production  : [
            ...common,
            ...commonServer,
            {
                test    : /\.pcss$/,
                loader  : 'css/locals?localIdentName=[hash:hex]',
                include : [
                    resolve(global.webpack.context, 'app'),
                    resolve(global.webpack.context, 'dev_modules'),
                    resolve(global.webpack.context, 'node_modules')
                ]
            }
        ]
    }
};

module.exports = config[global.webpack.type][global.webpack.env];
