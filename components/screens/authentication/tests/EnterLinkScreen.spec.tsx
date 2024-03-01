import {describe, it, expect, jest} from '@jest/globals';
import {render, waitFor, userEvent} from 'testing-library/extension';
import React from 'react';
import nock from 'nock';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStack} from '../../RootNavigator';
import {NavigationContainer} from '@react-navigation/native';
import EnterLinkScreen from '../EnterLinkScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {systemTime} from '../../../../tests/integration/setup';

describe('Link screen', () => {
  it('displays elements in their initial state on the screen', async () => {
    const Stack = createStackNavigator<RootStack>();
    const {getByRole, getByText, getByLabelText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="EnterLink" component={EnterLinkScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByText('Almost there...')).toBeVisible();
    expect(
      getByText('Please enter the login link from the TodayTix email')
    ).toBeVisible();
    const linkFormInput = getByLabelText('Link');
    expect(linkFormInput).toBeVisible();
    expect(linkFormInput).toHaveProp('value', '');
    const loginButton = getByRole('button', {name: 'Login'});
    expect(loginButton).toBeVisible();
    expect(loginButton).toBeDisabled();
  });

  it('displays a form validation error', async () => {
    const Stack = createStackNavigator<RootStack>();
    const {getByRole, getByText, getByLabelText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="EnterLink" component={EnterLinkScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // enter an invalid link
    userEvent.type(getByLabelText('Link'), 'd{Enter}');
    await waitFor(() =>
      expect(getByText('Please enter a valid url')).toBeVisible()
    );
    expect(getByRole('button', {name: 'Login'})).toBeDisabled();
  });

  it('displays a TodayTix validation error', async () => {
    // setup mock error response from the TodayTix API
    nock(process.env.TODAY_TIX_API_BASE_URL).post('/accessTokens').reply(400, {
      code: 404,
      error: 'MissingResource',
      context: null,
      title: 'MissingResource',
      message:
        'No login token found. Try logging in again or contact TodayTix Support if the issue persists.'
    });

    const Stack = createStackNavigator<RootStack>();
    const {getByRole, getByText, getByLabelText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="EnterLink" component={EnterLinkScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // enter a valid email address that fails on the TodayTix server
    const linkFormInput = getByLabelText('Link');
    const loginButton = getByRole('button', {name: 'Login'});
    userEvent.type(linkFormInput, '    https://url.co?token=bad-token     ');

    await waitFor(() => expect(loginButton).toBeEnabled());
    userEvent.press(loginButton);

    await waitFor(() =>
      expect(getByText('TodayTix returned the following error:')).toBeVisible()
    );
    const validationText = getByText(
      'No login token found. Try logging in again or contact TodayTix Support if the issue persists.'
    );
    expect(validationText).toBeVisible();
    expect(loginButton).toBeEnabled();

    // check that validation disappears when typing into the text box
    userEvent.type(linkFormInput, 'k');
    await waitFor(() => expect(validationText).not.toBeOnTheScreen());
  });

  it('displays an AsyncStorage error', async () => {
    // setup mock error response from the TodayTix API
    (
      AsyncStorage.multiSet as jest.MockedFunction<typeof AsyncStorage.multiSet>
    ).mockRejectedValueOnce({message: 'Error with AsyncStorage multiSet'});

    // setup mock success response from the TodayTix API
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .post('/accessTokens')
      .reply(201, {
        code: 201,
        data: {
          _type: 'AccessToken',
          accessToken: 'access-token',
          tokenType: 'Bearer',
          scope: 'customer',
          refreshToken: 'refresh-token',
          expiresIn: 1800
        }
      });

    const Stack = createStackNavigator<RootStack>();
    const {getByRole, getByText, getByLabelText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="EnterLink" component={EnterLinkScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // enter a valid email address
    const loginButton = getByRole('button', {name: 'Login'});
    userEvent.type(getByLabelText('Link'), 'https://url.co?token=good-code');

    await waitFor(() => expect(loginButton).toBeEnabled());
    userEvent.press(loginButton);

    await waitFor(() =>
      expect(
        getByText(
          'There was an error storing the authentication tokens: Error with AsyncStorage multiSet. Please try submitting the link again.'
        )
      ).toBeVisible()
    );
    expect(loginButton).toBeEnabled();
  });

  it('can login successfully', async () => {
    // setup mock success response from the TodayTix API
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .post('/accessTokens')
      .reply(201, {
        code: 201,
        data: {
          _type: 'AccessToken',
          accessToken: 'access-token',
          tokenType: 'Bearer',
          scope: 'customer',
          refreshToken: 'refresh-token',
          expiresIn: 1800
        }
      });

    const Stack = createStackNavigator<RootStack>();
    const {getByRole, getByLabelText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="EnterLink" component={EnterLinkScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // check that async storage is initially empty
    expect(await AsyncStorage.getItem('access-token')).toBeNull();
    expect(await AsyncStorage.getItem('refresh-token')).toBeNull();
    expect(await AsyncStorage.getItem('token-ttl')).toBeNull();

    // enter a valid email address
    userEvent.type(
      getByLabelText('Link'),
      'https://todaytix.com?token=good-code'
    );
    const loginButton = getByRole('button', {name: 'Login'});
    await waitFor(() => expect(loginButton).toBeEnabled());
    userEvent.press(loginButton);

    // check that async storage contains the valid tokens
    await waitFor(async () =>
      expect(await AsyncStorage.getItem('access-token')).toBe('access-token')
    );
    expect(await AsyncStorage.getItem('refresh-token')).toBe('refresh-token');

    const actualTime = Number(await AsyncStorage.getItem('token-ttl'));
    /* TODO: msTolerance is the amount of time the react testing library advanced the fake timers by
    during the await statements. This should be re-thought to not depend on the internals of how the react testing
    library advances the fake timers, but this seems hard because we don't want to have to manually advance
    the timers in every test. Perhaps the delay value from the react testing library can be modified, maybe set to undefined
    or 0? */
    const msTolerance = 500;
    const expectedTime = systemTime.getTime() + 1800 * 1000;
    expect(actualTime).toBeGreaterThanOrEqual(expectedTime - msTolerance);
    expect(actualTime).toBeLessThanOrEqual(expectedTime + msTolerance);
  });
});
