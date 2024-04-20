import {useMutation} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIError} from "../../types/base";
import {
  TodayTixHold,
  TodayTixHoldErrorCode,
  TodayTixHoldType,
  TodayTixHoldsReq
} from "../../types/holds";

type PostHoldsVariables = {
  customerId: string;
  showtimeId: number;
  numTickets: number;
};

const postHolds = ({customerId, showtimeId, numTickets}: PostHoldsVariables) =>
  todayTixAPIv2.post<TodayTixHoldsReq, TodayTixHold>(`holds`, {
    customer: customerId,
    showtime: showtimeId,
    numTickets,
    holdType: TodayTixHoldType.Rush
  });

const usePostHolds = () =>
  useMutation<TodayTixHold, TodayTixAPIError, PostHoldsVariables>({
    mutationFn: postHolds,
    retry: (failureCount, error) =>
      /* failureCount < 29 will try the mutation at most 30 times before failing.
      This is because failureCount is the number of previous failures of the hook,
      not current failures. So the first time the hook fails, failureCount=0, so the
      30th time the hook fails, failureCount=29. At this point, the hook should stop
      retrying, i.e. the function below should return false. */
      error.error === TodayTixHoldErrorCode.SEATS_TAKEN && failureCount < 29,
    retryDelay: 0
    // TODO: Invalidate the get holds query here once it has been added
  });

export default usePostHolds;
