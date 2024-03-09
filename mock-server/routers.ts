import express from "express";

import getShowsRoute from "./getShowsRoute";
import getShowtimesWithRushAvailabilityRoute from "./getShowtimesWithRushAvailabilityRoute";
import postAccessTokensRoute from "./postAccessTokensRoute";
import postHoldsRoute from "./postHoldsRoute";
import postLoginTokensRoute from "./postLoginTokensRoute";
import tokenRoute from "./postTokenRoute";

export const oauthRouter = express.Router();
tokenRoute(oauthRouter);

export const v2Router = express.Router();
postAccessTokensRoute(v2Router);
postHoldsRoute(v2Router);
postLoginTokensRoute(v2Router);
getShowsRoute(v2Router);
getShowtimesWithRushAvailabilityRoute(v2Router);
