import {Router} from "express";
import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";
import {
  TodayTixAccessTokensReq,
  TodayTixAccessTokensRes
} from "../types/loginTokens";

const postAccessTokens201Response: TodayTixAPIRes<TodayTixAccessTokensRes> = {
  code: 201,
  data: {
    _type: "AccessToken",
    accessToken: "access-token",
    tokenType: "Bearer",
    scope: "customer",
    refreshToken: "refresh-token",
    expiresIn: 1800
  }
};

const postAccessTokens404Response: TodayTixAPIError = {
  code: 404,
  error: "MissingResource",
  context: null,
  title: "MissingResource",
  message:
    "No login token found. Try logging in again or contact TodayTix Support if the issue persists."
};

const postAccessTokensRoute = (router: Router) =>
  router.post<
    "/accessTokens",
    null,
    TodayTixAPIRes<TodayTixAccessTokensRes> | TodayTixAPIError,
    TodayTixAccessTokensReq
  >("/accessTokens", (req, res) => {
    if (req.body.code === "good-code") {
      return res.status(201).json(postAccessTokens201Response);
    }

    return res.status(404).json(postAccessTokens404Response);
  });

export default postAccessTokensRoute;
