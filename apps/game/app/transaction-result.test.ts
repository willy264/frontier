import { describe, expect, it } from "vitest";
import { builtShipId } from "./transaction-result";

describe("new ship selection", () => {
  it("uses the ID returned by the live build receipt even before final views catch up", () => {
    // The recording built ship 4 successfully but the old view scan left Fleet empty.
    expect(builtShipId({ SuccessValue: "NA==" })).toBe("4");
    expect(builtShipId({ SuccessValue: btoa("123") })).toBe("123");
  });
  it("does not invent an ID from an error, empty return, or malformed receipt", () => {
    for (const status of [null, "Started", {}, { Failure: {} }, { SuccessValue: "" }, { SuccessValue: "!" }, { SuccessValue: btoa("-1") }, { SuccessValue: btoa('"4"') }]) {
      expect(builtShipId(status)).toBeNull();
    }
  });
});
