import type { LucideIcon } from "lucide-react";
import { Building2, Hand, Mail, Smartphone, Sparkles } from "lucide-react";

export const ORGANIZATION_SUGGESTIONS = [
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
  "Other",
] as const;

export type OrganizationSuggestion = (typeof ORGANIZATION_SUGGESTIONS)[number];

export type RegistrationStepId =
  | "name"
  | "company"
  | "mobile"
  | "email"
  | "review";

export type RegistrationStepDefinition = {
  id: RegistrationStepId;
  number: number;
  progress: number;
  title: string;
  icon: LucideIcon;
};

export const REGISTRATION_STEPS: RegistrationStepDefinition[] = [
  {
    id: "name",
    number: 1,
    progress: 20,
    title: "What should we call you?",
    icon: Hand,
  },
  {
    id: "company",
    number: 2,
    progress: 40,
    title: "Which organization do you represent today?",
    icon: Building2,
  },
  {
    id: "mobile",
    number: 3,
    progress: 60,
    title: "What's your mobile number?",
    icon: Smartphone,
  },
  {
    id: "email",
    number: 4,
    progress: 80,
    title: "What's your work email?",
    icon: Mail,
  },
  {
    id: "review",
    number: 5,
    progress: 100,
    title: "Looking good. Ready when you are.",
    icon: Sparkles,
  },
];

export type RegistrationDraft = {
  fullName: string;
  organization: string;
  phone: string;
  email: string;
};

export const INITIAL_REGISTRATION_DRAFT: RegistrationDraft = {
  fullName: "",
  organization: "",
  phone: "",
  email: "",
};
