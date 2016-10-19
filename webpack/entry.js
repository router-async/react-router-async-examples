const common = {
    // client : ['babel-polyfill', './app'],
    client: {
        simple: ['babel-polyfill', './simple'],
        universal: ['babel-polyfill', './universal/client']
    },
    server: {
        universal: './universal/server'
    }
};

const config = {
    client: {
        development : common.client,
        production  : common.client
    },
    server: {
        development : common.server,
        production  : common.server
    }
};

module.exports = config[global.webpack.type][global.webpack.env];
