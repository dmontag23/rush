import {beforeEach, describe, it} from "@jest/globals";
import {expect} from "detox";

import {login} from "./utils/utils";

describe("Rush shows", () => {
  beforeEach(login);

  it("can navigate to the settings tab", async () => {
    // TODO: Expand this test once more items are included in the settings tab
    const settingsTab = element(by.text("Settings")).atIndex(0);
    await expect(settingsTab).toBeVisible();

    // navigate to the settings tab
    await settingsTab.tap();

    await expect(element(by.text("All Settings"))).toBeVisible();
  });
});
