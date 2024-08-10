import React from "react";

import LoggedInBottomTabNavigator from "./LoggedInBottomTabNavigator";

import LoadingSpinner from "../ui/LoadingSpinner";

import useGetShows from "../../hooks/todayTixHooks/useGetShows";
import {TodayTixFieldset, TodayTixLocation} from "../../types/shows";

/* This component is only used to lift the show state so that shows are not
re-fetched when changing screens. If shows should be re-fetched, this component
should be removed. */
const LoggedInScreen = () => {
  const {data: rushAndLotteryShows, isPending: isLoadingRushAndLotteryShows} =
    useGetShows({
      areAccessProgramsActive: true,
      fieldset: TodayTixFieldset.Summary,
      limit: 10000,
      location: TodayTixLocation.London
    });

  return isLoadingRushAndLotteryShows ? (
    <LoadingSpinner />
  ) : (
    <LoggedInBottomTabNavigator shows={rushAndLotteryShows ?? []} />
  );
};

export default LoggedInScreen;
