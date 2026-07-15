import { describe, expect, it } from "vitest";
import { registrationEmailSchema } from "@/features/registration/schema";

describe("registrationEmailSchema", () => {
  it("rejects incomplete emails", () => {
    expect(registrationEmailSchema.safeParse("ttt").success).toBe(false);
    expect(registrationEmailSchema.safeParse("test").success).toBe(false);
    expect(registrationEmailSchema.safeParse("a@b").success).toBe(false);
    expect(registrationEmailSchema.safeParse("").success).toBe(false);
  });

  it("accepts standard emails", () => {
    expect(registrationEmailSchema.safeParse("name@company.com").success).toBe(
      true,
    );
    expect(
      registrationEmailSchema.safeParse("  lead@hr.example.in  ").success,
    ).toBe(true);
  });
});
