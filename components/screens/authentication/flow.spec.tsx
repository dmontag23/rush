import {describe, it, expect} from '@jest/globals';
import {render, waitFor, userEvent} from 'testing-library/extension';
import React from 'react';
import nock from 'nock';
import RootNavigator from '../RootNavigator';

describe('The authentication flow', () => {
  it('displays a splash screen when loading the auth token', async () => {
    const {getByLabelText} = render(<RootNavigator />);
    expect(getByLabelText('TodayTix logo')).toBeVisible();
  });

  // TODO: Find a way to test the closed and open dots?

  it('can navigate back to the previous screen', async () => {
    // setup mock success response
    console.log('API URL: ', process.env.TODAY_TIX_API_BASE_URL);
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .post('/loginTokens')
      .reply(201, {code: 201, data: {}});

    const {getByRole, getByText, getByLabelText} = render(<RootNavigator />);
    await waitFor(() => expect(getByText('Sign into TodayTix')).toBeVisible());

    // enter a good email address
    const emailFormInput = getByLabelText('Email');
    const continueButton = getByRole('button', {name: 'Continue'});
    userEvent.type(emailFormInput, 'good@gmail.com');
    await waitFor(() => expect(continueButton).toBeEnabled());
    userEvent.press(continueButton);

    // check that the next auth screen is visible
    await waitFor(() => expect(getByLabelText('Go back')).toBeVisible());

    // navigate back to the previous screen
    userEvent.press(getByLabelText('Go back'));
    await waitFor(() => expect(continueButton).toBeVisible());
    expect(emailFormInput).toHaveProp('value', '');
  });
});
