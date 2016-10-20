const externals = require('webpack-node-externals');

const config = {
    client : {
        development : null,
        production  : null
    },
    server : {
        development : [],
        production  : [
            externals()
        ]
    }
};

module.exports = config[global.webpack.type][global.webpack.env];
