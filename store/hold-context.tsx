import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {useNavigation} from "@react-navigation/native";

import SelectedShowtimeContext from "./selected-showtime-context";

import {todayTixAPIv2} from "../api/axiosConfig";
import useGetCustomerId from "../hooks/useGetCustomerId";
import useScheduleCallback from "../hooks/useScheduleCallback";
import {TodayTixHold, TodayTixHoldType, TodayTixHoldsReq} from "../types/holds";
import {TodayTixShowtime} from "../types/showtimes";

const HoldContext = createContext<{
  hold?: TodayTixHold;
  setHold: Dispatch<SetStateAction<TodayTixHold | undefined>>;
}>({setHold: () => {}});

export const HoldContextProvider = ({children}: PropsWithChildren) => {
  const {navigate} = useNavigation();
  const {selectedShowtime: showtime, selectedNumberOfTickets: numberOfTickets} =
    useContext(SelectedShowtimeContext);
  const [hold, setHold] = useState<TodayTixHold>();
  const {customerId} = useGetCustomerId();

  const placeHold = async (
    customer: string,
    holdShowtime: TodayTixShowtime,
    numTickets: number
  ) => {
    try {
      setHold(
        await todayTixAPIv2.post<TodayTixHoldsReq, TodayTixHold>("holds", {
          showtime: holdShowtime.id,
          customer,
          holdType: TodayTixHoldType.Rush,
          numTickets
        })
      );
      navigate("HoldConfirmation");
    } catch (error: unknown) {
      // TODO: Use something other than a console log here to capture the error
      console.log(
        `There was an error placing a hold for ${numberOfTickets} tickets to showtime ${showtime?.id} at ${showtime?.localTime}: `,
        JSON.stringify(error)
      );
    }
  };

  const {
    scheduleCallback: scheduleHold,
    stopCallbackExecution: stopCallingHoldsEndpoint
  } = useScheduleCallback(placeHold, {callsPerSecond: 10});

  useEffect(() => {
    if (customerId && showtime && numberOfTickets && !hold)
      scheduleHold(
        // Start making requests 1 second before rush tickets are due to open
        (showtime?.rushTickets?.availableAfterEpoch ?? 0) - 1,
        customerId,
        showtime,
        numberOfTickets
      );
    return stopCallingHoldsEndpoint;
  }, [
    customerId,
    showtime,
    numberOfTickets,
    hold,
    scheduleHold,
    stopCallingHoldsEndpoint
  ]);

  return (
    <HoldContext.Provider value={{hold, setHold}}>
      {children}
    </HoldContext.Provider>
  );
};

export default HoldContext;
