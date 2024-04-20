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
import {TodayTixHold} from "../types/holds";

const HoldContext = createContext<{
  hold?: TodayTixHold;
}>({});

export const HoldContextProvider = ({children}: PropsWithChildren) => {
  const {navigate} = useNavigation();
  const {selectedShowtime: showtime, selectedNumberOfTickets: numberOfTickets} =
    useContext(SelectedShowtimeContext);
  // TODO: get the initial holds from the TodayTix API to populate here
  const {customerId} = useGetCustomerId();
  const {
    mutate: placeHold,
    data: hold,
    isPending: isPlacingHold
  } = usePostHolds();

  const {
    scheduleCallback: scheduleHold,
    cancelScheduledExecution: cancelScheduledHold
  } = useScheduleCallback(placeHold);

  useEffect(() => {
    if (customerId && showtime && numberOfTickets && !(hold || isPlacingHold))
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
    cancelScheduledHold
  ]);

  useEffect(() => {
    if (hold) navigate("HoldConfirmation");
  }, [hold, navigate]);

  return <HoldContext.Provider value={{hold}}>{children}</HoldContext.Provider>;
};

export default HoldContext;
