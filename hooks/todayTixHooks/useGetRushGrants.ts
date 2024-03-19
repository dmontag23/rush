import {useQuery} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIError} from "../../types/base";
import {TodayTixRushGrant} from "../../types/rushGrants";

const getRushGrants = () =>
  todayTixAPIv2.get<TodayTixRushGrant[]>("customers/me/rushGrants");

type UseGetRushGrantsProps = {
  enabled?: boolean;
};

const useGetRushGrants = ({enabled}: UseGetRushGrantsProps = {}) =>
  useQuery<TodayTixRushGrant[], TodayTixAPIError>({
    queryKey: ["rushGrants"],
    queryFn: getRushGrants,
    enabled
  });

export default useGetRushGrants;
