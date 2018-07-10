var fs = require('fs');
var path = require('path');
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: path.resolve(__dirname, 'src/server.ts'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  devtool: 'eval-source-map',
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx'
      // extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  target: 'node',
  externals: nodeModules,
};