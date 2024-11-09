const path = require('path');

module.exports = function override({ resolve: cfgResolve, ...config }) {
    return {
        ...config,
        resolve: {
            ...cfgResolve,
            alias: {
                ...cfgResolve.alias,
                "@": path.resolve(__dirname, './src'),
            }
        }
    };
}