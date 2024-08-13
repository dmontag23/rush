import React from "react";

import {describe, expect, it} from "@jest/globals";
import nock from "nock";
import {fireEvent, render, waitFor} from "testing-library/extension";

import LoggedInBottomTabNavigator from "../LoggedInBottomTabNavigator";

describe("LoggedInBottomTabNavigator component", () => {
  it("can navigate to the settings tab", async () => {
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .reply(401);

    const {getByText, getByRole} = render(
      <LoggedInBottomTabNavigator shows={[]} />
    );
    const settingsTab = getByRole("button", {name: "Settings"});
    expect(settingsTab).toBeVisible();

    // navigate to the settings tab
    // TODO: Investigate why userEvent.press(settingsTab) does not work here
    fireEvent(settingsTab, "click");
    await waitFor(() => expect(getByText("All Settings")).toBeVisible());
  });
});
