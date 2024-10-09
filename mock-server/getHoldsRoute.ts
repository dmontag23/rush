import {Router} from "express";

import {getItemsFromStore} from "./utils";

import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";
import {TodayTixHold} from "../types/holds";

const getHoldsRoute = (router: Router) =>
  router.get<"/holds", null, TodayTixAPIRes<TodayTixHold[]> | TodayTixAPIError>(
    "/holds",
    (req, res) => {
      const holds = getItemsFromStore<TodayTixHold>("holds");
      return res
        .status(200)
        .json({code: 200, data: holds ?? [], pagination: null});
    }
  );

export default getHoldsRoute;
