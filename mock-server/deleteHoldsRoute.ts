import {Router} from "express";

import {removeItemFromStore} from "./utils";

import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";

type DeleteHoldsRouteParams = {
  holdId: string;
};

const deleteHoldsRoute = (router: Router) =>
  router.delete<
    "/holds/:holdId",
    DeleteHoldsRouteParams,
    TodayTixAPIRes<{}> | TodayTixAPIError
  >("/holds/:holdId", (req, res) => {
    removeItemFromStore("holds", req.params.holdId);
    res.json({code: 200, data: {}});
  });

export default deleteHoldsRoute;
