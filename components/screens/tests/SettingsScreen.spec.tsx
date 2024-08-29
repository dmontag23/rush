import React from "react";

import {describe, expect, it} from "@jest/globals";
import {render, waitFor} from "testing-library/extension";

import SettingsScreen from "../SettingsScreen";

describe("Settings screen", () => {
  it("contains all the correct elements", async () => {
    const {getByText, getAllByText} = render(<SettingsScreen />);

    expect(getByText("Settings")).toBeVisible();
    /* note that gorhom/react-native-bottom-sheet package contains a bug; its mock
    does not toggle the bottom sheet modal visibility, and so the location text
    and the location bottom sheet title are both "visible" */
    expect(getAllByText("Location")).toHaveLength(2);
    expect(getAllByText("Location")[0]).toBeVisible();
    expect(getAllByText("Location")[1]).toBeVisible();
    await waitFor(() => expect(getAllByText("London")).toHaveLength(2));
  });
});
