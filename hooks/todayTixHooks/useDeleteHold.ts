import {useMutation, useQueryClient} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIError} from "../../types/base";

const deleteHold = (holdId: number) =>
  todayTixAPIv2.delete<{}>(`holds/${holdId}`);

const useDeleteHold = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, TodayTixAPIError, number>({
    mutationFn: deleteHold,
    // Always refetch the holds after success or error
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["holds"]
      });
    }
  });
};

export default useDeleteHold;
