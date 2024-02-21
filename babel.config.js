module.exports = {
  presets: ['module:@react-native/babel-preset'],
  /* The following is needed for react-native-dotenv.
  See https://github.com/goatandsheep/react-native-dotenv */
  plugins: [['module:react-native-dotenv']],
  /** The following is needed for react native paper.
   *  See https://callstack.github.io/react-native-paper/docs/guides/getting-started
   */
  env: {
    production: {
      plugins: ['react-native-paper/babel']
    }
  }
};
