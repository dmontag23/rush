import React from "react";

import {describe, expect, it, jest} from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createStackNavigator} from "@react-navigation/stack";
import nock from "nock";
import {
  act,
  fireEvent,
  render,
  userEvent,
  waitFor
} from "testing-library/extension";

import ShowDetails from "../ShowDetails/ShowDetails";
import HoldConfirmation from "../screens/HoldConfirmation";

import {RootStackParamList} from "../../types/navigation";
import {TodayTixShow} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

describe("Holds", () => {
  // TODO: Add a test for retrying holds until you get a seat/at most 30 times/only under the seat condition
  it("can be placed automatically when selecting a show time if rush is open", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds")
      .reply(201, {
        data: {
          numSeats: 1,
          showtime: {show: {displayName: "Hamilton"}}
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
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    userEvent.press(getByText("19:00"));
    await waitFor(() => expect(getByText("2")).toBeVisible());
    userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 1 ticket(s) to Hamilton!")).toBeVisible()
    );
  });

  it("schedules a hold if rush is closed", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds")
      .reply(201, {
        data: {
          numSeats: 1,
          showtime: {show: {displayName: "Hamilton"}}
        }
      });

    const Stack = createStackNavigator<RootStackParamList>();
    const ticketAvailabilityTime =
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000;
    const {getByText, queryByText, getByLabelText} = render(
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
                rushTickets: {
                  minTickets: 1,
                  maxTickets: 2,
                  availableAfterEpoch: ticketAvailabilityTime
                }
              } as TodayTixShowtime
            ]
          }}
        />
        <Stack.Screen name="HoldConfirmation" component={HoldConfirmation} />
      </Stack.Navigator>
    );

    // load the header image
    act(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    userEvent.press(getByText("19:00"));
    await waitFor(() => expect(getByText("2")).toBeVisible());
    userEvent.press(getByText("2"));
    const timeToTicketAvailability =
      ticketAvailabilityTime * 1000 - new Date().getTime();
    /* the - 1000 below is to ensure that requests are made to the holds endpoint
    1 second before rush tickets open */
    const wonTicketsText = "You've won 1 ticket(s) to Hamilton!";
    expect(queryByText(wonTicketsText)).toBeNull();
    jest.advanceTimersByTime(timeToTicketAvailability - 1000);
    await waitFor(() => expect(getByText(wonTicketsText)).toBeVisible());
  });

  it("fetches a customer from the TodayTix API if one is not available before placing a hold", async () => {
    // setup
    await AsyncStorage.multiSet([
      ["access-token", "access-token"],
      ["refresh-token", "refresh-token"],
      ["token-ttl", new Date("2024-01-01").getTime().toString()]
    ]);

    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me")
      .reply(200, {data: {id: "customer-id"}});

    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds")
      .reply(201, {
        data: {
          numSeats: 1,
          showtime: {show: {displayName: "Hamilton"}}
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

    expect(await AsyncStorage.getItem("customer-id")).toBeNull();
    // load the header image
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    userEvent.press(getByText("19:00"));
    await waitFor(() => expect(getByText("2")).toBeVisible());
    userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 1 ticket(s) to Hamilton!")).toBeVisible()
    );
    expect(await AsyncStorage.getItem("customer-id")).toBe("customer-id");
  });
});
