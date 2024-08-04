import React, {useEffect} from "react";
import {AppState, AppStateStatus, Platform} from "react-native";

import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager
} from "@tanstack/react-query";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {PaperProvider, adaptNavigationTheme} from "react-native-paper";

import RootNavigator from "./components/screens/RootNavigator";
import {HoldContextProvider} from "./store/hold-context";
import {SelectedShowtimeContextProvider} from "./store/selected-showtime-context";
import {LIGHT_THEME} from "./themes";

const QUERY_CLIENT = new QueryClient();

const {LightTheme: NAV_LIGHT_THEME} = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: LIGHT_THEME
});

const App = () => {
  /* refetch any queries anytime the user leaves the app and then returns
  see https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching */
  const onAppStateChange = (status: AppStateStatus) => {
    if (Platform.OS !== "web") focusManager.setFocused(status === "active");
  };

  useEffect(() => {
    const {remove} = AppState.addEventListener("change", onAppStateChange);
    return remove;
  }, []);

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={QUERY_CLIENT}>
        <NavigationContainer theme={NAV_LIGHT_THEME}>
          <SelectedShowtimeContextProvider>
            <HoldContextProvider>
              {/* PaperProvider should be the innermost provider for the app (except 
              for the bottom sheet, which needs access to the theme for styling). See
              https://callstack.github.io/react-native-paper/docs/guides/getting-started */}
              <PaperProvider theme={LIGHT_THEME}>
                <BottomSheetModalProvider>
                  <RootNavigator />
                </BottomSheetModalProvider>
              </PaperProvider>
            </HoldContextProvider>
          </SelectedShowtimeContextProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
