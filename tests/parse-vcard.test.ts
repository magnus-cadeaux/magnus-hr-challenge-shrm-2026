import { describe, expect, it } from "vitest";
import { parseVCard } from "@/features/badge-scan";

const SAMPLE = `BEGIN:VCARD
VERSION:3.0
N:Sharma;Priya;;;
FN:Priya Sharma
ORG:Acme People Solutions
TITLE:CHRO
TEL;TYPE=CELL:+91 98765 43210
EMAIL:priya.sharma@acme.example
END:VCARD`;

describe("parseVCard", () => {
  it("parses SHRM-style vCard 3.0 fields", () => {
    expect(parseVCard(SAMPLE)).toEqual({
      fullName: "Priya Sharma",
      organization: "Acme People Solutions",
      phone: "+91 98765 43210",
      email: "priya.sharma@acme.example",
      title: "CHRO",
    });
  });

  it("returns null for non-vCard payloads", () => {
    expect(parseVCard("https://example.com")).toBeNull();
    expect(parseVCard("")).toBeNull();
  });

  it("uses N when FN is missing", () => {
    const raw = `BEGIN:VCARD
VERSION:3.0
N:Patel;Asha;;;
ORG:Magnus
EMAIL:asha@example.com
END:VCARD`;
    expect(parseVCard(raw)?.fullName).toBe("Asha Patel");
  });
});
