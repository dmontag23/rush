import React from "react";

import {createStackNavigator} from "@react-navigation/stack";

import HoldConfirmation from "./HoldConfirmation";
import RushShowList from "./RushShowList";
import EnterTokensScreen from "./authentication/EnterTokensScreen";

import LogoOnBackground from "../LogoOnBackground";
import ShowDetails from "../ShowDetails/ShowDetails";

import useGetAuthTokens from "../../hooks/asyncStorageHooks/useGetAuthTokens";
import useGetShows from "../../hooks/todayTixHooks/useGetShows";
import useGetShowtimesWithRushAvailability from "../../hooks/todayTixHooks/useGetShowtimesWithRushAvailability";
import {RootStackParamList} from "../../types/navigation";
import {TodayTixFieldset, TodayTixLocation} from "../../types/shows";

const Stack = createStackNavigator<RootStackParamList>();

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
    return <LogoOnBackground />;

  return (
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
          <Stack.Screen name="HoldConfirmation" component={HoldConfirmation} />
        </>
      ) : (
        <Stack.Screen name="EnterTokens" component={EnterTokensScreen} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
