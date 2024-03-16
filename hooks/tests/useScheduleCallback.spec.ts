import {describe, expect, it, jest} from "@jest/globals";
import {renderHook} from "testing-library/extension";

import useScheduleCallback from "../useScheduleCallback";

describe("useScheduleCallback hook", () => {
  it("runs callback immediately with 1 call per second", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback();
    expect(callbackFn).not.toBeCalled();
    jest.runOnlyPendingTimers();
    expect(callbackFn).toBeCalledTimes(1);
    jest.advanceTimersByTime(999);
    expect(callbackFn).toBeCalledTimes(1);
    jest.advanceTimersByTime(1);
    expect(callbackFn).toBeCalledTimes(2);
    jest.advanceTimersByTime(999);
    expect(callbackFn).toBeCalledTimes(2);
    jest.advanceTimersByTime(1);
    expect(callbackFn).toBeCalledTimes(3);
  });

  it("runs callback after a delay of 5 seconds with a subsequent 1 call per second", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback({runAtEpochTime: 1621728005});
    jest.advanceTimersByTime(4999);
    expect(callbackFn).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(callbackFn).toBeCalledTimes(1);
    jest.advanceTimersByTime(999);
    expect(callbackFn).toBeCalledTimes(1);
    jest.advanceTimersByTime(1);
    expect(callbackFn).toBeCalledTimes(2);
  });

  it("runs callback immediately with 10 calls per second", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback({callsPerSecond: 10});
    expect(callbackFn).not.toBeCalled();
    jest.runOnlyPendingTimers();
    expect(callbackFn).toBeCalledTimes(1);
    jest.advanceTimersByTime(999);
    expect(callbackFn).toBeCalledTimes(10);
    jest.advanceTimersByTime(1);
    expect(callbackFn).toBeCalledTimes(11);
  });

  it("clears a timeout when stopping callback execution", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback({runAtEpochTime: 1621728005});
    result.current.stopCallbackExecution();
    jest.advanceTimersByTime(5000);
    expect(callbackFn).not.toBeCalled();
  });

  it("clears an interval when stopping callback execution", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback();
    jest.runOnlyPendingTimers();
    expect(callbackFn).toBeCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callbackFn).toBeCalledTimes(2);
    result.current.stopCallbackExecution();
    jest.advanceTimersByTime(1000);
    expect(callbackFn).toBeCalledTimes(2);
  });

  it("does not schedule a new callback if one is already scheduled", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback({runAtEpochTime: 1621728005});
    result.current.scheduleCallback();
    jest.advanceTimersByTime(1000);
    expect(callbackFn).not.toBeCalled();
    jest.advanceTimersByTime(4000);
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("can reschedule a callback", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback({runAtEpochTime: 1621728005});
    jest.advanceTimersByTime(4999);
    expect(callbackFn).not.toBeCalled();
    result.current.stopCallbackExecution();
    result.current.scheduleCallback({runAtEpochTime: 1621728006});
    jest.advanceTimersByTime(1);
    expect(callbackFn).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("clears timeout when unmounted", () => {
    const callbackFn = jest.fn();
    const {result, unmount} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback({runAtEpochTime: 1621728005});
    unmount();
    jest.advanceTimersByTime(5000);
    expect(callbackFn).not.toHaveBeenCalled();
  });

  it("clears interval when unmounted", () => {
    const callbackFn = jest.fn();
    const {result, unmount} = renderHook(() => useScheduleCallback(callbackFn));

    result.current.scheduleCallback();
    jest.advanceTimersByTime(1000);
    expect(callbackFn).toBeCalledTimes(2);
    unmount();
    jest.advanceTimersByTime(1000);
    expect(callbackFn).toBeCalledTimes(2);
  });
});
