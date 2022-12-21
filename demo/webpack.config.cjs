const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      }
    ],
  },
  entry: './demo/demo.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: 'demo-mv-select.js',
  },
  devServer: {
    hot: false,
    liveReload: true,
    client: {
      overlay: false
    }
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./demo/index.html"
  })],
};