const DaemonCommandPlugin   = require('daemon-command-webpack-plugin');

const common = require('./common');

const config = {
    development : [
        ...common,
        new DaemonCommandPlugin('start:dev', {
            manager: 'yarn',
            marker : true
        })
    ],
    production  : [
        ...common
    ]
};

module.exports = config[global.webpack.env];
