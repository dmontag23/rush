import express from "express";

import getCustomersMeRoute from "./getCustomersMeRoute";
import getShowsRoute from "./getShowsRoute";
import getShowtimesWithRushAvailabilityRoute from "./getShowtimesWithRushAvailabilityRoute";
import postHoldsRoute from "./postHoldsRoute";
import postTokenRoute from "./postTokenRoute";

export const oauthRouter = express.Router();
postTokenRoute(oauthRouter);

export const v2Router = express.Router();
postHoldsRoute(v2Router);
getCustomersMeRoute(v2Router);
getShowsRoute(v2Router);
getShowtimesWithRushAvailabilityRoute(v2Router);
