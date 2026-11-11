import { describe, it, expect } from "vitest";
import { marketQuote } from "./quotes";

const port = { reserves: [500, 500, 500], cred_reserve: 1000, fee_bps: 300 };
describe("deployed contract market quotes", () => {
  it("charges the contract's 30 CRED minimum on a 300 CRED buy", () => {
    expect(marketQuote(port, 0, "300", "buy")).toBe("106");
  });
  it("charges the same minimum when selling 100 goods", () => {
    expect(marketQuote(port, 0, "100", "sell")).toBe("136");
  });
  it("caps the fee at the input or gross proceeds", () => {
    expect(marketQuote(port, 0, "10", "buy")).toBe("0");
    expect(marketQuote(port, 0, "1", "sell")).toBe("0");
  });
  it("rejects invalid or fractional amounts without throwing", () => {
    for (const amount of ["", "-1", "1.5", "oops"]) {
      expect(marketQuote(port, 0, amount, "buy")).toBe("0");
    }
  });
});
