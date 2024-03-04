import React from "react";

import {describe, expect, it} from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import nock from "nock";
import {render, waitFor} from "testing-library/extension";

import RootNavigator from "../screens/RootNavigator";

import {TodayTixFieldset, TodayTixLocation} from "../../types/shows";

describe("The root navigator", () => {
  it("renders the splash screen when loading the auth token", async () => {
    // setup
    const scope = nock(process.env.TODAY_TIX_API_BASE_URL)
      .get("/shows")
      .query({
        areAccessProgramsActive: "1",
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const {getByLabelText} = render(<RootNavigator />);
    // wait for the above call to complete so the auth token is the only thing loading
    await waitFor(() => scope.isDone());

    // assert
    expect(getByLabelText("TodayTix logo")).toBeVisible();
  });

  it("renders the splash screen when loading the shows", async () => {
    // setup
    await AsyncStorage.setItem("access-token", "access-token");
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .get("/shows")
      .query({
        areAccessProgramsActive: "1",
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .delay(5000)
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const {getByLabelText} = render(<RootNavigator />);

    // assert
    expect(getByLabelText("TodayTix logo")).toBeVisible();
  });

  it("renders the splash screen when loading the showtimes", async () => {
    // setup
    await AsyncStorage.setItem("access-token", "access-token");
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .get("/shows")
      .query({
        areAccessProgramsActive: "1",
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .reply(200, {
        code: 200,
        data: [
          {
            id: 1,
            displayName: "SIX the Musical",
            isRushActive: true,
            images: {productMedia: {appHeroImage: {file: {url: "test-url"}}}}
          }
        ]
      })
      .get("/shows/1/showtimes/with_rush_availability")
      .delay(5000)
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const {getByLabelText} = render(<RootNavigator />);

    // assert
    expect(getByLabelText("TodayTix logo")).toBeVisible();
  });

  it("renders the initial auth screen without an auth token", async () => {
    // setup
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .get("/shows")
      .query({
        areAccessProgramsActive: "1",
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const {getByText} = render(<RootNavigator />);

    // assert
    await waitFor(() => expect(getByText("Sign into TodayTix")).toBeVisible());
  });

  it("renders the rush screen with an auth token", async () => {
    // setup
    await AsyncStorage.setItem("access-token", "access-token");
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .get("/shows")
      .query({
        areAccessProgramsActive: "1",
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .reply(200, {
        code: 200,
        data: [
          {
            id: 1,
            displayName: "SIX the Musical",
            isRushActive: true,
            images: {productMedia: {appHeroImage: {file: {url: "test-url"}}}}
          },
          {
            id: 2,
            displayName: "Hamilton",
            isRushActive: true,
            images: {productMedia: {appHeroImage: {file: {url: "test-url"}}}}
          }
        ]
      })
      .get("/shows/1/showtimes/with_rush_availability")
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const {getByText} = render(<RootNavigator />);

    // assert
    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
  });
});
