# panorama-manifest-html-webpack-plugin

> HtmlWebpackPlugin extension that generates custom_ui_manifest.xml file for Panorama

## Install

```bash
npm i panorama-manifest-html-webpack-plugin
# or
yarn add panorama-manifest-html-webpack-plugin
```

## Usage

```javascript
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin');
const PanoramaManifestHtmlWebpackPlugin = require('panorama-manifest-html-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      // ...
    }),
    new PanoramaManifestHtmlWebpackPlugin({
      // Plugin Options
    }),
  ],
};
```

## Options

PanoramaManifestHtmlWebpackPlugin constructor has only one option - `typeMappings`.

This option allows to alter `type` property on created `CustomUIElement` nodes.

Should have `object` type with keys of asset path.

By default all `CustomUIElement` nodes will have **HUD** type.

If type is `false`, asset won't be added to generated html (useful for **custom_loading_screen.xml**)

## Example

```javascript
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin');
const PanoramaManifestHtmlWebpackPlugin = require('panorama-manifest-html-webpack-plugin');

module.exports = {
  entry: {
    'custom_ui_manifest.js': 'src/panorama/scripts/custom_game/custom_ui_manifest.js',
    'end-screen.xml': 'src/panorama/scripts/custom_game/end-screen.xml',
    '../layout/custom_game/custom_loading_screen.xml': 'src/panorama/custom_game/custom_loading_screen.xml',
  },
  output: {
    path: 'content/panorama/custom_game/',
    // Because we need to emit .xml and .js at the same time
    filename: '[name]',
    publicPath: 'file://{resources}/custom_game/',
  },
  module: {
    loaders: [
      // Some loader for your layout files
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/panorama/layout/custom_game/custom_ui_manifest.xml',
      filename: '../layout/custom_game/custom_ui_manifest.xml',
    }),
    new PanoramaManifestHtmlWebpackPlugin({
      'end-screen.xml': 'EndScreen',
      // Remove custom_loading_screen.xml from manifest
      '../layout/custom_game/custom_loading_screen.xml': false,
    }),
  ],
};
```
