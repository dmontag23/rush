import {Router} from "express";

import {writeItemToStore} from "./netlifyUtils";

import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";
import {TodayTixRushGrant, TodayTixRushGrantsReq} from "../types/rushGrants";

type RouteParams = {
  customerId: string;
};

const postRushGrants401Response: TodayTixAPIError = {
  code: 401,
  error: "UnauthenticatedException",
  context: null,
  title: "Error",
  message:
    "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
};

const postRushGrantsRoute = (router: Router) =>
  router.post<
    "/customers/:customerId/rushGrants",
    RouteParams,
    TodayTixAPIRes<TodayTixRushGrant> | TodayTixAPIError,
    TodayTixRushGrantsReq
  >("/customers/:customerId/rushGrants", async (req, res) => {
    if (req.body.showId === 4)
      return res.status(401).json(postRushGrants401Response);

    const newRushGrant: TodayTixRushGrant = {
      _type: "RushGrant",
      dateGranted: new Date().toISOString(),
      showId: req.body.showId,
      showName: `Show for ${req.params.customerId}`
    };

    const rushGrantToReturn = await writeItemToStore(
      "rush-grants",
      req.body.showId.toString(),
      newRushGrant
    );

    return res.status(201).json({
      code: 201,
      data: rushGrantToReturn
    });
  });

export default postRushGrantsRoute;
