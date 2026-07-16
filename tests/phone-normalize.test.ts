import { describe, expect, it } from "vitest";
import { normalizeIndianMobile } from "@/features/registration/schema";

describe("normalizeIndianMobile", () => {
  it("strips +91 country code and keeps the last 10 digits", () => {
    expect(normalizeIndianMobile("+91 8499995767")).toBe("8499995767");
    expect(normalizeIndianMobile("918499995767")).toBe("8499995767");
  });

  it("strips a leading zero when longer than 10 digits", () => {
    expect(normalizeIndianMobile("08499995767")).toBe("8499995767");
  });

  it("keeps an already-clean 10-digit mobile", () => {
    expect(normalizeIndianMobile("8499995767")).toBe("8499995767");
  });

  it("ignores spaces and dashes", () => {
    expect(normalizeIndianMobile("84999-95767")).toBe("8499995767");
    expect(normalizeIndianMobile("+91-84999 95767")).toBe("8499995767");
  });

  it("does not take the first 10 raw digits (regression)", () => {
    expect(normalizeIndianMobile("+91 8499995767")).not.toBe("9184999957");
  });
});
