import express from "express";

import getCustomersMeRoute from "./getCustomersMeRoute";
import getRushGrantsRoute from "./getRushGrantsRoute";
import getShowsRoute from "./getShowsRoute";
import getShowtimesWithRushAvailabilityRoute from "./getShowtimesWithRushAvailabilityRoute";
import postHoldsRoute from "./postHoldsRoute";
import postRushGrantsRoute from "./postRushGrantsRoute";
import postTokenRoute from "./postTokenRoute";

export const oauthRouter = express.Router();
postTokenRoute(oauthRouter);

export const v2Router = express.Router();
getCustomersMeRoute(v2Router);
getRushGrantsRoute(v2Router);
getShowsRoute(v2Router);
getShowtimesWithRushAvailabilityRoute(v2Router);
postHoldsRoute(v2Router);
postRushGrantsRoute(v2Router);
