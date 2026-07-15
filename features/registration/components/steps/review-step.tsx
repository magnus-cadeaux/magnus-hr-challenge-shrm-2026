"use client";

import { m } from "framer-motion";
import { Gift, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Flex, Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import type { RegistrationDraft } from "../../constants";

interface ReviewStepProps {
  draft: RegistrationDraft;
  reduceMotion?: boolean;
  onEdit: (field: "name" | "company" | "mobile" | "email") => void;
  onContinue: () => void;
}

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <Flex justify="between" align="start" className="w-full gap-4">
      <div className="min-w-0">
        <Text variant="micro" className="text-muted-foreground">
          {label}
        </Text>
        <Text variant="heading" className="mt-1 truncate text-base">
          {value || "—"}
        </Text>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit} className="shrink-0">
        Edit
      </Button>
    </Flex>
  );
}

export function ReviewStep({
  draft,
  reduceMotion = false,
  onEdit,
  onContinue,
}: ReviewStepProps) {
  const mobileDisplay = draft.phone
    ? `+91 ${draft.phone.slice(0, 5)} ${draft.phone.slice(5)}`
    : "—";

  return (
    <m.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: durations.slow, ease: easings.outExpo }}
      style={{ willChange: "transform, opacity" }}
    >
      <Stack gap="lg" align="stretch">
        <Stack gap="md" className="rounded-2xl border border-border/60 bg-white/[0.03] p-5">
          <ReviewRow
            label="Name"
            value={draft.fullName}
            onEdit={() => onEdit("name")}
          />
          <Separator tone="subtle" />
          <ReviewRow
            label="Company"
            value={draft.organization}
            onEdit={() => onEdit("company")}
          />
          <Separator tone="subtle" />
          <ReviewRow
            label="Mobile"
            value={mobileDisplay}
            onEdit={() => onEdit("mobile")}
          />
          <Separator tone="subtle" />
          <ReviewRow
            label="Email"
            value={draft.email || "Not shared"}
            onEdit={() => onEdit("email")}
          />
        </Stack>

        <Flex justify="between" align="center" className="gap-4" wrap>
          <Flex gap="sm" align="center">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-blue-300">
              <Timer className="size-4" aria-hidden />
            </div>
            <div>
              <Text variant="micro">Challenge Duration</Text>
              <Text variant="heading" className="text-base">
                ~
                <AnimatedCounter value={90} className="inline" /> seconds
              </Text>
            </div>
          </Flex>

          <Flex gap="sm" align="center">
            <div className="flex size-9 items-center justify-center rounded-xl bg-achievement/15 text-achievement">
              <Gift className="size-4" aria-hidden />
            </div>
            <div>
              <Text variant="micro">Reward</Text>
              <Text variant="heading" className="text-gradient-gold text-base">
                Premium Gift
              </Text>
            </div>
          </Flex>
        </Flex>

        <Button
          size="xl"
          className="w-full"
          onClick={onContinue}
          motionDisabled={reduceMotion}
        >
          Enter the Arena
        </Button>
      </Stack>
    </m.div>
  );
}
