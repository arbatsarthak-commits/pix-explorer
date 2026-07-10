const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const config = {
  projectRoot: __dirname,
  watchFolders: [__dirname],
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
    resolverMainFields: ['react.native', 'browser', 'main'],
    extraNodeModules: {
      '@': path.resolve(__dirname, 'src/'),
    },
    blockList: [
      /node_modules\/react-native-reanimated\/android\/.cxx\/.*/,
      /node_modules\/react-native\/.*\.o$/,
      /\.gradle\/.*/,
      /build\/.*/,
    ],
  },
  server: {
    port: 8081,
    maxWorkers: 2,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    assetRegistryPath: require.resolve('react-native/Libraries/Image/AssetRegistry'),
  },
  maxWorkers: 2,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

