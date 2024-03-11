import express from "express";

import getShowsRoute from "./getShowsRoute";
import getShowtimesWithRushAvailabilityRoute from "./getShowtimesWithRushAvailabilityRoute";
import postHoldsRoute from "./postHoldsRoute";
import tokenRoute from "./postTokenRoute";

export const oauthRouter = express.Router();
tokenRoute(oauthRouter);

export const v2Router = express.Router();
postHoldsRoute(v2Router);
getShowsRoute(v2Router);
getShowtimesWithRushAvailabilityRoute(v2Router);
