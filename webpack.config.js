const webpack = require('webpack')
const { merge } = require('webpack-merge')

const common = {
  mode: 'production',
  // Do not generate source map
  devtool: false,
  output: {
    path: __dirname + '/dist',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // Limit bundle size to 10 kB, otherwise error
  performance: {
    hints: 'error',
    maxEntrypointSize: 10 * 1024,
  },
  // Transpile to ES5
  target: ['web', 'es5'],
}

/**
 * Content script - runs on load of each page
 */
const configContent = merge(common, {
  entry: './src/indexContentScript.ts',
  output: {
    filename: 'content_script.min.js',
  },
})

/**
 * Page script - injected into the page
 */
const configPage = merge(common, {
  entry: './src/indexPageScript.ts',
  output: {
    filename: 'page_script.min.js',
  },
})

module.exports = [configContent, configPage]
