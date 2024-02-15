import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {LIGHT_THEME} from './themes';
import RootNavigator from './components/screens/RootNavigator';

const App = () => (
  /* PaperProvider should be the innermost provider for the app.
     See https://callstack.github.io/react-native-paper/docs/guides/getting-started */
  <PaperProvider theme={LIGHT_THEME}>
    <RootNavigator />
  </PaperProvider>
);

export default App;
