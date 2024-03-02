import React from 'react';
import {describe, it, expect} from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TodayTixShow} from '../../../types/shows';
import RushShowList from '../RushShowList';
import {render, userEvent, waitFor, fireEvent} from 'testing-library/extension';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStack} from '../RootNavigator';
import {TodayTixShowtime} from '../../../types/showtimes';
import ShowDetails from '../../ShowDetails/ShowDetails';

describe('Rush show list', () => {
  it('sorts shows', async () => {
    // setup
    await AsyncStorage.setItem('access-token', 'access-token');

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
                    displayName: 'SIX the Musical',
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: 'test-url'}}}
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
                    displayName: 'Unfortunate',
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: 'test-url'}}}
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
                    displayName: 'Hamilton',
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: 'test-url'}}}
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
                    displayName: 'Hadestown',
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: 'test-url'}}}
                    }
                  } as TodayTixShow,
                  showtimes: []
                },
                {
                  show: {
                    id: 5,
                    displayName: 'Come from Away',
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: 'test-url'}}}
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
    const allShows = getAllByLabelText('Show card');
    expect(allShows.length).toBe(5);
    [
      'Hamilton',
      'SIX the Musical',
      'Unfortunate',
      'Hadestown',
      'Come from Away'
    ].map((showName, i) => {
      expect(allShows[i]).toBeVisible();
      expect(allShows[i]).toContainElement(getByText(showName));
    });
  });

  it('navigates to the show details screen and back', async () => {
    // setup
    await AsyncStorage.setItem('access-token', 'access-token');

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
                    displayName: 'SIX the Musical',
                    isRushActive: true,
                    images: {
                      productMedia: {appHeroImage: {file: {url: 'test-url'}}}
                    }
                  } as TodayTixShow,
                  showtimes: [
                    {
                      id: 1,
                      rushTickets: {
                        quantityAvailable: 4,
                        availableAfter: '2021-05-23T11:00:00.000+01:00',
                        availableUntil: '2021-05-23T16:30:00.000+01:00'
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
    const showCard = getByText('SIX the Musical');
    expect(showCard).toBeVisible();
    expect(getByText('10:00 to 15:30')).toBeVisible();

    // navigate to the show details screen
    userEvent.press(showCard);

    // load the header image
    await waitFor(() => {
      const loadingSpinner = getByTestId('loadingHeaderImageSpinner');
      expect(loadingSpinner).toBeVisible();
      fireEvent(getByLabelText('Header image'), 'onLoadEnd');
      expect(loadingSpinner).not.toBeOnTheScreen();
    });
    const backButton = getByLabelText('Back button');
    expect(backButton).toBeVisible();

    // go back to the rush show list
    userEvent.press(backButton);

    await waitFor(() => expect(getByText('10:00 to 15:30')).toBeVisible());
  });
});
