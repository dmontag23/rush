import {Router} from "express";

import {getItemsFromStore} from "./netlifyUtils";

import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";
import {TodayTixHold} from "../types/holds";

const getHoldsRoute = (router: Router) =>
  router.get<"/holds", null, TodayTixAPIRes<TodayTixHold[]> | TodayTixAPIError>(
    "/holds",
    async (req, res) => {
      const holds = await getItemsFromStore<TodayTixHold>("holds");
      return res.status(200).json({code: 200, data: holds, pagination: null});
    }
  );

export default getHoldsRoute;
