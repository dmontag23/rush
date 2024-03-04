import React from "react";

import {describe, expect, it, jest} from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {fireEvent, render, userEvent, waitFor} from "testing-library/extension";

import {RootStack} from "../RootNavigator";
import RushShowList from "../RushShowList";

import ShowDetails from "../../ShowDetails/ShowDetails";

import {hadestownLightThemeColors} from "../../../themes";
import {TodayTixShow} from "../../../types/shows";
import {TodayTixShowtime} from "../../../types/showtimes";

describe("Rush show list", () => {
  it("sorts shows", async () => {
    // setup
    await AsyncStorage.setItem("access-token", "access-token");

    // render
    const Stack = createStackNavigator<RootStack>();
    const {getByText, getAllByLabelText} = render(
      <NavigationContainer>
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
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: "test-url"}}}
                    }
                  } as TodayTixShow,
                  showtimes: [
                    {
                      id: 1,
                      rushTickets: {quantityAvailable: 4}
                    } as TodayTixShowtime
                  ]
                },
                {
                  show: {
                    id: 2,
                    displayName: "Unfortunate",
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: "test-url"}}}
                    }
                  } as TodayTixShow,
                  showtimes: [
                    {
                      id: 2,
                      rushTickets: {
                        quantityAvailable: 0,
                        availableAfterEpoch: 10
                      }
                    } as TodayTixShowtime
                  ]
                },
                {
                  show: {
                    id: 3,
                    displayName: "Hamilton",
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: "test-url"}}}
                    }
                  } as TodayTixShow,
                  showtimes: [
                    {
                      id: 3,
                      rushTickets: {quantityAvailable: 3}
                    } as TodayTixShowtime,
                    {
                      id: 4,
                      rushTickets: {quantityAvailable: 2}
                    } as TodayTixShowtime
                  ]
                },
                {
                  show: {
                    id: 4,
                    displayName: "Hadestown",
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: "test-url"}}}
                    }
                  } as TodayTixShow,
                  showtimes: []
                },
                {
                  show: {
                    id: 5,
                    displayName: "Come from Away",
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: "test-url"}}}
                    }
                  } as TodayTixShow,
                  showtimes: [{id: 5} as TodayTixShowtime]
                }
              ]
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // assert
    const allShows = getAllByLabelText("Show card");
    expect(allShows.length).toBe(5);
    [
      "Hamilton",
      "SIX the Musical",
      "Unfortunate",
      "Hadestown",
      "Come from Away"
    ].map((showName, i) => {
      expect(allShows[i]).toBeVisible();
      expect(allShows[i]).toContainElement(getByText(showName));
    });
  });

  it("navigates to the show details screen and back", async () => {
    // setup
    await AsyncStorage.setItem("access-token", "access-token");

    // render
    const Stack = createStackNavigator<RootStack>();
    const {getByText, getByTestId, getByLabelText} = render(
      <NavigationContainer>
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
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: "test-url"}}}
                    }
                  } as TodayTixShow,
                  showtimes: [
                    {
                      id: 1,
                      rushTickets: {
                        quantityAvailable: 4,
                        availableAfter: "2021-05-23T11:00:00.000+01:00",
                        availableUntil: "2021-05-23T16:30:00.000+01:00"
                      }
                    } as TodayTixShowtime
                  ]
                }
              ]
            }}
          />
          <Stack.Screen name="ShowDetails" component={ShowDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // assert
    const showCard = getByText("SIX the Musical");
    expect(showCard).toBeVisible();
    expect(getByText("10:00 to 15:30")).toBeVisible();

    // navigate to the show details screen
    userEvent.press(showCard);

    // load the header image
    await waitFor(() => {
      const loadingSpinner = getByTestId("loadingHeaderImageSpinner");
      expect(loadingSpinner).toBeVisible();
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      expect(loadingSpinner).not.toBeOnTheScreen();
    });
    const backButton = getByLabelText("Back button");
    expect(backButton).toBeVisible();

    // go back to the rush show list
    userEvent.press(backButton);

    await waitFor(() => expect(getByText("10:00 to 15:30")).toBeVisible());
  });

  it("maintains selected show state when navigating to other shows and back", async () => {
    // setup
    await AsyncStorage.setItem("access-token", "access-token");

    // render
    const Stack = createStackNavigator<RootStack>();
    const {getByText, getByLabelText} = render(
      <NavigationContainer>
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
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: "test-url"}}}
                    }
                  } as TodayTixShow,
                  showtimes: [
                    {
                      id: 1,
                      localTime: "19:00",
                      rushTickets: {
                        minTickets: 1,
                        maxTickets: 2,
                        availableAfter: "2021-05-23T11:00:00.000+01:00",
                        availableUntil: "2021-05-23T16:30:00.000+01:00"
                      }
                    } as TodayTixShowtime
                  ]
                },
                {
                  show: {
                    id: 2,
                    displayName: "Hamilton",
                    isRushActive: true,
                    images: {
                      productMedia: {
                        appHeroImage: {file: {url: "test-url-for-show-card"}},
                        headerImage: {file: {url: "test-url-for-header-photo"}}
                      }
                    }
                  } as TodayTixShow,
                  showtimes: [
                    {
                      id: 2,
                      localTime: "14:00",
                      rushTickets: {
                        minTickets: 1,
                        maxTickets: 2,
                        availableAfter: "2021-05-23T11:00:00.000+01:00",
                        availableUntil: "2021-05-23T16:30:00.000+01:00"
                      }
                    } as TodayTixShowtime
                  ]
                }
              ]
            }}
          />
          <Stack.Screen name="ShowDetails" component={ShowDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // navigate to the show details screen
    userEvent.press(getByText("SIX the Musical"));

    // load the header image
    await waitFor(() => {
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      expect(getByLabelText("Back button")).toBeVisible();
    });

    // select two shows for the evening
    const eveningShowtimeButton = getByText("19:00");
    userEvent.press(eveningShowtimeButton);
    await waitFor(() =>
      expect(eveningShowtimeButton).toHaveStyle({
        color: hadestownLightThemeColors.onPrimary
      })
    );
    const ticketNumberButton = getByText("2");
    userEvent.press(ticketNumberButton);
    await waitFor(() =>
      expect(ticketNumberButton).toHaveStyle({
        color: hadestownLightThemeColors.onPrimary
      })
    );

    // navigate to a different show
    userEvent.press(getByLabelText("Back button"));
    await waitFor(() => expect(getByText("Hamilton")).toBeVisible());
    /* TODO: Investigate why this is necessary to press the card after navigating
    back to the card list screen. Perhaps it's a limitation with the react navigation library */
    jest.runAllTimers();
    userEvent.press(getByText("Hamilton"));

    // check that the show button is de-selected
    await waitFor(() => {
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      expect(getByLabelText("Back button")).toBeVisible();
    });
    expect(getByText("14:00")).toHaveStyle({
      color: hadestownLightThemeColors.primary
    });

    // navigate back to the first show
    userEvent.press(getByLabelText("Back button"));
    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
    /* TODO: Investigate why this is necessary to press the card after navigating
    back to the card list screen. Perhaps it's a limitation with the react navigation library */
    jest.runAllTimers();
    userEvent.press(getByText("SIX the Musical"));

    // check that the show and tickets are still selected
    await waitFor(() => {
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      expect(getByLabelText("Back button")).toBeVisible();
    });
    expect(getByText("19:00")).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });
    expect(getByText("2")).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });
  });
});
