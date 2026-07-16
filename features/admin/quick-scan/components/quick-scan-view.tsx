"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BadgeScanner, type BadgeScanFields } from "@/features/badge-scan";
import { BrandMark } from "@/components/ui/brand-mark";
import { Button } from "@/components/ui/button";
import { GradientBackground } from "@/components/ui/gradient-background";
import { PageContainer } from "@/components/ui/page-container";
import { Flex, Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { ROUTES } from "@/lib/constants";
import {
  countQuickScansToday,
  saveQuickScanContact,
  toQuickScanContact,
  type QuickScanContact,
} from "../lib/quick-scan-contacts";

function formatPhoneDisplay(phone: string): string {
  if (!phone) return "—";
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
}

export function QuickScanView() {
  const [preview, setPreview] = useState<QuickScanContact | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [clearMessageKey, setClearMessageKey] = useState(0);

  const refreshCount = useCallback(async () => {
    const count = await countQuickScansToday();
    setTodayCount(count);
  }, []);

  useEffect(() => {
    void refreshCount();
  }, [refreshCount]);

  const handleScan = useCallback((fields: BadgeScanFields) => {
    setSaveError(null);
    setFlash(null);
    setPreview(toQuickScanContact(fields));
  }, []);

  const resetReady = useCallback(() => {
    setPreview(null);
    setSaveError(null);
    setClearMessageKey((key) => key + 1);
  }, []);

  const handleSave = useCallback(async () => {
    if (!preview || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const result = await saveQuickScanContact(preview);
      if (!result.ok) {
        setSaveError(result.error);
        return;
      }
      setFlash("Contact saved");
      resetReady();
      await refreshCount();
      window.setTimeout(() => setFlash(null), 1600);
    } finally {
      setSaving(false);
    }
  }, [preview, refreshCount, resetReady, saving]);

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <GradientBackground variant="arena" withOrb />
      <div className="pointer-events-none absolute inset-0 bg-navy-950/50" />

      <PageContainer className="relative z-10 py-8 md:py-12">
        <Stack gap="xl" className="mx-auto w-full max-w-xl pb-16">
          <Flex justify="between" align="center" className="gap-4" wrap>
            <Link
              href={ROUTES.admin}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-200/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Control Center
            </Link>
            <BrandMark size="sm" />
          </Flex>

          <Stack gap="sm">
            <Text variant="eyebrow" className="text-blue-200/70">
              Staff tool
            </Text>
            <Text variant="display" gradient="blue" className="tracking-tight">
              Quick Contact Scan
            </Text>
            <Text variant="subtitle" className="text-lg text-blue-100/75">
              Capture badge contacts without starting the challenge.
            </Text>
          </Stack>

          <Text
            variant="heading"
            className="text-center text-xl tabular-nums text-blue-50 md:text-2xl"
          >
            {todayCount} contact{todayCount === 1 ? "" : "s"} saved today
          </Text>

          {flash ? (
            <Text
              variant="caption"
              className="text-center text-emerald-300/90"
              role="status"
            >
              {flash}
            </Text>
          ) : null}

          {!preview ? (
            <BadgeScanner
              onScan={handleScan}
              buttonLabel="Scan Badge"
              buttonSize="xl"
              failMessage="Couldn't read that, try again"
              deniedMessage="Camera unavailable — check permissions and try again."
              idleHint="Point the camera at a SHRM badge QR"
              successMessage={null}
              clearMessageKey={clearMessageKey}
              className="[&_button]:min-h-16 [&_button]:w-full [&_button]:text-lg"
            />
          ) : (
            <Stack gap="lg" className="w-full">
              <Stack
                gap="md"
                className="rounded-2xl border border-border/60 bg-white/[0.03] p-5"
              >
                <PreviewRow label="Name" value={preview.fullName || "—"} />
                <PreviewRow
                  label="Organization"
                  value={preview.organization || "—"}
                />
                <PreviewRow label="Title" value={preview.title || "—"} />
                <PreviewRow
                  label="Phone"
                  value={formatPhoneDisplay(preview.phone)}
                />
                <PreviewRow label="Email" value={preview.email || "—"} />
              </Stack>

              {saveError ? (
                <Text variant="caption" className="text-destructive" role="alert">
                  {saveError}
                </Text>
              ) : null}

              <Flex gap="sm" className="w-full" wrap>
                <Button
                  size="xl"
                  className="min-w-[12rem] flex-1"
                  disabled={saving}
                  onClick={() => {
                    void handleSave();
                  }}
                >
                  {saving ? "Saving…" : "Save Contact"}
                </Button>
                <Button
                  size="xl"
                  variant="secondary"
                  className="min-w-[8rem]"
                  disabled={saving}
                  onClick={resetReady}
                >
                  Discard
                </Button>
              </Flex>

              <Text variant="caption" className="text-muted-foreground">
                Nothing is saved until you tap Save Contact.
              </Text>
            </Stack>
          )}
        </Stack>
      </PageContainer>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text variant="micro" className="text-muted-foreground">
        {label}
      </Text>
      <Text variant="heading" className="mt-1 text-base break-words">
        {value}
      </Text>
    </div>
  );
}
