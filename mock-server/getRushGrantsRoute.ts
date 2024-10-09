import {Router} from "express";

import {getItemsFromStore} from "./utils";

import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";
import {TodayTixRushGrant} from "../types/rushGrants";

const getRushGrants401Response: TodayTixAPIError = {
  code: 401,
  error: "UnauthenticatedException",
  context: null,
  title: "Error",
  message:
    "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
};

const getRushGrantsRoute = (router: Router) =>
  router.get<
    "/customers/me/rushGrants",
    null,
    TodayTixAPIRes<TodayTixRushGrant[]> | TodayTixAPIError
  >("/customers/me/rushGrants", (req, res) => {
    if (req.headers["return-status"] === "401")
      return res.status(401).json(getRushGrants401Response);

    const rushGrants = getItemsFromStore<TodayTixRushGrant>("rush-grants");

    return res
      .status(200)
      .json({code: 200, data: rushGrants ?? [], pagination: null});
  });

export default getRushGrantsRoute;
