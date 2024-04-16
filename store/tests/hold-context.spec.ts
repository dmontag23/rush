import {useContext} from "react";

import {describe, expect, it} from "@jest/globals";
import {renderHook} from "testing-library/extension";

import HoldContext from "../hold-context";

describe("The hold context", () => {
  it("defaults values correctly", () => {
    const {result} = renderHook(() => useContext(HoldContext));

    expect(result.current.hold).toBeUndefined();
  });
});
