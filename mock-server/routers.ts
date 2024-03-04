import express from "express";

import getShowsRoute from "./getShowsRoute";
import getShowtimesWithRushAvailabilityRoute from "./getShowtimesWithRushAvailabilityRoute";
import postAccessTokensRoute from "./postAccessTokensRoute";
import loginTokensRoute from "./postLoginTokensRoute";

const v2Router = express.Router();
loginTokensRoute(v2Router);
postAccessTokensRoute(v2Router);
getShowsRoute(v2Router);
getShowtimesWithRushAvailabilityRoute(v2Router);

export default v2Router;
