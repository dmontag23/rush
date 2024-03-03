import express from "express";
import postAccessTokensRoute from "./postAccessTokensRoute";
import loginTokensRoute from "./postLoginTokensRoute";
import getShowsRoute from "./getShowsRoute";
import getShowtimesWithRushAvailabilityRoute from "./getShowtimesWithRushAvailabilityRoute";

const v2Router = express.Router();
loginTokensRoute(v2Router);
postAccessTokensRoute(v2Router);
getShowsRoute(v2Router);
getShowtimesWithRushAvailabilityRoute(v2Router);

export default v2Router;
