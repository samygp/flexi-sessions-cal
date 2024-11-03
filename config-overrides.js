const path = require('path');

module.exports = function override(config) {
    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.resolve.alias,
            '@shared': path.resolve(__dirname, './src/shared'),
            "@components":  path.resolve(__dirname, "./src/components"),
            "@views":  path.resolve(__dirname, "./src/views"),
            "@hooks":  path.resolve(__dirname, "./src/hooks"),
            "@services":  path.resolve(__dirname, "./src/services"),
            "@config":  path.resolve(__dirname, "./src/config.json"),
        }
    }
    return config;
}