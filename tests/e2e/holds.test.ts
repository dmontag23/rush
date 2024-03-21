import {beforeEach, describe, it} from "@jest/globals";
import {expect} from "detox";

import {login} from "./utils/utils";

describe("Holds", () => {
  beforeEach(login);

  it("can place a hold for a show where tickets are already open", async () => {
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    await element(by.text("19:30")).tap();
    await element(by.text("1")).tap();
    await expect(element(by.text("You've won 1 ticket(s) to"))).toBeVisible();

    // TODO: Expand this test once the hold confirmation page is more fully built out
  });

  it("cannot place a hold for a show that has not been unlocked", async () => {
    // TODO: Expand this test once the hold confirmation page is more fully built out
  });
});
