const common = [
    require('stylelint')({
        configBasedir : global.webpack.context
    }),
    require('postcss-nested'),
    require('autoprefixer')({
        browsers : [
            'ie >= 10',
            'Safari >= 8',
            'iOS >= 8'
        ]
    })
];

module.exports = () => common;
