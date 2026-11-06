import { describe, expect, it } from "vitest";
import { getMesaFromUrl } from "@/lib/table";

describe("getMesaFromUrl", () => {
  it("returns the table number when the qr param is valid", () => {
    expect(getMesaFromUrl("?mesa=4")).toBe(4);
    expect(getMesaFromUrl("?mesa=4&origen=qr")).toBe(4);
  });

  it("returns null when there is no table param", () => {
    expect(getMesaFromUrl("")).toBeNull();
    expect(getMesaFromUrl("?otra=1")).toBeNull();
  });

  it("returns null for invalid values so the order is for counter pickup", () => {
    expect(getMesaFromUrl("?mesa=abc")).toBeNull();
    expect(getMesaFromUrl("?mesa=4a")).toBeNull();
    expect(getMesaFromUrl("?mesa=0")).toBeNull();
    expect(getMesaFromUrl("?mesa=-1")).toBeNull();
    expect(getMesaFromUrl("?mesa=1.5")).toBeNull();
  });
});
