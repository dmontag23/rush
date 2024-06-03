import {describe, expect, it} from "@jest/globals";

import {pluralize} from "../utils";

describe("pluralize", () => {
  it("returns an empty string when no argument is passed in", () => {
    expect(pluralize()).toBe("");
  });
});
