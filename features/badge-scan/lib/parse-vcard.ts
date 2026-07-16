/**
 * Parse a standard vCard 3.0 payload (e.g. SHRM badge QR).
 * Returns null when the payload is not a usable vCard.
 */
export interface BadgeScanFields {
  fullName: string;
  organization: string;
  phone: string;
  email: string;
  title: string;
}

function unfoldVCard(raw: string): string {
  // RFC 2425 line folding: CRLF + space/tab continues the previous line.
  return raw.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
}

function parseNameField(value: string): string {
  // N: Last;First;Middle;Prefix;Suffix
  const parts = value.split(";");
  const last = (parts[0] ?? "").trim();
  const first = (parts[1] ?? "").trim();
  const middle = (parts[2] ?? "").trim();
  return [first, middle, last].filter(Boolean).join(" ").trim();
}

function stripTypeParams(line: string): { key: string; value: string } | null {
  const colon = line.indexOf(":");
  if (colon <= 0) return null;
  const left = line.slice(0, colon).trim();
  const value = line.slice(colon + 1).trim();
  const key = left.split(";")[0]?.toUpperCase() ?? "";
  if (!key) return null;
  return { key, value };
}

export function parseVCard(raw: string): BadgeScanFields | null {
  const text = unfoldVCard(raw.trim());
  if (!/BEGIN:VCARD/i.test(text) || !/END:VCARD/i.test(text)) {
    return null;
  }

  let fullName = "";
  let organization = "";
  let phone = "";
  let email = "";
  let title = "";
  let structuredName = "";

  for (const line of text.split(/\r?\n/)) {
    const parsed = stripTypeParams(line);
    if (!parsed) continue;
    const { key, value } = parsed;
    if (!value) continue;

    switch (key) {
      case "FN":
        fullName = value;
        break;
      case "N":
        structuredName = parseNameField(value);
        break;
      case "ORG":
        organization = value.split(";")[0]?.trim() ?? value;
        break;
      case "TITLE":
        title = value;
        break;
      case "TEL":
        if (!phone) phone = value;
        break;
      case "EMAIL":
        if (!email) email = value;
        break;
      default:
        break;
    }
  }

  if (!fullName && structuredName) fullName = structuredName;

  if (!fullName && !organization && !phone && !email) {
    return null;
  }

  return {
    fullName,
    organization,
    phone,
    email,
    title,
  };
}
