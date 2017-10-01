const path = require('path');
const validateOptions = require('schema-utils');
const schema = require('./options');

module.exports = class PanoramaManifestHtmlWebpackPlugin {
  /**
   * Function, invoked for altering asset's types.
   *
   * @callback typeMappingFunction
   * @param {string} asset Original asset path
   * @returns {string} New CustomUIElement type property value.
   */

  /**
   * Creates an instance of PanoramaManifestHtmlWebpackPlugin.
   *
   * @param {Object} [options] Plugin options
   * @param {Object.<string, string>|typeMappingFunction} [options.typeMappings]
   * By default all injected CustomUIElement's will have 'HUD' type.
   * This property makes it possible to have other types.
   * If it's an object, `generated asset path` will be used as a key.
   */
  constructor(options = {}) {
    validateOptions(schema, options, 'Panorama Manifest Html Webpack Plugin');
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-before-html-processing', (args, callback) => {
        // Manually add includes
        args.html = this.patchHtmlString(
          args.html,
          this.generateScripts(args.assets.js),
          this.generateLayout(args.assets.js, compilation),
        );
        // Make HtmlWebpackLoader think that we have no assets to inject
        args.assets = { js: [], css: [] };
        callback(null, args);
      });
    });
  }

  patchHtmlString(html, scripts, layout) { // eslint-disable-line class-methods-use-this
    return html
      .replace(/\n?\s*?<\s*?\/\s*?scripts/, match => `\n${scripts}${match}`)
      .replace(/\n?\s*?<\s*?\/\s*?Panel/, match => `\n${layout}${match}`);
  }

  generateScripts(assets) { // eslint-disable-line class-methods-use-this
    return assets.map((asset) => {
      const extname = path.extname(asset);
      if (extname !== '.js') return '';

      return `<include src="${asset}"></include>`;
    }).join('');
  }

  generateLayout(assets, compilation) {
    return assets.map((asset) => {
      const extname = path.extname(asset);
      if (extname !== '.xml') return '';

      let type = 'HUD';
      // Files on this stage already should be with publicPath, so try to find it's base name
      const shortAssetName = Object.keys(compilation.assets).find(file => asset.endsWith(file));
      if (
        this.options.typeMappings != null &&
        this.options.typeMappings[shortAssetName || asset] != null
      ) {
        type = this.options.typeMappings[shortAssetName || asset];
      }

      if (type === false) return '';
      return `<CustomUIElement type="${type}" layoutfile="${asset}"></CustomUIElement>`;
    }).join('');
  }
};
