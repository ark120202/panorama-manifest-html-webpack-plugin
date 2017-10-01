const test = require('ava');
const PanoramaManifestHtmlWebpackPlugin = require('..');

function getFakeCompilation(publicPath, files) {
  return {
    assets: files.reduce((acc, file) => {
      acc[`${publicPath}${file}`] = '';
      return acc;
    }, {}),
  };
}

test('should generate correct include tags', (t) => {
  const files = ['./layout.xml', './layout2.xml', './layout3.xml'];
  const plugin = new PanoramaManifestHtmlWebpackPlugin();
  const layout = plugin.generateLayout(files, getFakeCompilation('http://public-path/', files));

  t.is(layout, [
    '<CustomUIElement type="HUD" layoutfile="./layout.xml"></CustomUIElement>',
    '<CustomUIElement type="HUD" layoutfile="./layout2.xml"></CustomUIElement>',
    '<CustomUIElement type="HUD" layoutfile="./layout3.xml"></CustomUIElement>',
  ].join(''));
});

test('should be able to modify CustomUIElement type with `typeMappings` option', (t) => {
  const files = ['./game-setup.xml', './top-bar.xml', './end-screen.xml', './hud.xml', './skipped.xml'];
  const plugin = new PanoramaManifestHtmlWebpackPlugin({
    typeMappings: {
      './game-setup.xml': 'GameSetup',
      './top-bar.xml': 'HudTopBar',
      './end-screen.xml': 'EndScreen',
      './skipped.xml': false,
    },
  });
  const layout = plugin.generateLayout(files, getFakeCompilation('http://public-path/', files));

  t.is(layout, [
    '<CustomUIElement type="GameSetup" layoutfile="./game-setup.xml"></CustomUIElement>',
    '<CustomUIElement type="HudTopBar" layoutfile="./top-bar.xml"></CustomUIElement>',
    '<CustomUIElement type="EndScreen" layoutfile="./end-screen.xml"></CustomUIElement>',
    '<CustomUIElement type="HUD" layoutfile="./hud.xml"></CustomUIElement>',
  ].join(''));
});
