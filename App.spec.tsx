import {describe, it, expect} from '@jest/globals';
import {render, waitFor} from '@testing-library/react-native';
import React from 'react';
import App from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import nock from 'nock';
import {TodayTixFieldset, TodayTixLocation} from './types/shows';

describe('The Rush App', () => {
  it('renders the splash screen when loading', () => {
    // setup
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .get('/shows')
      .query({
        areAccessProgramsActive: '1',
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const {getByLabelText} = render(<App />);

    // assert
    expect(getByLabelText('TodayTix logo')).toBeVisible();
  });

  it('renders the initial auth screen without an auth token', async () => {
    // setup
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .get('/shows')
      .query({
        areAccessProgramsActive: '1',
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const {getByText} = render(<App />);

    // assert
    await waitFor(() => expect(getByText('Sign into TodayTix')).toBeVisible());
  });

  it('renders the rush screen with an auth token', async () => {
    // setup
    await AsyncStorage.setItem('access-token', 'access-token');
    nock(process.env.TODAY_TIX_API_BASE_URL)
      .get('/shows')
      .query({
        areAccessProgramsActive: '1',
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .reply(200, {
        code: 200,
        data: [
          {
            id: 1,
            displayName: 'SIX the Musical',
            isRushActive: true,
            images: {productMedia: {appHeroImage: {file: {url: 'test-url'}}}}
          }
        ]
      })
      .get('/shows/1/showtimes/with_rush_availability')
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const {getByText} = render(<App />);

    // assert
    await waitFor(() => expect(getByText('SIX the Musical')).toBeVisible());
  });
});
