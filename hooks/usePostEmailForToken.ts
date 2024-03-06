import {useMutation} from "@tanstack/react-query";

import {todayTixAPIv2} from "../api/axiosConfig";
import {TodayTixAPIError} from "../types/base";
import {TodayTixLoginReq, TodayTixLoginRes} from "../types/loginTokens";

const sendEmail = async (emailAddress: string) =>
  todayTixAPIv2.post<TodayTixLoginReq, TodayTixLoginRes>("loginTokens", {
    email: emailAddress
  });

const usePostEmailForToken = () =>
  useMutation<TodayTixLoginRes, TodayTixAPIError, string>({
    mutationFn: sendEmail
  });

export default usePostEmailForToken;
