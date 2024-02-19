import {describe, it, expect} from '@jest/globals';
import {render, waitFor} from '@testing-library/react-native';
import React from 'react';
import App from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('The Rush App', () => {
  it('should render', () => {
    render(<App />);
  });

  it('should render the initial auth screen without an auth token', () => {
    const {getByText} = render(<App />);

    expect(getByText('Sign into TodayTix')).toBeVisible();
  });

  it('should render the home screen with an auth token', async () => {
    // setup token in async storage
    await AsyncStorage.setItem('access-token', 'access-token');
    const {getByText} = render(<App />);

    await waitFor(() => expect(getByText('Home screen')).toBeVisible());
  });
});
