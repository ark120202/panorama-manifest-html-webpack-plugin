const test = require('ava');
const PanoramaManifestHtmlWebpackPlugin = require('..');

test('should find and replace script and Panel tags', (t) => {
  const source = `
<root>
  <scripts>
    <include src="file://{resources}/custom_game/base-script.js"></include>
  < /   scripts>
  <Panel><    /   Panel>
</root>
`;
  const expected = `
<root>
  <scripts>
    <include src="file://{resources}/custom_game/base-script.js"></include>
~~SCRIPTS~~
  < /   scripts>
  <Panel>
~~LAYOUT~~<    /   Panel>
</root>
`;
  const plugin = new PanoramaManifestHtmlWebpackPlugin();
  const result = plugin.patchHtmlString(source, '~~SCRIPTS~~', '~~LAYOUT~~');

  t.is(result, expected);
});
