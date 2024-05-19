import {getStore} from "@netlify/blobs";
import {Router} from "express";

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
  >("/customers/me/rushGrants", async (req, res) => {
    if (req.headers["return-status"] === "401")
      return res.status(401).json(getRushGrants401Response);

    const rushGrantsStore = getStore({
      name: "rush-grants",
      edgeURL: process.env.NETLIFY_SITE_URL,
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_KEY
    });

    const {blobs: rushGrantsInStore} = await rushGrantsStore.list();
    const rushGrants = await Promise.all<TodayTixRushGrant>(
      rushGrantsInStore.map(
        async grant => await rushGrantsStore.get(grant.key, {type: "json"})
      )
    );

    return res
      .status(200)
      .json({code: 200, data: rushGrants, pagination: null});
  });

export default getRushGrantsRoute;
