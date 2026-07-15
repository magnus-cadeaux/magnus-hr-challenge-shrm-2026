import { SIGNATURE_DEFINITIONS } from "@/features/signature/config/signatures";

export const MOCK_COMPANIES = [
  "Google",
  "Microsoft",
  "Apple",
  "IBM",
  "Infosys",
  "Qualcomm",
  "ServiceNow",
  "Salesforce",
  "Micron",
  "Eli Lilly",
  "Carelon",
  "Amgen",
  "Deloitte",
  "Accenture",
  "TCS",
] as const;

export const MOCK_FIRST_NAMES = [
  "Aanya",
  "Rohan",
  "Priya",
  "Arjun",
  "Meera",
  "Kabir",
  "Anika",
  "Dev",
  "Sara",
  "Vikram",
  "Nisha",
  "Ishaan",
  "Leila",
  "Omar",
  "Tara",
  "Neil",
  "Zara",
  "Aditya",
  "Kiara",
  "Samir",
] as const;

export const MOCK_LAST_NAMES = [
  "Sharma",
  "Patel",
  "Reddy",
  "Iyer",
  "Khan",
  "Nair",
  "Das",
  "Kapoor",
  "Mehta",
  "Singh",
  "Rao",
  "Banerjee",
  "Chen",
  "Park",
  "Williams",
] as const;

export const SIGNATURE_CATALOG = SIGNATURE_DEFINITIONS.map((def) => ({
  id: def.id,
  name: def.name,
}));

/** Initial mock participant count before live simulation grows. */
export const INITIAL_PARTICIPANT_COUNT = 42;

/** Initial rewards collected baseline. */
export const INITIAL_REWARDS_COLLECTED = 31;
