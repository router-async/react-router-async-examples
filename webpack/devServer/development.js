const { resolve } = require('path');

module.exports = {
    host        : '0.0.0.0',
    port        : 8080,
    contentBase : resolve(global.webpack.context, 'public'),
    proxy       : [
        {
            path    : [
                '**',
                '!/*.webapp',
                '!/icon-*x*.png',
                '!/*.ico'
            ],
            target  : `http://localhost:3000`
        }
    ],
    hot                 : true,
    inline              : true,
    historyApiFallback  : false,
    compress            : true,
    lazy                : false,
    quiet               : false,
    noInfo              : false,
    stats               : {
        hash        : false,
        version     : false,
        timings     : true,
        assets      : true,
        chunks      : true,
        chunkModules: false,
        modules     : false,
        children    : true,
        cached      : true,
        reasons     : false,
        source      : true,
        errorDetails: true,
        chunkOrigins: true,
        colors      : true
    }
};
