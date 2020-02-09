const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const sass = require('sass')

const isDevMode = process.env.NODE_ENV === 'development'

const config = {
  devtool: isDevMode ? 'eval-source-map' : false,
  context: path.resolve(__dirname, './src'),
  entry: {
    options: './options/index.js',
    popup: './popup/index.js',
    background: './background/index.js',
    contentScript: './contentScripts/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '.',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: !isDevMode,
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.scss$/,
        use: [
          isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: sass,
            },
          },
        ],
      },
      {
        test: /\.sass$/,
        use: [
          isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: sass,
            },
          },
        ],
      },
      {
        test: /\.styl$/,
        use: [
          isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      bulma$: 'bulma/css/bulma.css',
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
      {
        from: isDevMode ? 'manifest.dev.json' : 'manifest.json',
        to: 'manifest.json',
        flatten: true,
      },
    ]),
    new HtmlWebpackPlugin({
      title: 'Options',
      template: './index.html',
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      title: 'Popup',
      template: './index.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['!assets/*', '!manifest.json'],
    }),
  ],
}

/**
 * Adjust rendererConfig for production settings
 */
if (isDevMode) {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new ChromeExtensionReloader({
      reloadPage: true,
      entries: {
        background: 'background',
        contentScript: ['contentScript', 'options', 'popup'],
      },
    })
  )
} else {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].css',
    })
  )
}

module.exports = config
