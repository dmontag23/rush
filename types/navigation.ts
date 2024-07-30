// This file was created following https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
import type {StackScreenProps} from "@react-navigation/stack";

import {TodayTixShow} from "./shows";
import {TodayTixShowtime} from "./showtimes";

type ShowAndShowtimes = {
  show: TodayTixShow;
  showtimes: TodayTixShowtime[];
};

export type RootStackParamList = {
  RushShowList: {
    showsAndTimes: ShowAndShowtimes[];
  };
  ShowDetails: ShowAndShowtimes;
  EnterTokens: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
