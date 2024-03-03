import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState
} from "react";
import {TodayTixShowtime} from "../types/showtimes";

const SelectedShowtimeContext = createContext<{
  selectedShowtime?: TodayTixShowtime;
  selectedNumberOfTickets?: number;
  setSelectedShowtime: Dispatch<SetStateAction<TodayTixShowtime | undefined>>;
  setSelectedNumberOfTickets: Dispatch<SetStateAction<number>>;
}>({setSelectedShowtime: () => {}, setSelectedNumberOfTickets: () => {}});

export const SelectedShowtimeContextProvider = ({
  children
}: PropsWithChildren) => {
  const [showtime, setShowtime] = useState<TodayTixShowtime>();
  const [numberOfTickets, setNumberOfTickets] = useState(NaN);

  return (
    <SelectedShowtimeContext.Provider
      value={{
        selectedShowtime: showtime,
        selectedNumberOfTickets: numberOfTickets,
        setSelectedShowtime: setShowtime,
        setSelectedNumberOfTickets: setNumberOfTickets
      }}>
      {children}
    </SelectedShowtimeContext.Provider>
  );
};

export default SelectedShowtimeContext;
