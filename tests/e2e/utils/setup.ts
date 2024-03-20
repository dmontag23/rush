import {beforeEach} from "@jest/globals";

import {clearNetlifyData} from "./utils";

beforeEach(async () => {
  // this is necessary in order to clear async storage before each test
  await device.uninstallApp();
  await clearNetlifyData();
  await device.installApp();
  await device.launchApp();
});
