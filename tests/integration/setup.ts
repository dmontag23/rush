import '@testing-library/react-native/extend-expect';
import {jest, beforeEach, afterEach} from '@jest/globals';
import nock from 'nock';
/* The following import is needed for react navigation. 
See https://reactnavigation.org/docs/testing/ */
import 'react-native-gesture-handler/jestSetup';

/* The following import and mock are needed for AsyncStorage.
See https://react-native-async-storage.github.io/async-storage/docs/advanced/jest */
import MockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => MockAsyncStorage);

beforeEach(() => {
  /* useFakeTimers is needed for animated components
  see https://github.com/jestjs/jest/issues/6434 */
  jest.useFakeTimers();
});

afterEach(() => {
  nock.cleanAll();
  MockAsyncStorage.clear();
});
