module.exports = {
    modulesDirectories : [
        'node_modules',
        'dev_modules'
    ],
    extensions : [
        '.js',
        ''
    ],
    packageMains : [
        'main',
        'loader',
        'webpackLoader',
        'webLoader'
    ],
    moduleTemplates : [
        '*-loader',
        ''
    ]
};
