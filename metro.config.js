const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.resolver.sourceExts.push('cjs', 'js', 'ts', 'tsx', 'json'); // Ensure it supports cjs and esm

  config.resolver.extraNodeModules = {
    '@bufbuild/protobuf': require.resolve('@bufbuild/protobuf'),
  };

  return config;
})();