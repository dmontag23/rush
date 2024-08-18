import {useEffect, useMemo} from "react";

import useGetRushGrants from "./todayTixHooks/useGetRushGrants";
import usePostRushGrants from "./todayTixHooks/usePostRushGrants";
import useGetCustomerId from "./useGetCustomerId";

import {TodayTixShow} from "../types/shows";

const useGrantRushAccessForAllShows = (shows: TodayTixShow[]) => {
  const {customerId, isPending: isGetCustomerIdPending} = useGetCustomerId();

  const {
    data: rushGrants,
    isPending: isGetRushGrantsPending,
    isSuccess: isGetRushGrantsSuccess,
    refetch: refetchRushGrants
  } = useGetRushGrants();

  const {
    mutate: grantAccessToShow,
    isPending: isPostRushGrantsPending,
    isSuccess: isPostRushGrantsSuccess,
    isError: isPostRushGrantsError
  } = usePostRushGrants();

  const allGrantedRushShowIds = useMemo(
    () => rushGrants?.map(grant => grant.showId),
    [rushGrants]
  );

  const showIdsToGrantRushAccessTo = useMemo(
    () =>
      isGetRushGrantsSuccess
        ? shows.reduce<number[]>(
            (rushShowIds, {showId}) =>
              showId && !allGrantedRushShowIds?.includes(showId)
                ? [...rushShowIds, showId]
                : rushShowIds,
            []
          )
        : [],
    [allGrantedRushShowIds, isGetRushGrantsSuccess, shows]
  );

  useEffect(() => {
    // grant access to all remaining shows
    showIdsToGrantRushAccessTo.forEach(showId => {
      if (customerId) grantAccessToShow({customerId, showId});
    });
  }, [
    customerId,
    grantAccessToShow,
    isGetRushGrantsSuccess,
    showIdsToGrantRushAccessTo
  ]);

  useEffect(() => {
    if (isPostRushGrantsSuccess || isPostRushGrantsError) refetchRushGrants();
  }, [isPostRushGrantsError, isPostRushGrantsSuccess, refetchRushGrants]);

  return {
    isGrantingAccess:
      isGetCustomerIdPending ||
      isGetRushGrantsPending ||
      isPostRushGrantsPending ||
      /* The condition below ensures that isGrantingAccess is still true between the
      time the current rush grants are received and the post request(s) needed to unlock
      the remaining shows */
      (Boolean(showIdsToGrantRushAccessTo.length) &&
        !(isPostRushGrantsSuccess || isPostRushGrantsError)),
    rushGrants
  };
};

export default useGrantRushAccessForAllShows;
