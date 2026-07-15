"use client";

import { Reorder } from "framer-motion";
import { Copy, GripVertical, Pencil, Power } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import {
  CHALLENGE_CATEGORY_LABELS,
  QUESTION_TYPE_LABELS,
} from "@/features/challenge/engine/types";
import { cn } from "@/lib/utils";
import type { ManagedQuestion } from "../types";

interface QuestionListProps {
  questions: ManagedQuestion[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onDuplicate: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function QuestionList({
  questions,
  selectedId,
  onSelect,
  onReorder,
  onDuplicate,
  onToggleActive,
}: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <GlassCard intensity="subtle" padding="lg">
        <Text variant="subtitle" className="text-center">
          No questions yet. Create one or import a JSON/CSV bank.
        </Text>
      </GlassCard>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={questions.map((question) => question.id)}
      onReorder={onReorder}
      className="flex flex-col gap-2"
    >
      {questions.map((question) => {
        const selected = question.id === selectedId;
        return (
          <Reorder.Item
            key={question.id}
            value={question.id}
            className="list-none"
          >
            <GlassCard
              intensity={selected ? "strong" : "subtle"}
              padding="md"
              gradientBorder={selected}
              className={cn(
                "cursor-pointer transition-opacity",
                !question.active && "opacity-55",
              )}
              onClick={() => onSelect(question.id)}
            >
              <Flex gap="md" align="start" className="w-full">
                <button
                  type="button"
                  className="mt-1 touch-none text-muted-foreground"
                  aria-label="Drag to reorder"
                  onClick={(event) => event.stopPropagation()}
                >
                  <GripVertical className="size-5" />
                </button>

                <Stack gap="xs" className="min-w-0 flex-1">
                  <Flex gap="sm" wrap className="items-center">
                    <Badge variant="secondary">
                      {QUESTION_TYPE_LABELS[question.type]}
                    </Badge>
                    <Badge variant="outline">
                      {CHALLENGE_CATEGORY_LABELS[question.category]}
                    </Badge>
                    <Badge variant={question.active ? "default" : "outline"}>
                      {question.active ? "Active" : "Inactive"}
                    </Badge>
                  </Flex>
                  <Text variant="heading" className="line-clamp-2 text-base">
                    {question.prompt || "Untitled question"}
                  </Text>
                  <Text variant="caption" className="truncate">
                    {question.tags.length > 0
                      ? question.tags.join(" · ")
                      : "No tags"}
                    {" · "}
                    Asked {question.stats.timesAsked}×
                  </Text>
                </Stack>

                <Flex gap="xs" className="shrink-0">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Edit"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(question.id);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Duplicate"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDuplicate(question.id);
                    }}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={question.active ? "Disable" : "Enable"}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleActive(question.id);
                    }}
                  >
                    <Power className="size-4" />
                  </Button>
                </Flex>
              </Flex>
            </GlassCard>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}
