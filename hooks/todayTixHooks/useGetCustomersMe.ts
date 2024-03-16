import {useQuery} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIError} from "../../types/base";
import {TodayTixCustomer} from "../../types/customer";

const getCurrentCustomer = () =>
  todayTixAPIv2.get<TodayTixCustomer>("customers/me");

type UseGetCustomersMeProps = {
  enabled?: boolean;
};

const useGetCustomersMe = ({enabled}: UseGetCustomersMeProps = {}) =>
  useQuery<TodayTixCustomer, TodayTixAPIError>({
    queryKey: ["customer"],
    queryFn: getCurrentCustomer,
    enabled
  });

export default useGetCustomersMe;
