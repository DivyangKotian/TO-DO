const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: "eval-source-map",
    entry: './src/index.js', // Entry point for your app
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // Output path
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Resolve these file extensions
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Regex for JS files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Specify the loader for JS
                },
            },
        ],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'), // Serve files from "dist"
        },
        watchFiles: ["./src/todolist.html"], 
        open: true,
    },
});
