import { describe, expect, it } from "vitest";
import { getTableFromUrl } from "@/utils/table";

describe("getTableFromUrl", () => {
  it("returns the table number when the qr param is valid", () => {
    expect(getTableFromUrl("?mesa=4")).toBe(4);
    expect(getTableFromUrl("?mesa=4&origen=qr")).toBe(4);
  });

  it("returns null when there is no table param", () => {
    expect(getTableFromUrl("")).toBeNull();
    expect(getTableFromUrl("?otra=1")).toBeNull();
  });

  it("returns null for invalid values so the order is for counter pickup", () => {
    expect(getTableFromUrl("?mesa=abc")).toBeNull();
    expect(getTableFromUrl("?mesa=4a")).toBeNull();
    expect(getTableFromUrl("?mesa=0")).toBeNull();
    expect(getTableFromUrl("?mesa=-1")).toBeNull();
    expect(getTableFromUrl("?mesa=1.5")).toBeNull();
  });
});
