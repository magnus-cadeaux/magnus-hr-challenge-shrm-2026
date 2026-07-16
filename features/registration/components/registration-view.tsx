"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { BrandMark } from "@/components/ui/brand-mark";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Stack } from "@/components/layout";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ROUTES } from "@/lib/constants";
import { useRegistrationWizard } from "../hooks/use-registration-wizard";
import { persistParticipantDraft } from "@/features/sales/engine/compose-from-local";
import { StepFrame } from "./step-frame";
import { NameStep } from "./steps/name-step";
import { CompanyStep } from "./steps/company-step";
import { MobileStep } from "./steps/mobile-step";
import { EmailStep } from "./steps/email-step";
import { ReviewStep } from "./steps/review-step";
import { BadgeScanPanel } from "./badge-scan-panel";

export function RegistrationView() {
  const router = useRouter();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wizard = useRegistrationWizard();
  const { goBack, goNext, goToStep, updateField, setPhoneDigits } = wizard;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      goBack();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goBack]);

  const primaryLabel = wizard.step.id === "email" ? "Continue" : "Next";

  return (
    <PageContainer className="flex flex-col justify-center py-8 md:py-12">
      <VisuallyHidden>
        <h1>Registration · Magnus HR Challenge</h1>
      </VisuallyHidden>

      <Stack gap="lg" className="mx-auto w-full max-w-xl">
        <BrandMark size="md" className="self-start" />

        {wizard.step.id === "name" ? (
          <BadgeScanPanel
            reduceMotion={reduceMotion}
            onScan={(fields) => {
              if (fields.fullName) updateField("fullName", fields.fullName);
              if (fields.organization) {
                updateField("organization", fields.organization);
              }
              if (fields.phone) setPhoneDigits(fields.phone);
              if (fields.email) updateField("email", fields.email);
            }}
          />
        ) : null}

      <StepFrame
        step={wizard.step}
        direction={wizard.direction}
        reduceMotion={reduceMotion}
        isFirst={wizard.isFirst}
        primaryLabel={primaryLabel}
        hidePrimary={wizard.isReview}
        onBack={goBack}
        onNext={goNext}
      >
        {wizard.step.id === "name" ? (
          <NameStep
            value={wizard.draft.fullName}
            error={wizard.nameError}
            onChange={(value) => updateField("fullName", value)}
            onSubmit={goNext}
          />
        ) : null}

        {wizard.step.id === "company" ? (
          <CompanyStep
            value={wizard.draft.organization}
            error={wizard.companyError}
            onChange={(value) => updateField("organization", value)}
            onSubmit={goNext}
          />
        ) : null}

        {wizard.step.id === "mobile" ? (
          <MobileStep
            value={wizard.draft.phone}
            error={wizard.mobileError}
            onChange={setPhoneDigits}
            onSubmit={goNext}
          />
        ) : null}

        {wizard.step.id === "email" ? (
          <EmailStep
            value={wizard.draft.email}
            error={wizard.emailError}
            onChange={(value) => updateField("email", value)}
            onSubmit={goNext}
          />
        ) : null}

        {wizard.step.id === "review" ? (
          <ReviewStep
            draft={wizard.draft}
            reduceMotion={reduceMotion}
            onEdit={(field) => {
              const map = {
                name: "name",
                company: "company",
                mobile: "mobile",
                email: "email",
              } as const;
              goToStep(map[field]);
            }}
            onContinue={() => {
              persistParticipantDraft({
                fullName: wizard.draft.fullName,
                organization: wizard.draft.organization,
                email: wizard.draft.email,
                phone: wizard.draft.phone,
              });
              router.push(ROUTES.challenge);
            }}
          />
        ) : null}
      </StepFrame>
      </Stack>
    </PageContainer>
  );
}
