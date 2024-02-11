module.exports = {
  presets: ['module:@react-native/babel-preset'],
  /** The following is needed for react native paper.
   *  See https://callstack.github.io/react-native-paper/docs/guides/getting-started
   */
  env: {
    production: {
      plugins: ['react-native-paper/babel']
    }
  }
};
