import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect
} from "react";

import {useNavigation} from "@react-navigation/native";

import SelectedShowtimeContext from "./selected-showtime-context";

import usePostHolds from "../hooks/todayTixHooks/usePostHolds";
import useGetCustomerId from "../hooks/useGetCustomerId";
import useScheduleCallback from "../hooks/useScheduleCallback";
import {TodayTixAPIError} from "../types/base";
import {TodayTixHold} from "../types/holds";

const HoldContext = createContext<{
  isHoldScheduled: boolean;
  isPlacingHold: boolean;
  isHoldError: boolean;
  holdError: TodayTixAPIError | null;
  hold?: TodayTixHold;
  retry: () => void;
}>({
  isHoldScheduled: false,
  isPlacingHold: false,
  isHoldError: false,
  holdError: null,
  retry: () => {}
});

export const HoldContextProvider = ({children}: PropsWithChildren) => {
  const {navigate} = useNavigation();
  const {selectedShowtime: showtime, selectedNumberOfTickets: numberOfTickets} =
    useContext(SelectedShowtimeContext);
  // TODO: get the initial holds from the TodayTix API to populate here
  const {customerId} = useGetCustomerId();
  const {
    mutate: placeHold,
    data: hold,
    isPending: isPlacingHold,
    isError: isHoldError,
    error: holdError,
    reset: resetHoldState
  } = usePostHolds();

  const {
    scheduleCallback: scheduleHold,
    cancelScheduledExecution: cancelScheduledHold,
    isScheduled: isHoldScheduled
  } = useScheduleCallback(placeHold);

  useEffect(() => {
    if (
      customerId &&
      showtime &&
      numberOfTickets &&
      !(hold || isPlacingHold || isHoldError)
    )
      scheduleHold(
        // Start making requests 1 second before rush tickets are due to open
        (showtime?.rushTickets?.availableAfterEpoch ?? 0) - 1,
        {customerId, showtimeId: showtime.id, numTickets: numberOfTickets}
      );
    return cancelScheduledHold;
  }, [
    customerId,
    showtime,
    numberOfTickets,
    hold,
    isPlacingHold,
    scheduleHold,
    cancelScheduledHold,
    isHoldError
  ]);

  useEffect(() => {
    if (hold) navigate("HoldConfirmation");
  }, [hold, navigate]);

  useEffect(() => {
    if (customerId && showtime && !hold) resetHoldState();
  }, [customerId, hold, numberOfTickets, resetHoldState, showtime]);

  return (
    <HoldContext.Provider
      value={{
        isHoldScheduled,
        isPlacingHold,
        isHoldError,
        holdError,
        hold,
        retry: resetHoldState
      }}>
      {children}
    </HoldContext.Provider>
  );
};

export default HoldContext;
