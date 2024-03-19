import {useEffect} from "react";

import useGetAuthTokens from "./asyncStorageHooks/useGetAuthTokens";
import useGetRushGrants from "./todayTixHooks/useGetRushGrants";
import usePostRushGrants from "./todayTixHooks/usePostRushGrants";
import useGetCustomerId from "./useGetCustomerId";

import {TodayTixShow} from "../types/shows";

const useGrantRushAccessForAllShows = (shows: TodayTixShow[]) => {
  const {data: authTokens, isPending: isGetAuthTokensPending} =
    useGetAuthTokens();
  const {customerId, isPending: isGetCustomerIdPending} = useGetCustomerId();

  const {
    data: rushGrants,
    isPending: isGetRushGrantsPending,
    isSuccess: isGetRushGrantsSuccess
  } = useGetRushGrants({
    enabled: Boolean(authTokens?.accessToken && authTokens.refreshToken)
  });

  const {mutate: grantAccessToShow, isPending: isPostRushGrantsPending} =
    usePostRushGrants();

  /* TODO: Note that there is a brief period where isPending for the whole hook will be false but the whole
  hook is technically still loading because it needs to grant access for the shows, but the mutation function 
  in this useEffect call hasn't been triggered yet. Come back to handle this in a clever way so the hook always 
  returns the right pending state */
  useEffect(() => {
    // grant access to all remaining shows
    if (customerId && isGetRushGrantsSuccess) {
      const allGrantedRushShowIds = rushGrants.map(grant => grant.showId);
      shows.forEach(({showId}) => {
        if (showId && !allGrantedRushShowIds.includes(showId))
          grantAccessToShow({customerId, showId});
      });
    }
  }, [
    customerId,
    isGetRushGrantsSuccess,
    rushGrants,
    shows,
    grantAccessToShow
  ]);

  return {
    isGrantingAccess:
      isGetAuthTokensPending ||
      isGetCustomerIdPending ||
      isGetRushGrantsPending ||
      isPostRushGrantsPending
  };
};

export default useGrantRushAccessForAllShows;
