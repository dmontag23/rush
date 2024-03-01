import {describe, it, expect} from '@jest/globals';
import {render, waitFor, userEvent} from 'testing-library/extension';
import React from 'react';
import nock from 'nock';
import EnterEmailScreen from '../EnterEmailScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStack} from '../../RootNavigator';
import {NavigationContainer} from '@react-navigation/native';

describe('Email screen', () => {
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

    // enter an invalid email address
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
        message: 'TodayTix error'
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
    const emailFormInput = getByLabelText('Email');
    const continueButton = getByRole('button', {name: 'Continue'});
    userEvent.type(emailFormInput, '    good@gmail.com     ');
    await waitFor(() => expect(continueButton).toBeEnabled());
    userEvent.press(continueButton);
    await waitFor(() => expect(continueButton).toBeDisabled());

    await waitFor(() =>
      expect(getByText('TodayTix returned the following error:')).toBeVisible()
    );
    const validationText = getByText('TodayTix error');
    expect(validationText).toBeVisible();
    expect(continueButton).toBeEnabled();

    // check that validation disappears when typing into the text box
    userEvent.type(emailFormInput, 'k');
    await waitFor(() => expect(validationText).not.toBeOnTheScreen());
  });
});
