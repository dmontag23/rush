import React from "react";
import {Linking} from "react-native";

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

import {systemTime} from "../../tests/integration/setup";
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
    await userEvent.press(getByText("19:00"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton.")).toBeVisible()
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
    await userEvent.press(getByText("19:00"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));
    /* the - 1000 below is to ensure that requests are made to the holds endpoint
    1 second before rush tickets open */
    const timeToTicketAvailability =
      ticketAvailabilityTime * 1000 - new Date().getTime();
    const wonTicketsText = "You've won 2 tickets to Hamilton.";
    expect(queryByText(wonTicketsText)).toBeNull();
    act(() => jest.advanceTimersByTime(timeToTicketAvailability - 1000));
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
    await userEvent.press(getByText("19:00"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton.")).toBeVisible()
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
    await userEvent.press(getByText("19:00"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));
    await waitFor(
      () =>
        expect(getByText("You've won 2 tickets to Hamilton.")).toBeVisible(),
      {timeout: 10000}
    );
  });

  it("cancels a hold for a show that is yet not open and gets tickets for a new show", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .reply(200, {
        data: [
          {showId: 1, showName: "SIX the Musical"},
          {showId: 2, showName: "Hamilton"}
        ]
      })
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
    const show1TicketAvailabilityDate = new Date(2021, 4, 23, 0, 1);
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
                  isRushActive: true,
                  showId: 1
                } as TodayTixShow,
                showtimes: [
                  {
                    id: 1,
                    localTime: "19:00",
                    rushTickets: {
                      minTickets: 1,
                      maxTickets: 2,
                      availableAfter: show1TicketAvailabilityDate.toISOString(),
                      availableAfterEpoch:
                        show1TicketAvailabilityDate.getTime() / 1000,
                      availableUntil: show1TicketAvailabilityDate.toISOString()
                    }
                  } as TodayTixShowtime
                ]
              },
              {
                show: {
                  id: 2,
                  displayName: "Hamilton",
                  isRushActive: true,
                  showId: 2
                } as TodayTixShow,
                showtimes: [
                  {
                    id: 2,
                    localTime: "19:30",
                    rushTickets: {
                      minTickets: 1,
                      maxTickets: 2,
                      availableAfter: systemTime.toISOString(),
                      availableAfterEpoch: systemTime.getTime() / 1000,
                      availableUntil: systemTime.toISOString()
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
    await userEvent.press(getByText("SIX the Musical"));
    expect(getByLabelText("Header image")).toBeVisible();
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:00"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));

    // get tickets for a second show that is already open
    await userEvent.press(getByLabelText("Back button"));
    expect(getByText("Hamilton")).toBeVisible();
    /* TODO: Investigate why this is necessary to press the card after navigating
    back to the card list screen. Perhaps it's a limitation with the react navigation library */
    act(() => jest.advanceTimersByTime(1000));
    await userEvent.press(getByText("Hamilton"));
    expect(getByLabelText("Header image")).toBeVisible();
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:30"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton.")).toBeVisible()
    );
  });

  it("cancels a hold when selecting a new showtime", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 1,
        holdType: TodayTixHoldType.Rush
      })
      .reply(401, {
        code: 401,
        error: TodayTixHoldErrorCode.UNAUTHENTICATED,
        message:
          "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
      });

    const Stack = createStackNavigator<RootStackParamList>();
    const {getByText, getByLabelText, queryByText} = render(
      <Stack.Navigator>
        <Stack.Screen
          name="ShowDetails"
          component={ShowDetails}
          initialParams={{
            show: {
              id: 1,
              displayName: "SIX the Musical"
            } as TodayTixShow,
            showtimes: [
              {
                id: 1,
                localTime: "19:00",
                rushTickets: {
                  minTickets: 1,
                  maxTickets: 2
                }
              } as TodayTixShowtime
            ]
          }}
        />
      </Stack.Navigator>
    );

    // see an error when clicking on the first showtime
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:00"));
    expect(getByText("1")).toBeVisible();
    await userEvent.press(getByText("1"));
    const errorText = `Oh no! There was an error getting tickets to SIX the Musical:\nSorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists.`;
    await waitFor(() => expect(getByText(errorText)).toBeVisible());

    // clear the error by clicking on the showtime
    await userEvent.press(getByText("19:00"));
    expect(queryByText(errorText)).toBeNull();
  });

  describe("Hold confirmation page", () => {
    it("contains all the correct elements", async () => {
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
            configurableTexts: {amountDisplayForWeb: "£25.00"},
            numSeats: 2,
            seatsInfo: {row: "D", seats: ["5", "6"], sectionName: "Stalls"},
            showtime: {show: {displayName: "SIX the Musical"}}
          }
        });

      const Stack = createStackNavigator<RootStackParamList>();
      const {getByText, getByLabelText} = render(
        <Stack.Navigator>
          <Stack.Screen
            name="ShowDetails"
            component={ShowDetails}
            initialParams={{
              show: {
                id: 1,
                displayName: "SIX the Musical"
              } as TodayTixShow,
              showtimes: [
                {
                  id: 1,
                  localTime: "19:00",
                  rushTickets: {
                    minTickets: 1,
                    maxTickets: 2
                  }
                } as TodayTixShowtime
              ]
            }}
          />
          <Stack.Screen name="HoldConfirmation" component={HoldConfirmation} />
        </Stack.Navigator>
      );

      // navigate to the hold confirmation page
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      await userEvent.press(getByText("19:00"));
      await userEvent.press(getByText("2"));
      await waitFor(() => expect(getByText("🎉")).toBeVisible());

      // check the page contains all of the elements
      expect(getByLabelText("Back button")).toBeVisible();
      expect(getByText("Congratulations!")).toBeVisible();
      expect(
        getByText("You've won 2 tickets to SIX the Musical.")
      ).toBeVisible();
      expect(getByText("Seats")).toBeVisible();
      expect(getByText("Stalls")).toBeVisible();
      expect(getByText("Row D, Seats 5 and 6")).toBeVisible();
      expect(getByText("Order Total")).toBeVisible();
      expect(getByText("£25.00")).toBeVisible();
      expect(
        getByText(
          "IMPORTANT: Hard-close the TodayTix app before pressing the Purchase button!"
        )
      ).toBeVisible();
      expect(getByText("Purchase on TodayTix")).toBeVisible();
      expect(getByText("Release tickets")).toBeVisible();
    });

    it("can navigate back to the show details page", async () => {
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
            configurableTexts: {amountDisplayForWeb: "£25.00"},
            numSeats: 2,
            seatsInfo: {row: "D", seats: ["5", "6"], sectionName: "Stalls"},
            showtime: {show: {displayName: "SIX the Musical"}}
          }
        });

      const Stack = createStackNavigator<RootStackParamList>();
      const {getByText, getByLabelText} = render(
        <Stack.Navigator>
          <Stack.Screen
            name="ShowDetails"
            component={ShowDetails}
            initialParams={{
              show: {
                id: 1,
                displayName: "SIX the Musical"
              } as TodayTixShow,
              showtimes: [
                {
                  id: 1,
                  localTime: "19:00",
                  rushTickets: {
                    minTickets: 1,
                    maxTickets: 2
                  }
                } as TodayTixShowtime
              ]
            }}
          />
          <Stack.Screen name="HoldConfirmation" component={HoldConfirmation} />
        </Stack.Navigator>
      );

      // navigate to the hold confirmation page
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      await userEvent.press(getByText("19:00"));
      await userEvent.press(getByText("2"));
      await waitFor(() => expect(getByText("🎉")).toBeVisible());

      // navigate back to the show detail page
      await userEvent.press(getByLabelText("Back button"));
      expect(getByText("Select a Time")).toBeVisible();
    });

    it("can navigate back to the rush show list page", async () => {
      // setup
      await AsyncStorage.setItem("customer-id", "customer-id");
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
      )
        .get("/customers/me/rushGrants")
        .reply(200, {
          data: [{showId: 1, showName: "Hamilton"}]
        })
        .post("/holds", {
          customer: "customer-id",
          showtime: 1,
          numTickets: 2,
          holdType: TodayTixHoldType.Rush
        })
        .reply(201, {
          data: {
            configurableTexts: {amountDisplayForWeb: "£25.00"},
            numSeats: 2,
            seatsInfo: {row: "D", seats: ["5", "6"], sectionName: "Stalls"},
            showtime: {show: {displayName: "Hamilton"}}
          }
        });

      const Stack = createStackNavigator<RootStackParamList>();
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
                    displayName: "Hamilton",
                    isRushActive: true,
                    showId: 1
                  } as TodayTixShow,
                  showtimes: [
                    {
                      id: 1,
                      localTime: "19:30",
                      rushTickets: {
                        minTickets: 1,
                        maxTickets: 2,
                        availableAfter: systemTime.toISOString(),
                        availableUntil: systemTime.toISOString()
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

      // navigate to the hold confirmation page
      await waitFor(() => expect(getByText("Hamilton")).toBeVisible());
      await userEvent.press(getByText("Hamilton"));
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      await userEvent.press(getByText("19:30"));
      await userEvent.press(getByText("2"));
      await waitFor(() => expect(getByText("🎉")).toBeVisible());

      // navigate back to the rush show list page
      await userEvent.press(getByLabelText("Back button"));
      expect(getByText("Select a Time")).toBeVisible();
      /* TODO: Investigate why this is necessary to press the card after navigating
      back to the show details screen. Perhaps it's a limitation with the react navigation library */
      act(() => jest.advanceTimersByTime(1000));
      await userEvent.press(getByLabelText("Back button"));
      expect(getByText("2 per person max")).toBeVisible();

      // navigate to the hold confirmation screen and back again to the rush show list
      /* TODO: Investigate why this is necessary to press the button after navigating
      back to the rush show list screen. Perhaps it's a limitation with the react navigation library */
      act(() => jest.advanceTimersByTime(1000));
      await userEvent.press(getByText("See tickets"));
      expect(getByText("🎉")).toBeVisible();
      await userEvent.press(getByLabelText("Back button"));
      expect(getByText("2 per person max")).toBeVisible();
    });
  });

  it("can purchase tickets on the TodayTix app", async () => {
    // setup
    // mock the deep linking mechanism in order to test it
    jest.mock("react-native/Libraries/Linking/Linking");
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
          configurableTexts: {amountDisplayForWeb: "£25.00"},
          numSeats: 2,
          seatsInfo: {row: "D", seats: ["5", "6"], sectionName: "Stalls"},
          showtime: {show: {displayName: "SIX the Musical"}}
        }
      });

    const Stack = createStackNavigator<RootStackParamList>();
    const {getByText, getByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen
          name="ShowDetails"
          component={ShowDetails}
          initialParams={{
            show: {
              id: 1,
              displayName: "SIX the Musical"
            } as TodayTixShow,
            showtimes: [
              {
                id: 1,
                localTime: "19:00",
                rushTickets: {
                  minTickets: 1,
                  maxTickets: 2
                }
              } as TodayTixShowtime
            ]
          }}
        />
        <Stack.Screen name="HoldConfirmation" component={HoldConfirmation} />
      </Stack.Navigator>
    );

    // navigate to the hold confirmation page
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:00"));
    await userEvent.press(getByText("2"));
    await waitFor(() => expect(getByText("🎉")).toBeVisible());

    // check navigation to the TodayTix app to purchase tickets is possible
    await userEvent.press(getByText("Purchase on TodayTix"));
    expect(Linking.openURL).toBeCalled();
    expect(Linking.openURL).toBeCalledWith(process.env.TODAY_TIX_APP_URL);
  });
});
