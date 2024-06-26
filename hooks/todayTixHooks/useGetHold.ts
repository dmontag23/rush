import {useQuery} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIError} from "../../types/base";
import {TodayTixHold} from "../../types/holds";

const getHold = async () => {
  const holds = await todayTixAPIv2.get<TodayTixHold[]>("holds");
  // It seems TodayTix only ever lets you have one hold at a time
  return holds[0] ?? null;
};

const useGetHold = () =>
  useQuery<TodayTixHold, TodayTixAPIError>({
    queryKey: ["holds"],
    queryFn: getHold
  });

export default useGetHold;
