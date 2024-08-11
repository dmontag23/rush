import React from "react";
import {StyleSheet, View} from "react-native";

import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

import LoggedInBottomTabNavigator from "./LoggedInBottomTabNavigator";

import LoadingSpinner from "../ui/LoadingSpinner";

import useGetShows from "../../hooks/todayTixHooks/useGetShows";
import {HoldContextProvider} from "../../store/hold-context";
import {SelectedShowtimeContextProvider} from "../../store/selected-showtime-context";
import {TodayTixFieldset, TodayTixLocation} from "../../types/shows";

const LoggedInScreen = () => {
  /* The show state is lifted to this component so that shows are not
  re-fetched when changing screens. If shows should be re-fetched, move this state down
  to the respective components that need it. */
  const {data: rushAndLotteryShows, isPending: isLoadingRushAndLotteryShows} =
    useGetShows({
      areAccessProgramsActive: true,
      fieldset: TodayTixFieldset.Summary,
      limit: 10000,
      location: TodayTixLocation.London
    });

  return isLoadingRushAndLotteryShows ? (
    <View style={styles.loadingSpinnerContainer}>
      <LoadingSpinner size="large" />
    </View>
  ) : (
    <SelectedShowtimeContextProvider>
      <HoldContextProvider>
        <BottomSheetModalProvider>
          <LoggedInBottomTabNavigator shows={rushAndLotteryShows ?? []} />
        </BottomSheetModalProvider>
      </HoldContextProvider>
    </SelectedShowtimeContextProvider>
  );
};

export default LoggedInScreen;

const styles = StyleSheet.create({
  loadingSpinnerContainer: {flex: 1, justifyContent: "center"}
});
