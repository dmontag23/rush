import {Request, Response} from "express";

import {clearAllData} from "./netlifyUtils";

const clearAllDataRoute = async (req: Request, res: Response) => {
  await clearAllData();
  return res.sendStatus(200);
};

export default clearAllDataRoute;
