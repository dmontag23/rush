import React from "react";
import {AppState} from "react-native";

import {describe, expect, it, jest} from "@jest/globals";
import {render, waitFor} from "@testing-library/react-native";
import nock from "nock";

import App from "./App";
import {TodayTixFieldset, TodayTixLocation} from "./types/shows";

describe("App component", () => {
  it("re-fetches data when the app is brought into the foreground", async () => {
    const appStateSpy = jest.spyOn(AppState, "addEventListener");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .twice()
      .reply(200, {
        data: []
      })
      .get("/holds")
      .reply(200, {
        data: [
          {
            id: 1,
            numSeats: 2,
            showtime: {show: {displayName: "Hamilton"}}
          }
        ]
      })
      .get("/holds")
      .reply(200, {
        data: []
      });

    const {getByText} = render(<App />);

    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton 🎉")).toBeVisible()
    );
    const holdText = getByText("You've won 2 tickets to Hamilton 🎉");
    expect(appStateSpy).toBeCalledTimes(1);

    const onAppStateChange = appStateSpy.mock.calls[0][1];
    onAppStateChange("active");

    await waitFor(() => expect(holdText).not.toBeOnTheScreen());
  });
});
