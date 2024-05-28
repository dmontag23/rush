import {beforeEach} from "@jest/globals";
import {config} from "dotenv";

import {clearAllMockServerData} from "./utils";

config({path: `mock-server/.env.${process.env.NODE_ENV}`});

beforeEach(async () => {
  // this is necessary in order to clear async storage before each test
  await device.uninstallApp();
  await clearAllMockServerData();
  await device.installApp();
  await device.launchApp();
});
