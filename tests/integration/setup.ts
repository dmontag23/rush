/* The following import is needed for react navigation. 
See https://reactnavigation.org/docs/testing/ */

/* The following import and mock are needed for AsyncStorage.
See https://react-native-async-storage.github.io/async-storage/docs/advanced/jest */
import {afterEach, beforeAll, beforeEach, jest} from "@jest/globals";
import MockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import "@testing-library/react-native/extend-expect";
import nock from "nock";
import "react-native-gesture-handler/jestSetup";

jest.mock("@react-native-async-storage/async-storage", () => MockAsyncStorage);

export const systemTime = new Date(2021, 4, 23);

beforeAll(() => {
  /* useFakeTimers is needed for animated components
  see https://github.com/jestjs/jest/issues/6434
  the doNotFake option is due to an open issue with nock/react testing library
  see https://github.com/nock/nock/issues/2200 */
  jest.useFakeTimers({doNotFake: ["nextTick", "setImmediate"]});
});

beforeEach(() => {
  jest.setSystemTime(systemTime);
});

afterEach(() => {
  nock.abortPendingRequests();
  nock.cleanAll();
  MockAsyncStorage.clear();
});
