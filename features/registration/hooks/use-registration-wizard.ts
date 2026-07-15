"use client";

import { useCallback, useMemo, useState } from "react";
import {
  INITIAL_REGISTRATION_DRAFT,
  REGISTRATION_STEPS,
  type RegistrationDraft,
  type RegistrationStepId,
} from "../constants";
import {
  digitsOnly,
  registrationCompanySchema,
  registrationMobileSchema,
  registrationNameSchema,
} from "../schema";

export function useRegistrationWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<RegistrationDraft>(INITIAL_REGISTRATION_DRAFT);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const step = REGISTRATION_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === REGISTRATION_STEPS.length - 1;
  const isReview = step.id === "review";

  const updateField = useCallback(
    <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => {
      setDraft((current) => ({ ...current, [key]: value }));
      if (key === "fullName") setNameError(null);
      if (key === "organization") setCompanyError(null);
      if (key === "phone") setMobileError(null);
    },
    [],
  );

  const setPhoneDigits = useCallback((value: string) => {
    updateField("phone", digitsOnly(value));
  }, [updateField]);

  const validateCurrent = useCallback((): boolean => {
    const id = REGISTRATION_STEPS[stepIndex].id;

    if (id === "name") {
      const result = registrationNameSchema.safeParse(draft.fullName);
      if (!result.success) {
        setNameError(result.error.issues[0]?.message ?? "Enter your name");
        return false;
      }
      setNameError(null);
      return true;
    }

    if (id === "company") {
      const result = registrationCompanySchema.safeParse(draft.organization);
      if (!result.success) {
        setCompanyError(
          result.error.issues[0]?.message ?? "Enter your organization",
        );
        return false;
      }
      setCompanyError(null);
      return true;
    }

    if (id === "mobile") {
      const result = registrationMobileSchema.safeParse(draft.phone);
      if (!result.success) {
        setMobileError(
          result.error.issues[0]?.message ?? "Enter a valid mobile number",
        );
        return false;
      }
      setMobileError(null);
      return true;
    }

    return true;
  }, [draft.fullName, draft.organization, draft.phone, stepIndex]);

  const goNext = useCallback(() => {
    if (isLast) return false;
    if (!validateCurrent()) return false;
    setDirection(1);
    setStepIndex((index) => Math.min(index + 1, REGISTRATION_STEPS.length - 1));
    return true;
  }, [isLast, validateCurrent]);

  const goBack = useCallback(() => {
    if (isFirst) return false;
    setDirection(-1);
    setStepIndex((index) => Math.max(index - 1, 0));
    setNameError(null);
    setCompanyError(null);
    setMobileError(null);
    return true;
  }, [isFirst]);

  const goToStep = useCallback((id: RegistrationStepId) => {
    const nextIndex = REGISTRATION_STEPS.findIndex((item) => item.id === id);
    if (nextIndex < 0) return;
    setDirection(nextIndex > stepIndex ? 1 : -1);
    setStepIndex(nextIndex);
  }, [stepIndex]);

  const progress = useMemo(() => step.progress, [step.progress]);

  return {
    draft,
    step,
    stepIndex,
    direction,
    progress,
    isFirst,
    isLast,
    isReview,
    nameError,
    companyError,
    mobileError,
    updateField,
    setPhoneDigits,
    goNext,
    goBack,
    goToStep,
    validateCurrent,
  } as const;
}

export type RegistrationWizard = ReturnType<typeof useRegistrationWizard>;
