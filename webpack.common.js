
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/todolist.html",
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), 
},
  resolve: {
    extensions: ['.js', '.jsx'], // Include other extensions as needed
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // Regex for CSS files
        use: ['style-loader', 'css-loader'], // Loaders for CSS
    },   {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-url-loader',
          options: {
            limit: 10000, // Inline files smaller than 10 KB
          },
        },
      ],
    },
    ],
  },
};