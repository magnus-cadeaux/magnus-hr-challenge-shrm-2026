import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email address");

export const phoneSchema = z
  .string()
  .trim()
  .min(10, "Enter a valid phone number")
  .max(20, "Enter a valid phone number");

export const nonEmptyStringSchema = z.string().trim().min(1, "This field is required");

export const participantRegistrationSchema = z.object({
  fullName: nonEmptyStringSchema.max(120),
  email: emailSchema,
  organization: nonEmptyStringSchema.max(160),
  designation: nonEmptyStringSchema.max(120),
  phone: phoneSchema.optional().or(z.literal("")),
});

export type ParticipantRegistrationInput = z.infer<typeof participantRegistrationSchema>;
