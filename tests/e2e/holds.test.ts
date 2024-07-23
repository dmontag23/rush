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
    const holdConfirmationPageText = element(by.text("🎉"));
    await expect(holdConfirmationPageText).toBeVisible();
    await expect(element(by.text("Congratulations!"))).toBeVisible();
    await expect(
      element(by.text("You've won 1 ticket to Guys & Dolls."))
    ).toBeVisible();
    await expect(element(by.text("Seats"))).toBeVisible();
    await expect(element(by.text("Dress Circle"))).toBeVisible();
    await expect(element(by.text("Row J, Seat 28"))).toBeVisible();
    await expect(element(by.text("Order Total"))).toBeVisible();
    await expect(element(by.text("£29.50"))).toBeVisible();
    await expect(
      element(
        by.text(
          "IMPORTANT: Hard-close the TodayTix app before pressing the Purchase button!"
        )
      )
    ).toBeVisible();
    await expect(element(by.text("Purchase on TodayTix"))).toBeVisible();
    await expect(element(by.text("Release tickets"))).toBeVisible();

    // check that the hold banner contains the correct text
    const backButton = element(by.label("Back button")).atIndex(1);
    await backButton.tap();
    const holdBannerText = element(
      by.text("You have 1 ticket to Guys & Dolls!")
    );
    const releaseTicketsButton = element(by.text("Release tickets"));
    const seeTicketsButton = element(by.text("See tickets"));
    await expect(holdBannerText).toBeVisible();
    await expect(releaseTicketsButton).toBeVisible();
    await expect(seeTicketsButton).toBeVisible();

    // check that the hold banner can be used to navigate back to the hold page
    await seeTicketsButton.tap();
    await expect(holdConfirmationPageText).toBeVisible();
    await backButton.tap();
    await expect(element(by.text("Select a Time"))).toBeVisible();
    await backButton.tap();
    const chipText = element(by.text("11:59 to 23:59"));
    await expect(chipText).toBeVisible();
    await expect(holdBannerText).toBeVisible();
    await seeTicketsButton.tap();
    await expect(holdConfirmationPageText).toBeVisible();
    await backButton.tap();
    await expect(chipText).toBeVisible();
  });

  it("can purchase tickets on TodayTix", async () => {
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    await element(by.text("19:30")).tap();
    await element(by.text("1")).tap();
    await expect(element(by.text("🎉"))).toBeVisible();
    const purchaseTicketsButton = element(by.text("Purchase on TodayTix"));
    await expect(purchaseTicketsButton).toBeVisible();
    await purchaseTicketsButton.tap();
    // TODO: maybe mock the Linking module here and test that openURL was called?
  });

  it("can release tickets", async () => {
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    await element(by.text("19:30")).tap();
    await element(by.text("1")).tap();
    await expect(element(by.text("🎉"))).toBeVisible();

    // release tickets via the hold confirmation screen
    const releaseTicketsButton = element(by.text("Release tickets"));
    await expect(releaseTicketsButton).toBeVisible();
    await releaseTicketsButton.tap();
    await expect(element(by.text("Select a Time"))).toBeVisible();

    // re-reserve the tickets
    await element(by.text("19:30")).tap();
    await element(by.text("1")).tap();
    await expect(element(by.text("🎉"))).toBeVisible();

    // release the tickets via the hold banner
    await element(by.label("Back button")).atIndex(1).tap();
    const holdBannerText = element(
      by.text("You have 1 ticket to Guys & Dolls!")
    );
    await expect(holdBannerText).toBeVisible();
    await element(by.text("Release tickets")).tap();
    await expect(holdBannerText).not.toBeVisible();
  });

  it("can attempt to get tickets again if all tickets are currently reserved", async () => {
    // select a showtime that has all tickets currently reserved
    await element(by.text("SIX the Musical")).tap();
    const showtime = element(by.text("19:00"));
    await showtime.tap();
    await element(by.text("2")).tap();

    // retry the request for tickets
    const errorMessage = element(
      by.text(
        "Oh no! There was an error getting tickets to SIX the Musical:\nSorry, all remaining tickets are currently being held by other customers. Please try again later."
      )
    );
    await expect(errorMessage).toBeVisible();
    const retryButton = element(by.text("Retry"));
    await expect(retryButton).toBeVisible();
    await retryButton.tap();
    await expect(errorMessage).toBeVisible();
    await showtime.tap();
    await expect(errorMessage).not.toBeVisible();
  });

  it("can cancel hold", async () => {
    // select a showtime that is not open
    await element(by.text("Guys & Dolls")).tap();
    await element(by.text("23:59")).tap();
    await element(by.text("1")).tap();
    // TODO: Somehow fix the time for the e2e tests to test the countdown timer?
    const guysAndDolls1Ticket = element(
      by.text(/Attempting to get 1 ticket for Guys & Dolls in (.*)/)
    );
    await expect(guysAndDolls1Ticket).toBeVisible();

    // cancel by selecting the cancel button
    const cancelButton = element(by.text("Cancel"));
    await expect(cancelButton).toBeVisible();
    await cancelButton.tap();
    await expect(guysAndDolls1Ticket).not.toBeVisible();

    // cancel by selecting a new showtime
    await element(by.text("23:59")).tap();
    await element(by.text("2")).tap();
    const guysAndDolls2Tickets = element(
      by.text(/Attempting to get 2 tickets for Guys & Dolls in (.*)/)
    );
    await expect(guysAndDolls2Tickets).toBeVisible();
    await element(by.text("23:59")).tap();
    await expect(guysAndDolls2Tickets).not.toBeVisible();
  });
});
