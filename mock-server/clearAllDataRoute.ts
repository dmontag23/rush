import {getStore} from "@netlify/blobs";
import {Request, Response} from "express";

const clearAllDataRoute = async (req: Request, res: Response) => {
  try {
    const rushGrantsStore = getStore({
      name: "rush-grants",
      edgeURL: process.env.NETLIFY_SITE_URL,
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_KEY
    });

    const {blobs: rushGrantsInStore} = await rushGrantsStore.list();
    await Promise.all(
      rushGrantsInStore.map(
        async grant => await rushGrantsStore.delete(grant.key)
      )
    );
    return res.sendStatus(200);
  } catch (error: unknown) {
    const errorMessage = `There was an error clearing rush grants from Netlify: ${error}`;
    console.log(errorMessage);
    return res.status(500).json({error: errorMessage});
  }
};

export default clearAllDataRoute;
