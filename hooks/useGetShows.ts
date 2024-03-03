import {useQuery} from "@tanstack/react-query";
import {todayTixAPI} from "../axiosConfig";
import {
  TodayTixFieldset,
  TodayTixLocation,
  TodayTixShow,
  TodayTixShowsReqQueryParams
} from "../types/shows";
import {TodayTixAPIError} from "../types/base";

const getShows = async (
  areAccessProgramsActive?: boolean,
  fieldset?: TodayTixFieldset,
  limit?: number,
  location?: TodayTixLocation,
  offset?: number
) => {
  const queryParams = [
    areAccessProgramsActive && "areAccessProgramsActive=1",
    fieldset && `fieldset=${fieldset}`,
    limit && `limit=${limit}`,
    location && `location=${location}`,
    offset && `offset=${offset}`
  ]
    .filter(param => param)
    .join("&");
  return todayTixAPI.get<TodayTixShow[]>(
    `shows${queryParams ? `?${queryParams}` : ""}`
  );
};

const useGetShows = ({
  areAccessProgramsActive,
  fieldset,
  limit,
  location,
  offset
}: TodayTixShowsReqQueryParams = {}) =>
  useQuery<TodayTixShow[], TodayTixAPIError>({
    queryKey: [
      "shows",
      areAccessProgramsActive,
      fieldset,
      limit,
      location,
      offset
    ],
    queryFn: () =>
      getShows(areAccessProgramsActive, fieldset, limit, location, offset)
  });

export default useGetShows;
