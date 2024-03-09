import {Router} from "express";

import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";
import {TodayTixLoginReq, TodayTixLoginRes} from "../types/loginTokens";

const postLoginTokens201Response: TodayTixAPIRes<TodayTixLoginRes> = {
  code: 201,
  data: {}
};

const postLoginTokens400Response: TodayTixAPIError = {
  code: 400,
  error: "InvalidParameter",
  context: {
    parameterName: null,
    internalMessage: "Please enter a valid email"
  },
  title: "Error",
  message: "Please enter a valid email"
};

const postLoginTokensRoute = (router: Router) =>
  router.post<
    "/loginTokens",
    null,
    TodayTixAPIRes<TodayTixLoginRes> | TodayTixAPIError,
    TodayTixLoginReq
  >("/loginTokens", (req, res) => {
    if (req.body.email === "good@gmail.com") {
      return res.status(201).json(postLoginTokens201Response);
    }
    return res.status(400).json(postLoginTokens400Response);
  });

export default postLoginTokensRoute;
