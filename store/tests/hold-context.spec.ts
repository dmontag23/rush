import {useContext} from "react";

import {describe, expect, it} from "@jest/globals";
import {renderHook} from "testing-library/extension";

import HoldContext from "../hold-context";

describe("The hold context", () => {
  it("defaults values correctly", () => {
    const {result} = renderHook(() => useContext(HoldContext));

    expect(result.current.isHoldScheduled).toBe(false);
    expect(result.current.isPlacingHold).toBe(false);
    expect(result.current.isHoldError).toBe(false);
    expect(result.current.holdError).toBeNull();
    expect(result.current.hold).toBeUndefined();
    expect(result.current.retry()).toBeUndefined();
  });
});
