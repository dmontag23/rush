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
      error.error === TodayTixHoldErrorCode.SEATS_TAKEN && failureCount < 30,
    retryDelay: 0
    // TODO: Invalidate the get holds query here once it has been added
  });

export default usePostHolds;
