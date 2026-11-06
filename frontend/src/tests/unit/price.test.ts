import { describe, expect, it } from "vitest";
import { formatPrice } from "@/utils/format-price";

describe("formatPrecio", () => {
  it("formats whole amounts with the argentine thousands separator", () => {
    expect(formatPrice(7360)).toBe("$7.360");
    expect(formatPrice(17220)).toBe("$17.220");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0");
  });
});
