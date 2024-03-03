import React from "react";
import {describe, it, expect} from "@jest/globals";
import {render, userEvent, waitFor} from "testing-library/extension";
import RushShowTicketSelection from "../RushShowTicketSelection";
import {TodayTixShow} from "../../../types/shows";
import {TodayTixShowtime} from "../../../types/showtimes";
import {hadestownLightThemeColors} from "../../../themes";

describe("The rush show ticket selection component", () => {
  it("does not show tickets if none are available", () => {
    const {getByText, queryByRole, queryByText} = render(
      <RushShowTicketSelection
        show={{id: 1, displayName: "SIX the Musical"} as TodayTixShow}
        showtimes={[]}
      />
    );

    expect(getByText("SIX the Musical")).toBeVisible();
    expect(
      getByText("There are no rush shows currently available.")
    ).toBeVisible();
    expect(queryByText("Select a Time")).toBeNull();
    expect(queryByText("Number of Tickets")).toBeNull();
    expect(queryByRole("button")).toBeNull();
  });

  it("can select a time and ticket amount", async () => {
    const {getByText, queryByText} = render(
      <RushShowTicketSelection
        show={{id: 1, displayName: "SIX the Musical"} as TodayTixShow}
        showtimes={[
          {
            id: 1,
            localTime: "14:30",
            rushTickets: {minTickets: 1, maxTickets: 4}
          } as TodayTixShowtime,
          {
            id: 2,
            localTime: "19:45"
          } as TodayTixShowtime
        ]}
      />
    );

    // validate the initial state of the screen
    expect(getByText("SIX the Musical")).toBeVisible();
    expect(queryByText("Select a Time")).toBeVisible();
    const matineeButton = getByText("14:30");
    expect(matineeButton).toBeVisible();
    expect(matineeButton).toHaveStyle({
      color: hadestownLightThemeColors.primary
    });
    const eveningButton = getByText("19:45");
    expect(eveningButton).toBeVisible();
    expect(eveningButton).toHaveStyle({
      color: hadestownLightThemeColors.primary
    });
    expect(queryByText("Number of Tickets")).toBeNull();

    // select a time
    userEvent.press(matineeButton);
    await waitFor(() =>
      expect(matineeButton).toHaveStyle({
        color: hadestownLightThemeColors.onPrimary
      })
    );
    expect(eveningButton).toHaveStyle({
      color: hadestownLightThemeColors.primary
    });
    expect(getByText("Number of Tickets")).toBeVisible();
    ["1", "2", "3", "4"].forEach(number => {
      const ticketNumber = getByText(number);
      expect(ticketNumber).toBeVisible();
      expect(ticketNumber).toHaveStyle({
        color: hadestownLightThemeColors.primary
      });
    });

    // select a ticket number
    const ticketNumberButton = getByText("3");
    userEvent.press(ticketNumberButton);

    await waitFor(() =>
      expect(ticketNumberButton).toHaveStyle({
        color: hadestownLightThemeColors.onPrimary
      })
    );
  });

  it("switches number of tickets available per show", async () => {
    const {getByText} = render(
      <RushShowTicketSelection
        show={{id: 1, displayName: "SIX the Musical"} as TodayTixShow}
        showtimes={[
          {
            id: 1,
            localTime: "14:30",
            rushTickets: {minTickets: 1, maxTickets: 4}
          } as TodayTixShowtime,
          {
            id: 2,
            localTime: "19:45",
            rushTickets: {minTickets: 1, maxTickets: 2}
          } as TodayTixShowtime
        ]}
      />
    );

    // select the matinee show
    const matineeButton = getByText("14:30");
    userEvent.press(matineeButton);
    await waitFor(() =>
      expect(matineeButton).toHaveStyle({
        color: hadestownLightThemeColors.onPrimary
      })
    );
    ["1", "2", "3", "4"].forEach(number => {
      const ticketNumber = getByText(number);
      expect(ticketNumber).toBeVisible();
      expect(ticketNumber).toHaveStyle({
        color: hadestownLightThemeColors.primary
      });
    });

    // select the number of tickets for the matinee
    const ticketNumberButton = getByText("2");
    userEvent.press(ticketNumberButton);
    await waitFor(() =>
      expect(ticketNumberButton).toHaveStyle({
        color: hadestownLightThemeColors.onPrimary
      })
    );

    // select the evening show
    const eveningButton = getByText("19:45");
    userEvent.press(eveningButton);
    await waitFor(() =>
      expect(eveningButton).toHaveStyle({
        color: hadestownLightThemeColors.onPrimary
      })
    );
    ["1", "2"].forEach(number => {
      const ticketNumber = getByText(number);
      expect(ticketNumber).toBeVisible();
      expect(ticketNumber).toHaveStyle({
        color: hadestownLightThemeColors.primary
      });
    });
  });
});
