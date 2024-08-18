import React from "react";

import {describe, expect, it} from "@jest/globals";
import {fireEvent, render, waitFor} from "testing-library/extension";

import LoggedInBottomTabNavigator from "../LoggedInBottomTabNavigator";

describe("LoggedInBottomTabNavigator component", () => {
  it("can navigate to the settings tab", async () => {
    const {getAllByText, getByRole} = render(<LoggedInBottomTabNavigator />);
    const settingsTab = getByRole("button", {name: "Settings"});
    expect(settingsTab).toBeVisible();
    expect(getAllByText("Settings")).toHaveLength(2);

    // navigate to the settings tab
    // TODO: Investigate why userEvent.press(settingsTab) does not work here
    fireEvent(settingsTab, "click");
    await waitFor(() => expect(getAllByText("Settings")).toHaveLength(3));
  });
});
