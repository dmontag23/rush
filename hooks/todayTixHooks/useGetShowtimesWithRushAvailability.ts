import {useQueries} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixShowtime} from "../../types/showtimes";

const getShowtimesWithRushAvailability = (showId: number) =>
  todayTixAPIv2.get<TodayTixShowtime[]>(
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
