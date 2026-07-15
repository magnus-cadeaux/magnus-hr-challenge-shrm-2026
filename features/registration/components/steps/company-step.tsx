"use client";

import { CompanyAutocomplete } from "../company-autocomplete";

interface CompanyStepProps {
  value: string;
  error?: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function CompanyStep({
  value,
  error,
  onChange,
  onSubmit,
}: CompanyStepProps) {
  return (
    <CompanyAutocomplete
      value={value}
      error={error}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
