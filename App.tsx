import React from "react";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {PaperProvider} from "react-native-paper";
import FlipperAsyncStorage from "rn-flipper-async-storage-advanced";

import RootNavigator from "./components/screens/RootNavigator";
import {SelectedShowtimeContextProvider} from "./store/selected-showtime-context";
import {LIGHT_THEME} from "./themes";

const QUERY_CLIENT = new QueryClient();

const App = () => (
  <QueryClientProvider client={QUERY_CLIENT}>
    <SelectedShowtimeContextProvider>
      {/* PaperProvider should be the innermost provider for the app. See
       https://callstack.github.io/react-native-paper/docs/guides/getting-started */}
      <PaperProvider theme={LIGHT_THEME}>
        <RootNavigator />
        {/* Needed to debug async storage on Flipper. 
         See https://github.com/lbaldy/flipper-plugin-async-storage-advanced */}
        {__DEV__ && !process.env.JEST_WORKER_ID && <FlipperAsyncStorage />}
      </PaperProvider>
    </SelectedShowtimeContextProvider>
  </QueryClientProvider>
);

export default App;
