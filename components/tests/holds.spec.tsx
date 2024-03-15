import React from "react";

import {describe, expect, it} from "@jest/globals";
import {createStackNavigator} from "@react-navigation/stack";
import nock from "nock";
import {fireEvent, render, userEvent, waitFor} from "testing-library/extension";

import ShowDetails from "../ShowDetails/ShowDetails";
import HoldConfirmation from "../screens/HoldConfirmation";

import {RootStackParamList} from "../../types/navigation";
import {TodayTixShow} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

describe("Holds", () => {
  it("can be placed automatically when selecting a show time", async () => {
    // setup
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds")
      .thrice()
      .reply(401, {
        code: 401,
        error: "UnauthenticatedException",
        context: null,
        title: "Error",
        message:
          "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
      })
      .post("/holds")
      .reply(201, {
        data: {
          numSeats: 1,
          priceItems: [{total: {}}],
          showtime: {},
          seatsInfo: {seats: []}
        }
      });

    const Stack = createStackNavigator<RootStackParamList>();
    const {getByText, getByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen
          name="ShowDetails"
          component={ShowDetails}
          initialParams={{
            show: {id: 1, displayName: "Hamilton"} as TodayTixShow,
            showtimes: [
              {
                id: 1,
                localTime: "19:00",
                rushTickets: {minTickets: 1, maxTickets: 2}
              } as TodayTixShowtime
            ]
          }}
        />
        <Stack.Screen name="HoldConfirmation" component={HoldConfirmation} />
      </Stack.Navigator>
    );

    // load the header image
    await waitFor(() => {
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
    });
    userEvent.press(getByText("19:00"));
    await waitFor(() => expect(getByText("2")).toBeVisible());
    userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 1 ticket(s) to")).toBeVisible()
    );
  });
});
