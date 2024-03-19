import {getStore} from "@netlify/blobs";
import {Router} from "express";

import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";
import {TodayTixRushGrant} from "../types/rushGrants";

const defaultGetRushGrants200Response: TodayTixAPIRes<TodayTixRushGrant[]> = {
  code: 200,
  data: [
    {
      _type: "RushGrant",
      dateGranted: "2024-03-17T21:40:19.841Z",
      showId: 1,
      showName: "SIX the Musical"
    },
    {
      _type: "RushGrant",
      dateGranted: "2024-03-17T21:40:19.841Z",
      showId: 2,
      showName: "Wicked"
    },
    {
      _type: "RushGrant",
      dateGranted: "2024-03-17T21:40:19.841Z",
      showId: 3,
      showName: "Guys & Dolls"
    },
    {
      _type: "RushGrant",
      dateGranted: "2024-03-17T21:40:19.841Z",
      showId: 8547,
      showName: "Tina"
    }
  ],
  pagination: null
};

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

    try {
      const rushGrantsStore = getStore({
        name: "rush-grants",
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
    } catch (error: unknown) {
      console.log(`Netlify error: ${error}. Using default rush grants.`);
      return res.status(200).json(defaultGetRushGrants200Response);
    }
  });

export default getRushGrantsRoute;
