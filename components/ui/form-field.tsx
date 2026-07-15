import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Text } from "@/components/typography";

export interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
}

export function FormField({
  id,
  label,
  children,
  description,
  error,
  required,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </Label>
      {children}
      {description && !error ? (
        <Text variant="caption" id={`${id}-description`}>
          {description}
        </Text>
      ) : null}
      {error ? (
        <Text variant="caption" className="text-destructive" id={`${id}-error`} role="alert">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
