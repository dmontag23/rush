import React from "react";

import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

import LoggedInBottomTabNavigator from "./LoggedInBottomTabNavigator";

import {HoldContextProvider} from "../../store/hold-context";
import {SelectedShowtimeContextProvider} from "../../store/selected-showtime-context";

const LoggedInScreen = () => (
  <SelectedShowtimeContextProvider>
    <HoldContextProvider>
      <BottomSheetModalProvider>
        <LoggedInBottomTabNavigator />
      </BottomSheetModalProvider>
    </HoldContextProvider>
  </SelectedShowtimeContextProvider>
);

export default LoggedInScreen;
