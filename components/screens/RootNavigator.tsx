import React from "react";

import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {adaptNavigationTheme} from "react-native-paper";

import RushShowList from "./RushShowList";
import EnterTokensScreen from "./authentication/EnterTokensScreen";

import ShowDetails from "../ShowDetails/ShowDetails";
import TodayTixLogoOnBackground from "../TodayTixLogoOnBackground";

import useGetAuthTokens from "../../hooks/useGetAuthTokens";
import useGetShows from "../../hooks/useGetShows";
import useGetShowtimesWithRushAvailability from "../../hooks/useGetShowtimesWithRushAvailability";
import {LIGHT_THEME} from "../../themes";
import {
  TodayTixFieldset,
  TodayTixLocation,
  TodayTixShow
} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

type ShowAndShowtimes = {
  show: TodayTixShow;
  showtimes: TodayTixShowtime[];
};

export type RootStack = {
  RushShowList: {
    showsAndTimes: ShowAndShowtimes[];
  };
  ShowDetails: ShowAndShowtimes;
  EnterTokens: undefined;
};
const Stack = createStackNavigator<RootStack>();

const {LightTheme: NAV_LIGHT_THEME} = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: LIGHT_THEME
});

const RootNavigator = () => {
  const {data, isPending: isLoadingTokens} = useGetAuthTokens();
  const accessToken = data?.accessToken;
  const refreshToken = data?.refreshToken;

  const {data: rushAndLotteryShows, isPending: isLoadingRushAndLotteryShows} =
    useGetShows({
      areAccessProgramsActive: true,
      fieldset: TodayTixFieldset.Summary,
      limit: 10000,
      location: TodayTixLocation.London
    });

  const rushShows = (rushAndLotteryShows ?? []).filter(
    show => show.isRushActive
  );

  const {data: rushShowtimes, isPending: isLoadingRushShowtimes} =
    useGetShowtimesWithRushAvailability({
      showIds: rushShows.map(show => show.id)
    });

  if (isLoadingTokens || isLoadingRushAndLotteryShows || isLoadingRushShowtimes)
    return <TodayTixLogoOnBackground />;

  return (
    <NavigationContainer theme={NAV_LIGHT_THEME}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {accessToken && refreshToken ? (
          <>
            <Stack.Screen
              name="RushShowList"
              component={RushShowList}
              initialParams={{
                showsAndTimes: rushShows.map((show, i) => ({
                  show,
                  showtimes: rushShowtimes[i] ?? []
                }))
              }}
            />
            <Stack.Screen name="ShowDetails" component={ShowDetails} />
          </>
        ) : (
          <Stack.Screen name="EnterTokens" component={EnterTokensScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
