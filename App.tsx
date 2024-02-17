import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {LIGHT_THEME} from './themes';
import RootNavigator from './components/screens/RootNavigator';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const QUERY_CLIENT = new QueryClient();

const App = () => (
  <QueryClientProvider client={QUERY_CLIENT}>
    {/* PaperProvider should be the innermost provider for the app. See
    https://callstack.github.io/react-native-paper/docs/guides/getting-started */}
    <PaperProvider theme={LIGHT_THEME}>
      <RootNavigator />
    </PaperProvider>
  </QueryClientProvider>
);

export default App;
