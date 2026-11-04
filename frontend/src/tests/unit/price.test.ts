import { describe, expect, it } from "vitest";
import { formatPrecio } from "@/lib/price";

describe("formatPrecio", () => {
  it("formats whole amounts with the argentine thousands separator", () => {
    expect(formatPrecio(7360)).toBe("$7.360");
    expect(formatPrecio(17220)).toBe("$17.220");
  });

  it("formats zero", () => {
    expect(formatPrecio(0)).toBe("$0");
  });
});
