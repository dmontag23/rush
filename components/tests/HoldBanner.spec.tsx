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

import {hadestownLightThemeColors} from "../../themes";
import {TodayTixHoldErrorCode, TodayTixHoldType} from "../../types/holds";
import {RootStackParamList} from "../../types/navigation";
import {TodayTixShow} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

describe("Hold banner", () => {
  it("displays correctly on both rush show list and show details screens", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .reply(200, {data: [{showId: 1, showName: "SIX the Musical"}]});

    const Stack = createStackNavigator<RootStackParamList>();
    const ticketAvailabilityTime = new Date(2021, 4, 23, 10).getTime() / 1000;
    const {getByText, getByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen
          name="RushShowList"
          component={RushShowList}
          initialParams={{
            /* The typecast is used because a TodayTixShow has many required fields,
            most of which are not necessary for the functionality of the component. */
            showsAndTimes: [
              {
                show: {
                  id: 1,
                  displayName: "SIX the Musical",
                  showId: 1
                } as TodayTixShow,
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
              }
            ]
          }}
        />
        <Stack.Screen name="ShowDetails" component={ShowDetails} />
      </Stack.Navigator>
    );

    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
    /* check that the banner text is rendered on the rush show list page
    but not visible */
    expect(
      getByText("Attempting to get NaN ticket for undefined in 23:59:59")
    ).not.toBeVisible();

    await userEvent.press(getByText("SIX the Musical"));
    // load the header image
    await waitFor(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    await userEvent.press(getByText("19:00"));
    await userEvent.press(getByText("2"));

    // check the banner appears on the show details page
    await waitFor(() =>
      expect(
        getByText("Attempting to get 2 tickets for SIX the Musical in 09:59:58")
      ).toBeVisible()
    );
  });

  it("can cancel a scheduled hold", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");

    const Stack = createStackNavigator<RootStackParamList>();
    const ticketAvailabilityTime =
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000;
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
                rushTickets: {
                  minTickets: 1,
                  maxTickets: 2,
                  availableAfterEpoch: ticketAvailabilityTime
                }
              } as TodayTixShowtime
            ]
          }}
        />
      </Stack.Navigator>
    );

    // load the header image
    await waitFor(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    expect(getByText("Hamilton")).toBeVisible();
    const showButton = getByText("19:00");
    await userEvent.press(showButton);
    const numTicketsButton = getByText("1");
    await userEvent.press(numTicketsButton);
    expect(showButton).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });
    expect(numTicketsButton).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });

    // check the banner appears on the show details page
    await waitFor(() =>
      expect(
        getByText("Attempting to get 1 ticket for Hamilton in 00:00:04")
      ).toBeVisible()
    );
    const bannerText = getByText(
      "Attempting to get 1 ticket for Hamilton in 00:00:04"
    );
    expect(getByText("Cancel")).toBeVisible();
    await userEvent.press(getByText("Cancel"));

    // ensure the banner is no longer visible and the date and time are not selected
    expect(bannerText).not.toBeVisible();
    expect(showButton).toHaveStyle({
      color: hadestownLightThemeColors.primary
    });
    expect(numTicketsButton).not.toBeOnTheScreen();
  });

  it("shows hold error", async () => {
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
      .reply(409, {
        error: TodayTixHoldErrorCode.CONFLICT,
        message:
          "You are not eligible to make this purchase. Please unlock Rush and try again. Contact TodayTix Support if you feel you have received this message in error."
      })
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(409, {
        error: TodayTixHoldErrorCode.UNAUTHENTICATED
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
    const {getByText, getByLabelText, getByTestId} = render(
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
                  maxTickets: 2
                }
              } as TodayTixShowtime
            ]
          }}
        />
        <Stack.Screen name="HoldConfirmation" component={HoldConfirmation} />
      </Stack.Navigator>
    );

    // load the header image
    await waitFor(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    expect(getByText("Hamilton")).toBeVisible();
    await userEvent.press(getByText("19:00"));
    await userEvent.press(getByText("2"));

    // check the banner appears on the show details page with an error message
    expect(getByText("Trying to get 2 tickets to Hamilton")).toBeVisible();
    expect(getByTestId("loadingSpinner")).toBeVisible();
    await waitFor(() =>
      expect(
        getByText(
          "Oh no! There was an error getting tickets to Hamilton:\nYou are not eligible to make this purchase. Please unlock Rush and try again. Contact TodayTix Support if you feel you have received this message in error."
        )
      ).toBeVisible()
    );
    expect(getByText("Retry")).toBeVisible();
    await userEvent.press(getByText("Retry"));
    await waitFor(() =>
      expect(
        getByText(
          `Oh no! There was an error getting tickets to Hamilton:\n${TodayTixHoldErrorCode.UNAUTHENTICATED}`
        )
      ).toBeVisible()
    );
    await userEvent.press(getByText("Retry"));
    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton!")).toBeVisible()
    );
  });

  it("shows the current tickets on hold", async () => {
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

    // load the header image
    await waitFor(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    expect(getByText("Hamilton")).toBeVisible();
    await userEvent.press(getByText("19:00"));
    await userEvent.press(getByText("2"));
    const holdPageText = "You've won 2 tickets to Hamilton!";
    await waitFor(() => expect(getByText(holdPageText)).toBeVisible());

    // ensure the banner now contains information on the current hold
    await userEvent.press(getByLabelText("Back button"));
    expect(getByText("You have 2 tickets to Hamilton!")).toBeVisible();
    expect(getByText("Release tickets")).toBeVisible();
    const seeTicketsButton = getByText("See tickets");
    expect(seeTicketsButton).toBeVisible();

    // navigate back to the hold page
    /* TODO: Investigate why this is necessary to wait after navigating
    back to the details screen. Perhaps it's a limitation with the react navigation library */
    act(() => jest.advanceTimersByTime(1000));
    await userEvent.press(seeTicketsButton);
    expect(getByText(holdPageText)).toBeVisible();
  });
});
