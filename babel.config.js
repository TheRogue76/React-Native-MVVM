module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'babel-plugin-react-compiler',
    '@babel/plugin-transform-class-static-block',
    'babel-plugin-transform-typescript-metadata',
    '@babel/plugin-transform-export-namespace-from',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
