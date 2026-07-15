"use client";

import { useEffect, useRef, useState } from "react";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { persistSalesNotes, readSalesNotes } from "../engine/session-reader";

interface QuickNotesProps {
  sessionId: string;
}

export function QuickNotes({ sessionId }: QuickNotesProps) {
  const [notes, setNotes] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    hydrated.current = false;
    setNotes(readSalesNotes(sessionId));
    const frame = window.requestAnimationFrame(() => {
      hydrated.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [sessionId]);

  useEffect(() => {
    if (!hydrated.current) return;
    const timer = window.setTimeout(() => {
      persistSalesNotes(sessionId, notes);
      setSavedFlash(true);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [notes, sessionId]);

  useEffect(() => {
    if (!savedFlash) return;
    const timer = window.setTimeout(() => setSavedFlash(false), 1200);
    return () => window.clearTimeout(timer);
  }, [savedFlash]);

  return (
    <Stack gap="md">
      <div className="flex items-end justify-between gap-3">
        <Text variant="heading" className="text-xl md:text-2xl">
          Quick Notes
        </Text>
        <Text variant="micro" className="text-muted-foreground">
          {savedFlash ? "Saved locally" : "Auto-saves on this device"}
        </Text>
      </div>
      <GlassCard intensity="default" padding="md">
        <Textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Capture rapport, objections, next steps…"
          className="min-h-36 border-0 bg-transparent px-2 py-2 shadow-none hover:border-0 focus-visible:border-0 md:text-base"
          aria-label="Quick notes"
        />
      </GlassCard>
    </Stack>
  );
}
