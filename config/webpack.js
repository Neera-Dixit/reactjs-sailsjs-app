/* global require, module, __dirname */

var webpack = require('webpack'),
  babelPolyfill = require('babel-polyfill'),
  htmlWebpackPlugin = require('html-webpack-plugin'),
  commonsPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
  extractTextPlugin = require('extract-text-webpack-plugin'),
  cleanWebpackPlugin = require('clean-webpack-plugin'),
  copyWebpackPlugin = require('copy-webpack-plugin'),
  path = require('path'),
  basePath = path.resolve(__dirname, '../'),
  libPath = path.resolve(basePath, './assets/resources/lib'),
  libsCSS = new extractTextPlugin('styles/libs.css'),
  appCSS = new extractTextPlugin('styles/app.css');

module.exports.webpack = {
  config: {
    context: path.resolve(basePath, 'assets'),
    entry: {
      app: './js/index.jsx'
    },
    output: {
      path: path.join(basePath + '/.tmp/public'),
      filename: 'js/[name].js',
      publicPath: '/'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015','react']
            //plugins: [['import',{'libraryName': 'antd','style': 'css'}]]
          }
          //include: basePath + '/assets/app'
        },
        {
          test: /\.css$/,
          loader: libsCSS.extract('css-loader'),
          include: basePath + '/assets/resources/lib'
        },
        {
          test: /\.less$/,
          loader: appCSS.extract('css-loader!less-loader'),
          include: basePath + '/assets/resources/less'
        },
        {
          test: /\.(eot|woff|woff2|ttf|svg|otf)(\?[a-z0-9=&.]+)?$/,
          loader: 'file-loader?limit=30000&name=fonts/[name].[ext]',
          include: basePath + '/assets/resources'
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          loader: 'file-loader?limit=10000&name=images/[name].[ext]',
          include: basePath + '/assets/resources'
        }
      ]
    },
    plugins: [
      new cleanWebpackPlugin(['.tmp'], {root: basePath}),
      new htmlWebpackPlugin({
        template: path.join(basePath + '/assets/index.html'),
        filename: path.join(basePath + '/.tmp/public/index.html'),
        inject: 'body',
        hash: true
      }),
      libsCSS,
      appCSS
    ],
    resolve: {
      extensions: ['.js'],
    }
  },
  watchOptions: {
    aggregateTimeout: 3000,
    ignored: /node_modules/
  }
};
