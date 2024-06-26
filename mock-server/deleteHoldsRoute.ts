import {Router} from "express";

import {removeItemFromStore} from "./netlifyUtils";

import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";

type DeleteHoldsRouteParams = {
  holdId: string;
};

const deleteHoldsRoute = (router: Router) =>
  router.delete<
    "/holds/:holdId",
    DeleteHoldsRouteParams,
    TodayTixAPIRes<{}> | TodayTixAPIError
  >("/holds/:holdId", async (req, res) => {
    await removeItemFromStore("holds", req.params.holdId);

    return res.status(200).json({code: 200, data: {}});
  });

export default deleteHoldsRoute;
