import {useMutation} from "@tanstack/react-query";

import {todayTixAPI} from "../axiosConfig";
import {TodayTixAPIError} from "../types/base";
import {
  TodayTixAccessTokensReq,
  TodayTixAccessTokensRes
} from "../types/loginTokens";

const exchangeCodeForTokens = async (code: string) =>
  todayTixAPI.post<TodayTixAccessTokensReq, TodayTixAccessTokensRes>(
    "accessTokens",
    {code, grantType: "authorizationCode", scope: "customer"}
  );

const usePostCodeForAccessTokens = () =>
  useMutation<TodayTixAccessTokensRes, TodayTixAPIError, string>({
    mutationFn: exchangeCodeForTokens
  });

export default usePostCodeForAccessTokens;
