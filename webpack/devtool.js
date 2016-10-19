const config = {
    client : {
        development : 'inline-source-map',
        production  : null
    },
    server : {
        development : null,
        production  : null
    }
};

module.exports = config[global.webpack.type][global.webpack.env];
