import {useMutation, useQueryClient} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIError} from "../../types/base";
import {
  TodayTixHold,
  TodayTixHoldErrorCode,
  TodayTixHoldType,
  TodayTixHoldsReq
} from "../../types/holds";

export type PostHoldsVariables = {
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

const usePostHolds = () => {
  const queryClient = useQueryClient();

  return useMutation<TodayTixHold, TodayTixAPIError, PostHoldsVariables>({
    mutationFn: postHolds,
    retry: (failureCount, error) =>
      /* failureCount < 59 will try the mutation at most 60 times before failing.
      This is because failureCount is the number of previous failures of the hook,
      not current failures. So the first time the hook fails, failureCount=0, so the
      60th time the hook fails, failureCount=59. At this point, the hook should stop
      retrying, i.e. the function below should return false. */
      error.error === TodayTixHoldErrorCode.SEATS_TAKEN && failureCount < 59,
    retryDelay: 0,
    // Only refetch the holds on a successful post call
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["holds"]
      });
    }
  });
};

export default usePostHolds;
