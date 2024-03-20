import {beforeEach} from "@jest/globals";
import {getStore} from "@netlify/blobs";

beforeEach(async () => {
  // this is necessary in order to clear async storage before each test
  await device.uninstallApp();
  await device.installApp();
  await device.launchApp();

  // delete all data from Netlify
  try {
    const rushGrantsStore = getStore({
      name: "rush-grants",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_KEY
    });

    const {blobs: rushGrantsInStore} = await rushGrantsStore.list();
    await Promise.all(
      rushGrantsInStore.map(
        async grant => await rushGrantsStore.delete(grant.key)
      )
    );
  } catch (error: unknown) {
    console.log(`There was an error deleting data from Netlify: ${error}`);
  }
});
