// Webpack configuration

const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// Common
//
// This configuration is used for both the development and production
// builds.
const commonConfig = {
  entry: './src/main.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        exclude: /images/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        }],
      },
      {
        test: /\.(jpg|png|svg)$/,
        exclude: /fonts/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'images/[hash].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: path.resolve(__dirname, '../'),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  stats: {
    colors: true,
  },
};

// Development
//
// This configuration is used only when bundling the development files.
const developmentConfig = {
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 9000,
  },
};

// Production
//
// This configuration is used only when bundling the final production ready
// files.
const productionConfig = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new UglifyJsPlugin({
      sourceMap: true,
      parallel: true,
    }),
  ],
};

// Export configuration based on the set environment.
if (process.env.NODE_ENV === 'development') {
  module.exports = merge(commonConfig, developmentConfig);
} else {
  module.exports = merge(commonConfig, productionConfig);
}
