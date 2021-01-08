const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === 'development';
const outputDir = process.env.OUTPUT_DIR || 'build';

const MAIN_ENTRY_NAME = 'page';
const BG_ENTRY_NAME = 'background';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: 'source-map',
  entry: {
    [MAIN_ENTRY_NAME]: `./src/${MAIN_ENTRY_NAME}.tsx`,
    [BG_ENTRY_NAME]: `./src/${BG_ENTRY_NAME}.tsx`,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/static", to: 'static' },
        { from: "src/manifest.json", to: '.' },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'Tab Sink',
      chunks: [MAIN_ENTRY_NAME],
      favicon: 'src/static/logo.svg',
      template: 'src/template.html',
      filename: `${MAIN_ENTRY_NAME}.html`,
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: [/\.module\.scss$/, /\.scss$/],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
              modules: {
                mode: 'local',
                localIdentName: isDevelopment
                  ? '[folder]__[local]--[hash:base64:5]'
                  : '[hash:base64]',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|jpg|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isDevelopment ? '[name]__[contenthash].[ext]' : '[contenthash].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, outputDir),
    publicPath: '/',
  },
};
