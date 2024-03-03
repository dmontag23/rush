import {useMutation} from "@tanstack/react-query";
import {todayTixAPI} from "../axiosConfig";
import {
  TodayTixAccessTokensReq,
  TodayTixAccessTokensRes
} from "../types/loginTokens";
import {TodayTixAPIError} from "../types/base";

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
