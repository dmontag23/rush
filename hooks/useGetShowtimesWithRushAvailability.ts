import {useQueries} from "@tanstack/react-query";

import {todayTixAPI} from "../axiosConfig";
import {TodayTixShowtime} from "../types/showtimes";

const getShowtimesWithRushAvailability = async (showId: number) =>
  todayTixAPI.get<TodayTixShowtime[]>(
    `shows/${showId}/showtimes/with_rush_availability`
  );

type UseGetShowtimesWithRushAvailabilityProps = {
  showIds: number[];
};

const useGetShowtimesWithRushAvailability = ({
  showIds
}: UseGetShowtimesWithRushAvailabilityProps) =>
  useQueries({
    queries: showIds.map(showId => ({
      queryKey: ["showtimesWithRushAvailability", showId],
      queryFn: () => getShowtimesWithRushAvailability(showId)
    })),
    combine: results => ({
      data: results.map(result => result.data),
      isPending: results.some(result => result.isPending)
    })
  });

export default useGetShowtimesWithRushAvailability;
