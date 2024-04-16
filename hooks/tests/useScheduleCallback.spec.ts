import {describe, expect, it, jest} from "@jest/globals";
import {renderHook} from "testing-library/extension";

import useScheduleCallback from "../useScheduleCallback";

describe("useScheduleCallback hook", () => {
  it("runs callback immediately by default", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback();
    expect(callbackFn).not.toBeCalled();
    jest.runOnlyPendingTimers();
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("runs callback after a delay of 5 seconds", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback(
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
    );
    jest.advanceTimersByTime(4999);
    expect(callbackFn).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("clears a timeout when cancelling callback execution", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback(
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
    );
    result.current.cancelScheduledExecution();
    jest.advanceTimersByTime(5000);
    expect(callbackFn).not.toBeCalled();
  });

  it("does not schedule a new callback if one is already scheduled", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback(
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
    );
    result.current.scheduleCallback();
    jest.advanceTimersByTime(1000);
    expect(callbackFn).not.toBeCalled();
    jest.advanceTimersByTime(4000);
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("can reschedule a callback", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback(
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
    );
    jest.advanceTimersByTime(4999);
    expect(callbackFn).not.toBeCalled();
    result.current.cancelScheduledExecution();
    result.current.scheduleCallback(
      new Date(2021, 4, 23, 0, 0, 6).getTime() / 1000
    );
    jest.advanceTimersByTime(1);
    expect(callbackFn).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("clears timeout when unmounted", () => {
    const callbackFn = jest.fn();
    const {result, unmount} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback(
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
    );
    unmount();
    jest.advanceTimersByTime(5000);
    expect(callbackFn).not.toHaveBeenCalled();
  });
});
