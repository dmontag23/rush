import {useQuery} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIError} from "../../types/base";
import {TodayTixRushGrant} from "../../types/rushGrants";

const getRushGrants = () =>
  todayTixAPIv2.get<TodayTixRushGrant[]>("customers/me/rushGrants");

const useGetRushGrants = () =>
  useQuery<TodayTixRushGrant[], TodayTixAPIError>({
    queryKey: ["rushGrants"],
    queryFn: getRushGrants
  });

export default useGetRushGrants;
