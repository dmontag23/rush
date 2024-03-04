import React from "react";

import {describe, expect, it} from "@jest/globals";
import nock from "nock";
import {render, userEvent, waitFor} from "testing-library/extension";

import RootNavigator from "../../RootNavigator";

describe("The authentication flow", () => {
  // TODO: Find a way to test the closed and open dots?

  it("can navigate back to the previous screen", async () => {
    // setup
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .post("/loginTokens")
      .reply(201, {code: 201, data: {}});

    // render
    const {getByRole, getByText, getByLabelText} = render(<RootNavigator />);
    await waitFor(() => expect(getByText("Sign into TodayTix")).toBeVisible());

    // enter a good email address
    const emailFormInput = getByLabelText("Email");
    const continueButton = getByRole("button", {name: "Continue"});
    userEvent.type(emailFormInput, "good@gmail.com");
    await waitFor(() => expect(continueButton).toBeEnabled());
    userEvent.press(continueButton);

    // check that the next auth screen is visible
    await waitFor(() => expect(getByLabelText("Go back")).toBeVisible());

    // navigate back to the previous screen
    userEvent.press(getByLabelText("Go back"));
    await waitFor(() => expect(continueButton).toBeVisible());
    expect(emailFormInput).toHaveProp("value", "");
  });
});
