import { z } from "zod";

export const registrationNameSchema = z
  .string()
  .trim()
  .min(1, "Enter your name")
  .max(120, "Name is too long");

export const registrationCompanySchema = z
  .string()
  .trim()
  .min(1, "Select or enter your organization")
  .max(160, "Organization name is too long");

export const registrationMobileSchema = z
  .string()
  .trim()
  .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number");

/** Email is collected without blocking validation. */
export const registrationEmailSchema = z.string().trim().max(160);

export function digitsOnly(value: string, max = 10): string {
  return value.replace(/\D/g, "").slice(0, max);
}

export function formatIndianMobileDisplay(digits: string): string {
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}
