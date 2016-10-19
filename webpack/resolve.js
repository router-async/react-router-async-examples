const { resolve } = require('path');

module.exports = {
    root : resolve(global.webpack.context, 'app'),
    modulesDirectories : [
        'dev_modules',
        'node_modules'
    ],
    alias : {
        app     : resolve(global.webpack.context, 'app'),
        block   : resolve(global.webpack.context, 'app', 'blocks'),
        page    : resolve(global.webpack.context, 'app', 'pages')
    },
    extensions : [
        '.js',
        '.pcss',
        '.json',
        '.jsx',
        ''
    ]
};
