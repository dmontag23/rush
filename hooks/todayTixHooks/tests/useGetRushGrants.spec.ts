import {describe, expect, it} from "@jest/globals";
import nock from "nock";
import {renderHook, waitFor} from "testing-library/extension";

import useGetRushGrants from "../useGetRushGrants";

describe("useGetRushGrants hook", () => {
  it("is automatically enabled when rendered", async () => {
    const mockGrants = [{showId: "show-id"}];
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .reply(200, {data: mockGrants});

    const {result} = renderHook(useGetRushGrants);

    await waitFor(() => expect(result.current.data).toEqual(mockGrants));
  });
});
