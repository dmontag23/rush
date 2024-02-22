import {describe, it, expect} from '@jest/globals';
import {render, waitFor, userEvent} from 'testing-library/extension';
import React from 'react';
import nock from 'nock';
import EnterEmailScreen from './EnterEmailScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStack} from '../RootNavigator';
import {NavigationContainer} from '@react-navigation/native';

describe('email screen', () => {
  it('displays elements in their initial state on the screen', async () => {
    const Stack = createStackNavigator<RootStack>();
    const {getByRole, getByText, getByLabelText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="EnterEmail" component={EnterEmailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByText('Sign into TodayTix')).toBeVisible();
    expect(getByText("What's your email?")).toBeVisible();
    const emailFormInput = getByLabelText('Email');
    expect(emailFormInput).toBeVisible();
    expect(emailFormInput).toHaveProp('value', '');
    const continueButton = getByRole('button', {name: 'Continue'});
    expect(continueButton).toBeVisible();
    expect(continueButton).toBeDisabled();
  });

  it('displays a form validation error', async () => {
    const Stack = createStackNavigator<RootStack>();
    const {getByRole, getByText, getByLabelText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="EnterEmail" component={EnterEmailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // enter a invalid email address
    userEvent.type(getByLabelText('Email'), 'd{Enter}');
    await waitFor(() =>
      expect(getByText('Please enter a valid email address')).toBeVisible()
    );
    expect(getByRole('button', {name: 'Continue'})).toBeDisabled();
  });

  it('displays a TodayTix validation error', async () => {
    // setup mock error response
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .post('/loginTokens')
      .reply(400, {
        code: 400,
        error: 'InvalidParameter',
        context: {
          parameterName: null,
          internalMessage: 'Internal message'
        },
        title: 'Error',
        message: 'Please enter a valid email'
      });

    const Stack = createStackNavigator<RootStack>();
    const {getByRole, getByText, getByLabelText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="EnterEmail" component={EnterEmailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // enter a valid email address that fails on the TodayTix server
    const continueButton = getByRole('button', {name: 'Continue'});
    userEvent.type(getByLabelText('Email'), '    good@gmail.com     ');
    await waitFor(() => expect(continueButton).toBeEnabled());
    userEvent.press(continueButton);

    await waitFor(() =>
      expect(getByText('TodayTix returned the following error:')).toBeVisible()
    );
    expect(getByText('Please enter a valid email')).toBeVisible();
    expect(continueButton).toBeEnabled();
  });
});
