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

/** Require a standard email shape: local@domain.tld */
export const registrationEmailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email")
  .max(160, "Email is too long")
  .regex(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Enter a valid email like name@company.com",
  );

/**
 * Normalize a phone value to the 10-digit Indian mobile the UI expects
 * (country code is shown separately as "+91").
 *
 * Strips non-digits, drops a leading `91` or `0` when longer than 10 digits,
 * then keeps the last 10 digits.
 *
 * Examples:
 * - "+91 8499995767" → "8499995767"
 * - "08499995767" → "8499995767"
 * - "8499995767" → "8499995767"
 */
export function normalizeIndianMobile(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10) {
    if (digits.startsWith("91")) {
      digits = digits.slice(2);
    } else if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }
  }
  return digits.slice(-10);
}

/** @deprecated Prefer normalizeIndianMobile — kept for call-site compatibility. */
export function digitsOnly(value: string, _max = 10): string {
  return normalizeIndianMobile(value);
}

export function formatIndianMobileDisplay(digits: string): string {
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}
