import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

import {useNavigation} from "@react-navigation/native";

import SelectedShowtimeContext from "./selected-showtime-context";

import {todayTixAPIv2} from "../api/axiosConfig";
import useScheduleCallback from "../hooks/useScheduleCallback";
import {TodayTixHold, TodayTixHoldType, TodayTixHoldsReq} from "../types/holds";

const HoldContext = createContext<{
  hold?: TodayTixHold;
  setHold: Dispatch<SetStateAction<TodayTixHold | undefined>>;
}>({setHold: () => {}});

export const HoldContextProvider = ({children}: PropsWithChildren) => {
  const {navigate} = useNavigation();
  const {selectedShowtime: showtime, selectedNumberOfTickets: numberOfTickets} =
    useContext(SelectedShowtimeContext);
  const [hold, setHold] = useState<TodayTixHold>();

  const placeHold = useCallback(async () => {
    try {
      if (showtime && numberOfTickets) {
        setHold(
          await todayTixAPIv2.post<TodayTixHoldsReq, TodayTixHold>("holds", {
            showtime: showtime.id,
            // TODO: get the customer id dynamically
            customer: "",
            holdType: TodayTixHoldType.Rush,
            numTickets: numberOfTickets
          })
        );
        navigate("HoldConfirmation");
      }
    } catch (error: unknown) {
      // TODO: Use something other than a console log here to capture the error
      console.log(
        `There was an error placing a hold for ${numberOfTickets} tickets to showtime ${showtime?.id} at ${showtime?.localTime}: `,
        JSON.stringify(error)
      );
    }
  }, [showtime, numberOfTickets, navigate]);

  const {
    scheduleCallback: scheduleHold,
    stopCallbackExecution: stopCallingHoldsEndpoint
  } = useScheduleCallback(placeHold);

  useEffect(() => {
    if (showtime && numberOfTickets && !hold)
      scheduleHold({
        callsPerSecond: 10,
        // Start making requests 1 second before rush tickets are due to open
        runAtEpochTime: showtime?.rushTickets?.availableAfterEpoch ?? 0 - 1
      });
    return stopCallingHoldsEndpoint;
  }, [showtime, numberOfTickets, hold, scheduleHold, stopCallingHoldsEndpoint]);

  return (
    <HoldContext.Provider value={{hold, setHold}}>
      {children}
    </HoldContext.Provider>
  );
};

export default HoldContext;
