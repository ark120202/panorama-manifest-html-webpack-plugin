const test = require('ava');
const PanoramaManifestHtmlWebpackPlugin = require('..');

test('should generate correct include tags', (t) => {
  const files = ['./script.js', './script2.js', './script3.js'];
  const plugin = new PanoramaManifestHtmlWebpackPlugin();
  const includes = plugin.generateScripts(files);

  t.is(includes, [
    '<include src="./script.js"></include>',
    '<include src="./script2.js"></include>',
    '<include src="./script3.js"></include>',
  ].join(''));
});
