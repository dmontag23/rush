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
import RushShowList from "../screens/RushShowList";

import {TodayTixHoldErrorCode, TodayTixHoldType} from "../../types/holds";
import {RootStackParamList} from "../../types/navigation";
import {TodayTixShow} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

describe("Holds", () => {
  it("can be placed automatically when selecting a show time if rush is open", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(201, {
        data: {
          numSeats: 2,
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
      expect(getByText("You've won 2 ticket(s) to Hamilton!")).toBeVisible()
    );
  });

  it("schedules a hold if rush is closed", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(201, {
        data: {
          numSeats: 2,
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
    const wonTicketsText = "You've won 2 ticket(s) to Hamilton!";
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
      .reply(200, {data: {id: "customer-id"}})
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(201, {
        data: {
          numSeats: 2,
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
      expect(getByText("You've won 2 ticket(s) to Hamilton!")).toBeVisible()
    );
    expect(await AsyncStorage.getItem("customer-id")).toBe("customer-id");
  });

  it("attempts to place a hold 30 times if all seats are taken before succeeding on the final attempt", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .times(29)
      .reply(409, {
        code: 409,
        error: TodayTixHoldErrorCode.SEATS_TAKEN,
        context: [
          "Sorry, all remaining tickets are currently being held by other customers. Please try again later."
        ],
        title: "All seats are being held",
        message:
          "Sorry, all remaining tickets are currently being held by other customers. Please try again later."
      })
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(201, {
        data: {
          numSeats: 2,
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
    await waitFor(
      () =>
        expect(getByText("You've won 2 ticket(s) to Hamilton!")).toBeVisible(),
      {timeout: 10000}
    );
  });

  it("cancels a hold for a show that is not open and gets tickets for a new show", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    await AsyncStorage.setItem("access-token", "access-token");
    await AsyncStorage.setItem("refresh-token", "refresh-token");
    await AsyncStorage.setItem(
      "token-ttl",
      new Date("01-01-2024").getTime().toString()
    );
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds", {
        customer: "customer-id",
        showtime: 2,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(201, {
        data: {
          numSeats: 2,
          showtime: {show: {displayName: "Hamilton"}}
        }
      });

    const Stack = createStackNavigator<RootStackParamList>();
    const show1TicketAvailabilityTime =
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000;
    const {getByText, getByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen
          name="RushShowList"
          component={RushShowList}
          initialParams={{
            showsAndTimes: [
              {
                show: {
                  id: 1,
                  displayName: "SIX the Musical",
                  isRushActive: true
                } as TodayTixShow,
                showtimes: [
                  {
                    id: 1,
                    localTime: "19:00",
                    rushTickets: {
                      minTickets: 1,
                      maxTickets: 2,
                      availableAfterEpoch: show1TicketAvailabilityTime
                    }
                  } as TodayTixShowtime
                ]
              },
              {
                show: {
                  id: 2,
                  displayName: "Hamilton",
                  isRushActive: true
                } as TodayTixShow,
                showtimes: [
                  {
                    id: 2,
                    localTime: "19:30",
                    rushTickets: {
                      minTickets: 1,
                      maxTickets: 2
                    }
                  } as TodayTixShowtime
                ]
              }
            ]
          }}
        />
        <Stack.Screen name="ShowDetails" component={ShowDetails} />
        <Stack.Screen name="HoldConfirmation" component={HoldConfirmation} />
      </Stack.Navigator>
    );

    // schedule a hold for the first show that is closed
    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
    userEvent.press(getByText("SIX the Musical"));
    await waitFor(() => expect(getByLabelText("Header image")).toBeVisible());
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    userEvent.press(getByText("19:00"));
    await waitFor(() => expect(getByText("2")).toBeVisible());
    userEvent.press(getByText("2"));

    // get tickets for a second show that is already open
    userEvent.press(getByLabelText("Back button"));
    await waitFor(() => expect(getByText("Hamilton")).toBeVisible());
    /* TODO: Investigate why this is necessary to press the card after navigating
    back to the card list screen. Perhaps it's a limitation with the react navigation library */
    jest.advanceTimersByTime(1000);
    userEvent.press(getByText("Hamilton"));
    await waitFor(() => expect(getByLabelText("Header image")).toBeVisible());
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    userEvent.press(getByText("19:30"));
    await waitFor(() => expect(getByText("2")).toBeVisible());
    userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 2 ticket(s) to Hamilton!")).toBeVisible()
    );
  });
});
