import {useMutation} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIError} from "../../types/base";
import {TodayTixRushGrant, TodayTixRushGrantsReq} from "../../types/rushGrants";

type PostRushGrantsVariables = {
  customerId: string;
  showId: number;
};

const postRushGrant = ({customerId, showId}: PostRushGrantsVariables) =>
  todayTixAPIv2.post<TodayTixRushGrantsReq, TodayTixRushGrant>(
    `customers/${customerId}/rushGrants`,
    {showId}
  );

const usePostRushGrants = () =>
  useMutation<TodayTixRushGrant, TodayTixAPIError, PostRushGrantsVariables>({
    mutationFn: postRushGrant
    /* The rushGrants query is not invalidated here because, when granting access to many shows at one time,
      the query invalidation would be run for each mutate function that resolves. This could lead to several
      re-fetches of the rush grants, which is not ideal at best. For an example, 
      see the useGrantRushAccessForAllShows hook */
  });

export default usePostRushGrants;
