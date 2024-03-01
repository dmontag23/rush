import React from 'react';
import {describe, it, expect} from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TodayTixShow} from '../../../types/shows';
import RushShowList from '../RushShowList';
import {render} from 'testing-library/extension';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStack} from '../RootNavigator';
import {TodayTixShowtime} from '../../../types/showtimes';

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
});
